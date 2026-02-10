import { StatusCodes } from "http-status-codes"
import ApiError from "../utils/apiError.js"
import Cart from '../models/cart.model.js'
import Inventory from '../models/inventory.model.js'
import mongoose from "mongoose"


const cartService = {

    createCart: async (userId, bookId, quantity) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const inventory = await Inventory.findOne({ bookId }).session(session)
            if (!inventory) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Inventory not found')
            }

            const available = inventory.quantity - inventory.reserved
            if (available < quantity) {
                throw new ApiError(StatusCodes, 'Not enough stock')
            }

            let cart = await Cart.findOne({ userId }).session(session)
            if (!cart) {
                cart = new Cart({ userId, items: [] })
            }

            const item = cart.items.find(i => i.bookId.toString() === bookId.String())
            if (item) {
                item.quantity += quantity
            } else {
                cart.items.push({
                    bookId,
                    quantity,
                    priceAtTime: book.price
                })
            }

            inventory.reserved += quantity

            await inventory.save({ session })
            await cart.save({ session })

            await session.commitTransaction()
            return cart

        } catch (error) {
            throw error
        }
    },

    getCart: async (userId) => {
        try {
            const cart = await Cart.findOne({ userId }).populate('items.bookId')
            if (!cart) {
                return { userId, items: [] }
            }
            return cart
        } catch (error) {
            throw error
        }
    },

    updateCart: async (userId, bookId, newQuantity) => {
        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            const cart = await Cart.findOne({ userId }).session(session)
            if (!cart) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Cart not found')
            }
            const item = cart.items.find(i => i.bookId.toString() === bookId.toString())
            if (!item) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Item not found in cart')
            }

            const inventory = await Inventory.findOne({ bookId }).session(session)
            if (!inventory) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Inventory not found')
            }

            const diff = newQuantity - item.quantity
            if (inventory.quantity - inventory.reserved < diff) {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Not enough stock')
            }

            item.quantity = newQuantity
            inventory.reserved += diff

            await cart.save({ session })
            await inventory.save({ session })

            await session.commitTransaction()
            session.endSession()

            return cart
        } catch (error) {
            throw error
        }
    },

    deleteCart: async (userId, bookId) => {
        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            const cart = await Cart.findOne({ userId }).session(session)
            if (!cart) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Cart not found')
            }

            const itemIndex = cart.items.findIndex(
                i => i.bookId.toString() === bookId
            )

            if (itemIndex === -1) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Item not in cart')
            }

            const item = cart.items[itemIndex]

            const inventory = await Inventory
                .findOne({ bookId })
                .session(session)

            if (!inventory) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Inventory not found')
            }

            inventory.reserved -= item.quantity
            cart.items.splice(itemIndex, 1)

            await inventory.save({ session })
            await cart.save({ session })

            await session.commitTransaction()
            session.endSession()

            return cart
        } catch (error) {
            await session.abortTransaction()
            session.endSession()
            throw error
        }
    }
}

export default cartService