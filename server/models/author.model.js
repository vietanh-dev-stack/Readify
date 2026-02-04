import mongoose from 'mongoose'


const authorSchema = new mongoose.Schema({
    name: String,
    bio: String,
    avatar: String
}, { timestamps: true })

authorSchema.index({ name: 1 })

export default mongoose.model('authors', authorSchema)