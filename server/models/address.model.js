import mongoose from "mongoose"

const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    fullAddress: String,
    city: String,
    isDefault: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

addressSchema.index({ userId: 1 })

export default mongoose.model('addresses', addressSchema)
