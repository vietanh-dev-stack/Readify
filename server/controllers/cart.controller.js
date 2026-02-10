import { StatusCodes } from "http-status-codes"
import cartService from "../services/cart.service.js"


const cartController = {


    createCart: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const { bookId, quantity } = req.body

            const result = await cartService.createCart(userId, bookId, quantity)

            return res.status(StatusCodes.CREATED).json(result)
        } catch (error) {
            next(error)
        }
    },

    getCart: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id

            const result = await cartService.getCart(userId)

            return res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    },

    updateCart: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const { bookId, quantity } = req.body

            const result = await cartService.updateCart(
                userId,
                bookId,
                quantity
            )

            return res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    },

    deleteCart: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const { bookId } = req.params

            const result = await cartService.deleteCart(
                userId,
                bookId
            )

            return res.status(StatusCodes.OK).json({
                message: 'Remove item from cart successfully',
                cart: result
            })
        } catch (error) {
            next(error)
        }
    }

}

export default cartController