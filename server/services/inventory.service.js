import { StatusCodes } from "http-status-codes"
import ApiError from "../utils/apiError.js"
import Inventory from '../models/inventory.model.js'
import Book from '../models/book.model.js'

const inventorySchema = {

    createInventory: async (userId, data) => {
        try {
            const inventory = await Inventory.findOne({ bookId: data.bookId })
            if (inventory) {
                throw new ApiError(StatusCodes.CONFLICT, 'Inventory already exists')
            }
            const book = await Book.findById(data.bookId)
            if (!book) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Book not found')
            }
            const newInventory = new Inventory({
                userId,
                bookId: data.bookId,
                quantity: data.quantity
            })
            await newInventory.save()
            return newInventory
        } catch (error) {
            throw error
        }
    },

    getInventory: async () => {
        try {
            const inventory = await Inventory.find().populate('bookId')
            return inventory
        } catch (error) {
            throw error
        }
    },

    updateInventory: async (invenId, userId, data) => {
        try {
            const inventory = await Inventory.findOne({ _id: invenId })
            if (!inventory) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Inventory not found')
            }
            if (inventory.userId.toString() !== userId.toString()) {
                throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permisson to update this inventory')
            }
            if (data.quantity < inventory.reserved) {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Quantity cannot be less than reversed')
            }
            if (data.quantity !== undefined) {
                inventory.quantity = data.quantity
            }
            await inventory.save()
            return inventory
        } catch (error) {
            throw error
        }
    }
}


export default inventorySchema