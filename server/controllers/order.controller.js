import { StatusCodes } from "http-status-codes"
import mongoose from "mongoose"
import ApiError from "../utils/apiError.js"
import orderService from "../services/order.service.js"

const orderController = {

    createOrder: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id

            const result = await orderService.createOrder(userId, req.body)

            return res.status(StatusCodes.CREATED).json({
                message: "Create order successfully",
                data: result
            })
        } catch (error) {
            next(error)
        }
    },

    getOrder: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id

            const page = parseInt(req.query.page) || 1
            const limit = parseInt(req.query.limit) || 10

            const result = await orderService.getOrder(userId, page, limit)

            return res.status(StatusCodes.OK).json({
                message: "Get orders successfully",
                ...result
            })
        } catch (error) {
            next(error)
        }
    },

    getOrderById: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const { orderId } = req.params

            if (!mongoose.Types.ObjectId.isValid(orderId)) {
                throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid orderId")
            }

            const result = await orderService.getOrderById(userId, orderId)

            return res.status(StatusCodes.OK).json({
                message: "Get order detail successfully",
                data: result
            })
        } catch (error) {
            next(error)
        }
    },

    cancelOrder: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const { orderId } = req.params

            if (!mongoose.Types.ObjectId.isValid(orderId)) {
                throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid orderId")
            }

            const result = await orderService.cancelOrder(userId, orderId)

            return res.status(StatusCodes.OK).json({
                message: "Cancel order successfully",
                data: result
            })
        } catch (error) {
            next(error)
        }
    },

    getOrdersForAdmin: async (req, res, next) => {
        try {
            const adminId = req.jwtDecoded._id
            const page = parseInt(req.query.page) || 1
            const limit = parseInt(req.query.limit) || 10

            const result = await orderService.getOrdersForAdmin(adminId, page, limit, req.query)

            return res.status(StatusCodes.OK).json({
                message: "Get admin orders successfully",
                ...result
            })
        } catch (error) {
            next(error)
        }
    },

    getOrderDetailForAdmin: async (req, res, next) => {
        try {
            const adminId = req.jwtDecoded._id
            const { orderId } = req.params

            if (!mongoose.Types.ObjectId.isValid(orderId)) {
                throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid orderId")
            }

            const result = await orderService.getOrderDetailForAdmin(adminId, orderId)

            return res.status(StatusCodes.OK).json({
                message: "Get admin order detail successfully",
                data: result
            })
        } catch (error) {
            next(error)
        }
    },

    updateOrderStatusByAdmin: async (req, res, next) => {
        try {
            const adminId = req.jwtDecoded._id
            const { orderId } = req.params
            const { status } = req.body

            if (!mongoose.Types.ObjectId.isValid(orderId)) {
                throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid orderId")
            }

            const result = await orderService.updateOrderStatusByAdmin(adminId, orderId, status)

            return res.status(StatusCodes.OK).json({
                message: "Update order status successfully",
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

}

export default orderController
