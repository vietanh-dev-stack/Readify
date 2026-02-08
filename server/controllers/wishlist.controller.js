import { StatusCodes } from "http-status-codes"
import wishlistService from "../services/wishlist.service.js"

const wishlistController = {

    addToWishlist: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const bookId = req.body.bookId
            const result = await wishlistService.addToWishlist(userId, bookId)
            return res.status(StatusCodes.CREATED).json(result)
        } catch (error) {
            next(error)
        }
    },

    getWishlist: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const result = await wishlistService.getWishlist(userId)
            return res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    },

    removeFromWishlist: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const bookId = req.params.bookId
            await wishlistService.removeFromWishlist(userId, bookId)
            return res.status(StatusCodes.OK).json({message: 'Wishlist deleted successfully'})
        } catch (error) {
            next(error)
        }
    }
}


export default wishlistController