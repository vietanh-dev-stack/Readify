import mongoose from 'mongoose'

const publisherSchema = new mongoose.Schema({
    name: String,
    address: String
}, { timestamps: true })

publisherSchema.index({ name: 1 })

export default mongoose.model('publishers', publisherSchema)