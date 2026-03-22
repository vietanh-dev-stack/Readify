import { StatusCodes } from "http-status-codes"
import categoryService from "../services/category.service.js"


const categoryController = {


    createCategory: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const result = await categoryService.createCategory(userId, req.body)
            return res.status(StatusCodes.CREATED).json(result)
        } catch (error) {
            next(error)
        }
    },

    getCategory: async (req, res, next) => {
        try {
            const result = await categoryService.getCategory()
            return res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    },

    updateCategory: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const cateId = req.params.cateId
            const result = await categoryService.updateCategory(cateId, userId, req.body)
            return res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    },

    deleteCategory: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const cateId = req.params.cateId
            const result = await categoryService.deleteCategory(cateId, userId)
            return res.status(StatusCodes.OK).json({ message: 'Category delete successfully' })
        } catch (error) {
            next(error)
        }
    }
}


export default categoryController