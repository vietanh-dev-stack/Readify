import mongoose from 'mongoose'


const authorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    name: String,
    bio: String,
    avatar: String,
    isDelete: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

authorSchema.index({ name: 1 })

export default mongoose.model('authors', authorSchema)