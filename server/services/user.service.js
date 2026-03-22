import { StatusCodes } from "http-status-codes"
import ApiError from "../utils/apiError.js"
import User from '../models/user.model.js'
import cloudinaryProvider from '../providers/cloudinaryProvider.js'
import bcrypt from 'bcryptjs'

const userService = {


    updateProfile: async (userId, data) => {
        try {
            const user = await User.findById(userId)
            if (!user) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
            }
            if (!user.isActive) {
                throw new ApiError(StatusCodes.FORBIDDEN, 'User account is inactive')
            }

            if (data.username) {
                user.username = data.username
            }

            if (data.phone) {
                user.phone = data.phone
            }

            if (data.image) {
                const uploadResult = await cloudinaryProvider.uploadImageBuffer(
                    data.image.buffer,
                    'Readify/users'
                )
                user.avatar = uploadResult.url
            }

            await user.save()
            return user

        } catch (error) {
            throw error
        }
    },

    getUser: async () => {
        try {
            const users = await User.find()
            const result = users.map((r) => {
                return {
                    _id: r._id,
                    username: r.username,
                    email: r.email,
                    role: r.role,
                    avatar: r.avatar,
                    isActive: r.isActive,
                    createdAt: r.createdAt,
                }
            })
            return result
        } catch (error) {
            throw error
        }
    },

    createUser: async (data) => {
        try {
            const user = await User.findOne({ email: data.email })
            if(user) {
                throw new ApiError(StatusCodes.CONFLICT, 'User already exists')
            }
            
            const hashedPassword = await bcrypt.hash(data.password, 8)
            
            const newUser = await User.create({
                ...data,
                password: hashedPassword
            })
            return newUser
        } catch (error) {
            throw error
        }
    },  

    updateRole: async (userId, adminId, data) => {
        try {
            const user = await User.findById(userId)
            if(!user) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
            }
            const admin = await User.findById(adminId)
            if(admin.role !== 'admin') {
                throw new ApiError(StatusCodes.FORBIDDEN, 'Admin role is required')
            }
            if(user.role === 'admin') {
                throw new ApiError(StatusCodes.FORBIDDEN, 'User role is admin'  )
            }
            user.role = data.role
            await user.save()
            return user
        } catch (error) {
            throw error
        }
    },

    updateStatus:  async (userId, adminId) => {
        try {
            const user = await User.findById(userId)
            if(!user) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
            }
            const admin = await User.findById(adminId)
            if(admin.role !== 'admin') {
                throw new ApiError(StatusCodes.FORBIDDEN, 'Admin role is required')
            }
            if(user.role === 'admin') {
                throw new ApiError(StatusCodes.FORBIDDEN, 'User role is admin'  )
            }
            user.isActive = !user.isActive
            await user.save()
            return user            
        } catch (error) {
            throw error
        }
    }
}


export default userService