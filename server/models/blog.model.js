import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    title: String,
    slug: String,
    content: String,
    thumbnail: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    }
}, { timestamps: true })

blogSchema.index({ slug: 1 }, { unique: true })
blogSchema.index({ title: 'text', content: 'text' })

export default mongoose.model('blogs', blogSchema)