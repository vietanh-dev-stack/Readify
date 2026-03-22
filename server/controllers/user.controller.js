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
    },

    getUser: async (req, res, next) => {
        try {
            const result = await userService.getUser()
            return res.status(StatusCodes.OK).json(result)
        } catch (error) {   
            next(error)
        }
    },

    createUser: async (req, res, next) => {
        try {
            const result = await userService.createUser(req.body)
            return res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    },

    updateRole: async (req, res, next) => {
        try {
            const userId = req.params.id
            const adminId = req.jwtDecoded._id
            const data = req.body
            const result = await userService.updateRole(userId, adminId, data)
            return res.status(StatusCodes.OK).json(result)
        } catch (error) {   
            next(error)
        }
    },

    updateStatus: async (req, res, next) => {
        try {
            const userId = req.params.id
            const adminId = req.jwtDecoded._id
            const result = await userService.updateStatus(userId, adminId)
            return res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    }
}

export default userController