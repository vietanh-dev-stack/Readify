import { StatusCodes } from "http-status-codes";
import cartService from '../services/cart.service.js'


const cartController = {


    addToCart: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const { bookId, quantity } = req.body
            const result = await cartService.addToCart(userId, bookId, quantity)
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

    updateCartItem: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const bookId = req.params.bookId
            const quantity = req.body.quantity
            const result = await cartService.updateCartItem(userId, bookId, quantity)
            return res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    },

    removeCartItem: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const bookId = req.params.bookId
            const result = await cartService.removeCartItem(userId, bookId)
            return res.status(StatusCodes.OK).json({ message: 'Delete item success' })
        } catch (error) {
            next(error)
        }
    }
}

export default cartController