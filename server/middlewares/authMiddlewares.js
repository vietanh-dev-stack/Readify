import { StatusCodes } from "http-status-codes"
import env from "../configs/environment.js"
import ApiError from "../utils/apiError.js"
import JwtProvider from "../providers/JwtProvider.js"


const authMiddleware = {

    isAuthorized: async (req, res, next) => {
        //get accessToken from cookie
        const accessToken = req.cookies?.accessToken

        if (!accessToken) {
            next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized(Token not found)'))
        }

        try {
            //verify token
            const decoded = await JwtProvider.verifyToken(accessToken, env.ACCESS_TOKEN_SECRET_SIGNATURE)
            
            //if token is valid , save token to req to use later
            req.user = decoded
            next()
        } catch (error) {
            next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized'))
        }
    }

}

export default authMiddleware