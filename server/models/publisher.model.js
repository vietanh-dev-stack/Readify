import mongoose from 'mongoose'

const publisherSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    name: String,
    address: {
        type: String,
        default: ''
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

publisherSchema.index({ name: 1 })

export default mongoose.model('publishers', publisherSchema)