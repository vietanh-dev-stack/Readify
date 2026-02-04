import mongoose from 'mongoose'

const seriesSchema = new mongoose.Schema({
    title: String,
    description: String,
    totalVolumes: Number,
    status: {
        type: String,
        enum: ['ongoing', 'completed'],
        default: 'ongoing'
    }
}, { timestamps: true })

export default mongoose.model('series', seriesSchema)