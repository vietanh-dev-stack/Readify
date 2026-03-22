import { StatusCodes } from "http-status-codes"
import orderService from "../services/order.service.js"

const orderController = {

    createOrder: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id

            const result = await orderService.createOrder(userId, req.body)

            return res.status(StatusCodes.CREATED).json(result)
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

            return res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    },

    getOrderById: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const { orderId } = req.params

            const result = await orderService.getOrderById(userId, orderId)

            return res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    },

    cancelOrder: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const { orderId } = req.params

            const result = await orderService.cancelOrder(userId, orderId)

            return res.status(StatusCodes.OK).json({
                message: "Cancel order successfully",
                data: result
            })
        } catch (error) {
            next(error)
        }
    }

}

export default orderController