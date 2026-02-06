import { StatusCodes } from "http-status-codes"
import env from '../configs/environment.js'
import Category from '../models/category.model.js'
import ApiError from "../utils/apiError.js"
import slugify from '../utils/slugify.js'



const categoryService = {

    createCategory: async (userId, data) => {
        try {
            const category = await Category.findOne({ name: data.name })
            if (category) {
                throw new ApiError(StatusCodes.CONFLICT, 'Category already exists')
            }
            const slug = slugify(data.name)

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

    getCategory: async () => {
        try {
            const cates = await Category.find({isDelete: false})
            return cates
        } catch (error) {
            throw error
        }
    },

    updateCategory: async (cateId, userId, data) => {
        try {
            const cate = await Category.findById(cateId)
            if (!cate || cate.isDelete) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
            }
            if (cate.userId.toString() !== userId.toString()) {
                throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to edit this category')
            }

            if (data.name) {
                const newSlug = slugify(data.name)
                const existedSlug = await Category.findOne({ slug: newSlug, _id: { $ne: cateId } })
                if (existedSlug) {
                    throw new ApiError(StatusCodes.CONFLICT, 'Category slug already exists')
                }
                cate.name = data.name
                cate.slug = newSlug
            }

            if (data.description !== undefined) {
                cate.description = data.description
            }

            await cate.save()
            return cate
        } catch (error) {
            throw error
        }
    },

    deleteCategory: async (cateId, userId) => {
        try {
            const cate = await Category.findById(cateId)

            if(!cate || cate.isDelete){
                throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
            }

            if (cate.userId.toString() !== userId.toString()) {
                throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to edit this category')
            }
            cate.isDelete = true
            await cate.save()
            return cate
        } catch (error) {
            throw error
        }
    }
}


export default categoryService