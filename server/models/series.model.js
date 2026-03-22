import mongoose from 'mongoose'

const seriesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    title: String,
    description: String,
    totalVolumes: Number,
    status: {
        type: String,
        enum: ['ongoing', 'completed']
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

export default mongoose.model('series', seriesSchema)