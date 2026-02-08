import { StatusCodes } from "http-status-codes"
import ApiError from "../utils/apiError.js"
import Wishlist from '../models/wishlist.model.js'
import Book from '../models/book.model.js'

const wishlistService = {

    addToWishlist: async (userId, bookId) => {
        const book = await Book.findById(bookId)
        if (!book) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Book not found')
        }

        let wishlist = await Wishlist.findOne({ userId })

        if (!wishlist) {
            wishlist = await Wishlist.create({
                userId,
                bookIds: [bookId]
            })
            return wishlist
        }

        // Đã có → check trùng
        if (wishlist.bookIds.some(id => id.toString() === bookId)) {
            throw new ApiError(StatusCodes.CONFLICT, 'Book already in wishlist')
        }

        wishlist.bookIds.push(bookId)
        await wishlist.save()
        return wishlist
    },


    getWishlist: async (userId) => {
        try {
            const wishlist = await Wishlist.findOne({ userId }).populate('bookIds')
            return wishlist
        } catch (error) {
            throw error
        }
    },

    removeFromWishlist: async (userId, bookId) => {
        try {
            const wishlist = await Wishlist.findOne({ userId })
            if (!wishlist) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Wishlist not found')
            }

            const before = wishlist.bookIds.length

            wishlist.bookIds = wishlist.bookIds.filter(
                id => id.toString() !== bookId
            )

            if (wishlist.bookIds.length === before) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Book not in wishlist')
            }

            await wishlist.save()
            return wishlist
        } catch (error) {
            throw error
        }
    }

}

export default wishlistService