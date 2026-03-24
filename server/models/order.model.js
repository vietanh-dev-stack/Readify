import mongoose from 'mongoose'


const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    totalPrice: Number,
    discount: Number,
    finalPrice: Number,
    status: {
        type: String,
        enum: ["pending", "paid", "shipping", "completed", "cancelled"],
        default: 'pending'
    },
    shippingAddress: {
        fullAddress: String,
        city: String,
        phone: String,
        name: String
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'momo', 'vnpay'],
        default: 'cod'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    paymentRef: String
}, { timestamps: true })

orderSchema.index({ userId: 1, status: 1 })

export default mongoose.model('orders', orderSchema)