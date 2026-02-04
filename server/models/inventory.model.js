import mongoose from 'mongoose'


const inventorySchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'books'
    },
    quantity: Number,
    reserved: {
        type: Number,
        default: 0
    },
    updatedAt: Date
})

export default mongoose.model('inventories', inventorySchema)