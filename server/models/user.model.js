import mongoose from 'mongoose'


const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ['client', 'admin'],
        default: 'client'
    },
    phone: {
        type: String,
        default: null
    },
    address: {
        type: [
            {
                fullAddress: String,
                city: String,
                isDefault: Boolean
            }
        ],
        default: []
    },
    avatar: {
        type: String,
        default: ""
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

userSchema.index({ email: 1 }, { unique: true })
userSchema.index({ role: 1 })

export default mongoose.model('users', userSchema)