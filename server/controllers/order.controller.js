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
            const result = await orderService.getOrder(userId)
            return res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    },

    getOrderById: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const orderId = req.params.orderId
            const result = await orderService.getOrderById(userId, orderId)
            return res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    },

    cancelOrder: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const orderId = req.params.orderId
            const result = await orderService.cancelOrder(userId, orderId)
            return res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    }

}

export default orderController