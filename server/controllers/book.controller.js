import { StatusCodes } from "http-status-codes"
import bookService from "../services/book.service.js"


const bookController = {

    createBook: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const result = await bookService.createBook(userId, req.body, req.files)
            return res.status(StatusCodes.CREATED).json(result)
        } catch (error) {
            next(error)
        }
    },

    getBook: async (req, res, next) => {
        try {
            const result = await bookService.getBook()
            return res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    },

    updateBook: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const bId = req.params.bId
            const result = await bookService.updateBook(bId, userId, req.body, req.files)
            return res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    },

    deleteBook: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const bId = req.params.bId
            await bookService.deleteBook(bId, userId)
            return res.status(StatusCodes.OK).json({ message: 'Delete book successfully' })
        } catch (error) {
            next(error)
        }
    },

    getBookById: async (req, res, next) => {
        try {
            const bId = req.params.bId
            const result = await bookService.getBookById(bId)
            return res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    }
}

export default bookController