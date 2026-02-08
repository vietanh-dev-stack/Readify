import mongoose from 'mongoose'


const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    bookIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'books'
        }
    ]

}, { timestamps: true })

wishlistSchema.index({ userId: 1 }, { unique: true })

export default mongoose.model('wishlists', wishlistSchema)