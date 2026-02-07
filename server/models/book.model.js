import mongoose from 'mongoose'


const bookSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    title: String,
    slug: String,
    description: {
        type: String,
        default: ''
    },
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
    discountPrice: {
        type: Number,
        default: 0
    },
    coverImage: String,
    images: {
        type: [String],
        default: []
    },
    pages: Number,
    bookLanguage: {
        type: String,
        default: ''
    },
    sold: {
        type: Number,
        default: 0
    },
    ratingAvg: {
        type: Number,
        default: 0
    },
    ratingCount: {
        type: Number,
        default: 0
    },
    releaseDate: Date,
    status: {
        type: String,
        enum: ['active', 'hidden', 'out_of_stock'],
        default: 'active'
    }
}, { timestamps: true })

bookSchema.index({ title: 'text', description: 'text' })

export default mongoose.model('books', bookSchema)