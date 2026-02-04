import mongoose from 'mongoose'


const bookSchema = new mongoose.Schema({
    title: String,
    slug: String,
    description: String,
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories'
    },
    seriesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'series'
    },
    authorIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'authors'
        }
    ],
    publisherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'publishers'
    },
    price: Number,
    discountPrice: Number,
    coverImage: String,
    images: [String],
    pages: Number,
    language: String,
    stock: Number,
    sold: Number,
    ratingAvg: Number,
    ratingCount: Number,
    releaseDate: Date,
    status: {
        type: String,
        enum: ['active', 'hidden', 'out_of_stock'],
        default: 'active'
    }
}, { timestamps: true })

bookSchema.index({ title: 'text', description: 'text' })

export default mongoose.model('books', bookSchema)