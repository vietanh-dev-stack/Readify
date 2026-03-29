import mongoose from 'mongoose';

const shipmentEventSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['pending', 'ready_to_ship', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned'],
        required: true,
    },
    message: String,
    location: String,
    timestamp: {
        type: Date,
        default: Date.now,
    }
}, { _id: false });

const shipmentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders',
        required: true,
        unique: true
    },
    trackingNumber: {
        type: String,
        index: true
    },
    provider: {
        type: String,
        enum: ['ghtk', 'ghn', 'viettel_post', 'self'],
        default: 'self'
    },
    status: {
        type: String,
        enum: ['pending', 'ready_to_ship', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned'],
        default: 'pending',
        index: true
    },
    cost: {
        type: Number,
        default: 0
    },
    weight: {
        type: Number, // in grams
        default: 0
    },
    dimensions: {
        length: Number, // cm
        width: Number,
        height: Number
    },
    events: [shipmentEventSchema],
    estimatedDeliveryDate: Date,
    actualDeliveryDate: Date,
    receiverAddress: {
        name: String,
        phone: String,
        fullAddress: String,
        city: String,
        district: String,
        ward: String,
        street: String
    },
    shippingDocs: {
        labelUrl: String,
        invoiceUrl: String
    }
}, { timestamps: true });

shipmentSchema.index({ orderId: 1 });
shipmentSchema.index({ trackingNumber: 1 });

export default mongoose.model('shipments', shipmentSchema);
