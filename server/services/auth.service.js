import bcypt from 'bcryptjs'
import { StatusCodes } from 'http-status-codes'
import env from '../configs/environment.js'
import User from '../models/user.model.js'
import ApiError from '../utils/apiError.js'
import bcrypt from 'bcryptjs'
import JwtProvider from '../providers/jwtProvider.js'
import GoogleProvider from '../providers/googleProvider.js'

const authService = {

    login: async (data) => {
        try {
            const user = await User.findOne({ email: data.email })
            if (!user) {
                throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Email or Password is incorrect')
            }
            const checkValidPassword = await bcypt.compare(data.password, user.password)
            if (!checkValidPassword) {
                throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Emaill or Password is incorrect')
            }

            if (!user.isActive) {
                throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'This account is not activated')
            }

            const userInfo = {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }

            const accessToken = await JwtProvider.generateToken(userInfo, env.ACCESS_TOKEN_SECRET_SIGNATURE, env.ACCESS_TOKEN_LIFE)
            const refreshToken = await JwtProvider.generateToken(userInfo, env.REFRESH_TOKEN_SECRET_SIGNATURE, env.REFRESH_TOKEN_LIFE)

            return {
                userInfo,
                accessToken,
                refreshToken
            }
        } catch (error) {
            throw error
        }
    },

    googleLogin: async (token) => {
        const googleUser = await GoogleProvider.verifyGoogleToken(token)

        const {
            sub,
            email,
            name,
            picture
        } = googleUser

        let user = await User.findOne({ email })
        if (!user) {
            user = await User.create({
                username: name,
                email,
                avatar: picture,
                googleId: sub,
                authProvider: 'google'
            })
        }

        const userInfo = {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            avatar: user.avatar
        }

        const accessToken = await JwtProvider.generateToken(
            userInfo,
            env.ACCESS_TOKEN_SECRET_SIGNATURE,
            env.ACCESS_TOKEN_LIFE
        )

        const refreshToken = await JwtProvider.generateToken(
            userInfo,
            env.REFRESH_TOKEN_SECRET_SIGNATURE,
            env.REFRESH_TOKEN_LIFE
        )

        return {
            userInfo,
            accessToken,
            refreshToken
        }
    },

    register: async (data) => {
        try {
            const user = await User.findOne({ email: data.email })
            if (user) {
                throw new ApiError(StatusCodes.CONFLICT, 'Email already exist')
            }
            const newUser = new User({
                username: data.username,
                email: data.email,
                password: await bcrypt.hash(data.password, 8)
            })
            await newUser.save()
            return { username: newUser.username, email: newUser.email }
        } catch (error) {
            throw error
        }
    }
}

export default authService