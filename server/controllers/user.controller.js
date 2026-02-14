import { StatusCodes } from "http-status-codes"
import userService from "../services/user.service.js"


const userController = {

    updateProfile: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const data = { ...req.body, image: req.file }
            const result = await userService.updateProfile(userId, data)
            return res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    }
}

export default userController