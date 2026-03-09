import mongoose from 'mongoose'


const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    googleId: {
        type: String,
        default: null
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    role: {
        type: String,
        enum: ['client', 'admin'],
        default: 'client'
    },
    phone: {
        type: String,
        default: null
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
userSchema.index({ googleId: 1 })

export default mongoose.model('users', userSchema)