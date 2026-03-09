import { StatusCodes } from "http-status-codes"
import env from "../configs/environment.js"
import ApiError from "../utils/apiError.js"
import JwtProvider from "../providers/jwtProvider.js"


const authMiddleware = {

    isAuthorized: async (req, res, next) => {
        // Get accessToken from cookie or Authorization header
        let accessToken = req.cookies?.accessToken

        if (!accessToken && req.headers.authorization) {
            const parts = req.headers.authorization.split(' ')
            if (parts.length === 2 && parts[0] === 'Bearer') {
                accessToken = parts[1]
            }
        }

        if (!accessToken) {
            next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized(Token not found)'))
            return
        }

        try {
            //verify token
            const accessTokenDecoded = await JwtProvider.verifyToken(accessToken, env.ACCESS_TOKEN_SECRET_SIGNATURE)

            //if token is valid , save token to req to use later
            req.jwtDecoded = accessTokenDecoded
            next()
        } catch (error) {
            if (error?.message?.includes('jwt expired')) {
                next(new ApiError(StatusCodes.GONE, 'Token is expired!'))
                return
            }
            next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized'))
        }
    }

}

export default authMiddleware