import mongoose from 'mongoose'


const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    items: [
        {
            bookId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'books'
            },
            quantity: Number,
            priceAtTime: Number,
            _id: false
        }
    ]
}, { timestamps: true })

export default mongoose.model('carts', cartSchema)