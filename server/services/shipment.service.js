import Shipment from '../models/shipment.model.js';
import Order from '../models/order.model.js';
import ApiError from '../utils/apiError.js';
import { StatusCodes } from 'http-status-codes';

const shipmentService = {
    createShipment: async (orderId, shipmentData) => {
        const order = await Order.findById(orderId);
        if (!order) throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found');

        // Prevent creating multiple shipments
        const existingShipment = await Shipment.findOne({ orderId });
        if (existingShipment) {
            throw new ApiError(StatusCodes.CONFLICT, 'Shipment already exists for this order');
        }

        // If order strategy dictates only Paid/COD orders ship
        if (order.paymentMethod !== 'cod' && order.paymentStatus !== 'paid') {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Cannot ship unpaid non-COD order');
        }

        const newShipment = await Shipment.create({
            orderId: order._id,
            provider: shipmentData.provider || 'self',
            trackingNumber: shipmentData.trackingNumber || `TRACK-${Date.now()}-${orderId.toString().slice(-4)}`,
            cost: shipmentData.cost || 0,
            weight: shipmentData.weight || 0,
            dimensions: shipmentData.dimensions || { length: 0, width: 0, height: 0 },
            receiverAddress: {
                name: order.shippingAddress?.name,
                phone: order.shippingAddress?.phone,
                fullAddress: order.shippingAddress?.fullAddress,
                city: order.shippingAddress?.city,
                district: order.shippingAddress?.district,
                ward: order.shippingAddress?.ward,
                street: order.shippingAddress?.street
            },
            status: 'pending',
            events: [{
                status: 'pending',
                message: 'Shipment created and awaiting carrier.',
            }]
        });

        // Sync order status
        if (order.status === 'pending' || order.status === 'paid') {
            order.status = 'shipping';
            await order.save();
        }

        return newShipment;
    },

    getShipmentByOrder: async (orderId) => {
        const shipment = await Shipment.findOne({ orderId });
        if (!shipment) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Shipment not found for this order');
        }
        return shipment;
    },


    addTrackingEvent: async (orderId, eventData) => {
        const { status, message, location } = eventData;
        const validStatuses = ['pending', 'ready_to_ship', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned'];
        
        if (!validStatuses.includes(status)) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid shipment status');
        }

        const shipment = await Shipment.findOne({ orderId });
        if (!shipment) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Shipment not found');
        }

        shipment.status = status;
        shipment.events.push({ status, message, location, timestamp: new Date() });

        if (status === 'delivered') shipment.actualDeliveryDate = new Date();

        await shipment.save();

        // Sync back to order
        if (status === 'delivered') {
            await Order.findByIdAndUpdate(orderId, { status: 'completed' });
        } else if (status === 'returned' || status === 'failed') {
            await Order.findByIdAndUpdate(orderId, { status: 'cancelled' });
        }

        return shipment;
    }
};

export default shipmentService;
