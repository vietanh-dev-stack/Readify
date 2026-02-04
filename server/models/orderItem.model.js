import mongoose from 'mongoose'


const orderItemSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders'
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'books'
    },
    title: String,
    price: Number,
    quantity: Number
}, { timestamps: true })

export default mongoose.model('orderItems', orderItemSchema)