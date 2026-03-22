import mongoose from "mongoose"

const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    name: String,
    phone: String,
    province: String,
    district: String,
    ward: String,
    street: String,
    fullAddress: String,
    isDefault: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })


addressSchema.index(
    { userId: 1, isDefault: 1 },
    { unique: true, partialFilterExpression: { isDefault: true } }
)

export default mongoose.model('addresses', addressSchema)
