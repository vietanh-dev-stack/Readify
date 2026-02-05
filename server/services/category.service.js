import { StatusCodes } from "http-status-codes"
import env from '../configs/environment.js'
import Category from '../models/category.model.js'
import ApiError from "../utils/apiError.js"



const categoryService = {

    createCategory: async (userId, data) => {
        try {
            const category = await Category.findOne({ name: data.name })
            if (category) {
                throw new ApiError(StatusCodes.CONFLICT, 'Category is already exists')
            }
            const slug = data.name
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim('-')

            const existedSlug = await Category.findOne({ slug })
            if (existedSlug) {
                throw new ApiError(StatusCodes.CONFLICT, 'Category slug already exists')
            }

            const newCategory = new Category({
                userId: userId,
                name: data.name,
                slug,
                description: data.description
            })
            await newCategory.save()
            return newCategory
        } catch (error) {
            throw error
        }
    },

    listCategory: async (data) => {
        try {

        } catch (error) {
            throw error
        }
    },

    updateCategory: async (data) => {
        try {

        } catch (error) {
            throw error
        }
    },

    deleteCategory: async (data) => {
        try {

        } catch (error) {
            throw error
        }
    }
}


export default categoryService