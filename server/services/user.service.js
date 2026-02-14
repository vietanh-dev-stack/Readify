import { StatusCodes } from "http-status-codes"
import ApiError from "../utils/apiError.js"
import User from '../models/user.model.js'
import cloudinaryProvider from '../providers/cloudinaryProvider.js'

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

            if(data.username){
                user.username = data.username
            }

            if(data.phone){
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
    }
}


export default userService