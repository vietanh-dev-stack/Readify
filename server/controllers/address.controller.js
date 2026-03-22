import { StatusCodes } from "http-status-codes"
import addressService from "../services/address.service.js"

const addressController = {
    createAddress: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const result = await addressService.createAddress(userId, req.body)
            res.status(StatusCodes.CREATED).json(result)
        } catch (error) {
            next(error)
        }
    },

    getAddress: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const result = await addressService.getAddress(userId)
            res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    },

    updateAddress: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const result = await addressService.updateAddress(req.params.id, userId, req.body)
            res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    },

    deleteAddress: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const result = await addressService.deleteAddress(req.params.id, userId)
            res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    }
}

export default addressController    