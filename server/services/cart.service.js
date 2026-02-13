import { StatusCodes } from "http-status-codes"
import ApiError from "../utils/apiError.js"
import Cart from '../models/cart.model.js'
import Book from '../models/book.model.js'
import Inventory from '../models/inventory.model.js'

const cartService = {

    addToCart: async (userId, bookId, quantity) => {
        const book = await Book.findOne({
            _id: bookId,
            status: 'active'
        }).lean()

        if (!book) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Book not found or inactive')
        }

        const inventory = await Inventory.findOne({ bookId }).lean()

        if (!inventory) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Inventory not found')
        }

        const available = inventory.quantity - inventory.reserved

        if (quantity > available) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Not enough stock')
        }

        const priceAtTime =
            book.discountPrice && book.discountPrice > 0
                ? book.discountPrice
                : book.price

        // Try update existing item (atomic)
        const updated = await Cart.findOneAndUpdate(
            {
                userId,
                "items.bookId": bookId
            },
            {
                $inc: { "items.$.quantity": quantity }
            },
            { new: true }
        )

        if (updated) {
            // Check lại nếu vượt stock sau khi tăng
            const item = updated.items.find(i =>
                i.bookId.toString() === bookId.toString()
            )

            if (item.quantity > available) {
                // rollback quantity
                await Cart.updateOne(
                    { userId, "items.bookId": bookId },
                    { $inc: { "items.$.quantity": -quantity } }
                )

                throw new ApiError(StatusCodes.BAD_REQUEST, 'Not enough stock')
            }

            return updated
        }

        // Nếu chưa có item → push mới
        const cart = await Cart.findOneAndUpdate(
            { userId },
            {
                $push: {
                    items: {
                        bookId,
                        quantity,
                        priceAtTime
                    }
                }
            },
            {
                new: true,
                upsert: true
            }
        )

        return cart
    },


    getCart: async (userId) => {
        try {
            const cart = await Cart.findOne({ userId }).populate({
                path: 'items.bookId',
                select: 'title price discountPrice coverImage status'
            })
            if (!cart) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Cart not found')
            }
            return cart
        } catch (error) {
            throw error
        }
    },

    updateCartItem: async (userId, bookId, quantity) => {
        try {
            if (quantity === 0) {
                return await cartService.removeCartItem(userId, bookId)
            }

            const book = await Book.findOne({ _id: bookId, status: 'active' }).lean()
            if (!book) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Book not found or inactive')
            }

            const inventory = await Inventory.findOne({ bookId })
            if (!inventory) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Inventory not found')
            }

            const available = inventory.quantity - inventory.reserved
            if (quantity > available) {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Not enough stock')
            }

            const updatedCart = await Cart.findOneAndUpdate(
                { userId, 'items.bookId': bookId },
                { $set: { 'items.$.quantity': quantity } },
                { new: true }
            )

            if (!updatedCart) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Item not found in cart')
            }

            return updatedCart
        } catch (error) {
            throw error
        }
    },

    removeCartItem: async (userId, bookId) => {
        try {
            const updatedCart = await Cart.findOneAndUpdate(
                { userId },
                {
                    $pull: {
                        items: { bookId }
                    }
                },
                { new: true }
            )

            if (!updatedCart) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Cart not found')
            }
            return updatedCart
        } catch (error) {
            throw error
        }
    }



}

export default cartService