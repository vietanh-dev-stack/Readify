import mongoose from 'mongoose'


const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'books'
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    comment: String,
    createdAt: Date
})

reviewSchema.index({ bookId: 1 })

export default mongoose.model('reviews', reviewSchema)