import mongoose from 'mongoose'


const categorySchema = new mongoose.Schema({
    name: String,
    slug: String,
    description: String
}, { timestamps: true })

categorySchema.index({ slug: 1 })

export default mongoose.model('categories', categorySchema)