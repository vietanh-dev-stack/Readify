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

    listCategory: async (req, res, next) => {
        try {

        } catch (error) {
            next(error)
        }
    },

    updateCategory: async (req, res, next) => {
        try {

        } catch (error) {
            next(error)
        }
    },

    deleteCategory: async (req, res, next) => {
        try {

        } catch (error) {
            next(error)
        }
    }
}


export default categoryController