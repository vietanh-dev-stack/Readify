import mongoose from 'mongoose'


const categorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    name: String,
    slug: String,
    description: String
}, { timestamps: true })

categorySchema.index({ slug: 1 })

export default mongoose.model('categories', categorySchema)