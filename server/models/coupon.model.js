import mongoose from 'mongoose'


const couponSchema = new mongoose.Schema({
    code: String,
    value: Number,
    expiredAt: Date,
    usageLimit: Number,
    usedCount: Number,
    discountType: {
        type: String,
        enum: ['percent', 'fixed']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

couponSchema.index({ code: 1 })

export default mongoose.model('coupons', couponSchema)