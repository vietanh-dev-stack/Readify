import { StatusCodes } from "http-status-codes"
import env from "../configs/environment.js"
import userService from '../services/auth.service.js'


const authController = {

    login: async (req, res, next) => {
        try {
            const result = await userService.login(req.body)
            res.cookie('accessToken', result.accessToken, {
                httpOnly: true,
                secure: env.BUILD_MODE === "production" ? true : false,
                sameSite: env.BUILD_MODE === "production" ? "none" : "lax",
                maxAge: 14 * 24 * 60 * 60 * 1000
            })
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: env.BUILD_MODE === "production" ? true : false,
                sameSite: env.BUILD_MODE === "production" ? "none" : "lax",
                maxAge: 14 * 24 * 60 * 60 * 1000
            })
            return res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    },

    googleLogin: async (req, res, next) => {
        try {

            const result = await userService.googleLogin(req.body.token)

            res.cookie('accessToken', result.accessToken, {
                httpOnly: true,
                secure: env.BUILD_MODE === "production",
                sameSite: env.BUILD_MODE === "production" ? "none" : "lax"
            })

            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: env.BUILD_MODE === "production",
                sameSite: env.BUILD_MODE === "production" ? "none" : "lax"
            })

            res.status(StatusCodes.OK).json(result)

        } catch (error) {
            next(error)
        }

    },


    register: async (req, res, next) => {
        try {
            const result = await userService.register(req.body)
            return res.status(StatusCodes.CREATED).json(result)
        } catch (error) {
            next(error)
        }
    }
}

export default authController