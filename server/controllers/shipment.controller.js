import shipmentService from '../services/shipment.service.js';

const shipmentController = {
    createShipment: async (req, res, next) => {
        try {
            const orderId = req.params.orderId;
            const newShipment = await shipmentService.createShipment(orderId, req.body);
            res.status(201).json({
                success: true,
                message: 'Shipment created successfully',
                data: newShipment
            });
        } catch (error) {
            next(error);
        }
    },

    getShipmentInfo: async (req, res, next) => {
        try {
            const orderId = req.params.orderId;
            const shipment = await shipmentService.getShipmentByOrder(orderId);
            res.status(200).json({
                success: true,
                data: shipment
            });
        } catch (error) {
            next(error);
        }
    },

    addTrackingEvent: async (req, res, next) => {
        try {
            const orderId = req.params.orderId;
            const updatedShipment = await shipmentService.addTrackingEvent(orderId, req.body);
            res.status(200).json({
                success: true,
                message: 'Shipment tracking updated successfully',
                data: updatedShipment
            });
        } catch (error) {
            next(error);
        }
    }
};

export default shipmentController;
