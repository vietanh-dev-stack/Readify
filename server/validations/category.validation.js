import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/apiError.js'

const categoryValidation = {

    create: async (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string().min(3).max(100).required().messages({
                'string.empty': 'Category name is required',
                'string.min': 'Category name must be at least 3',
                'string.max': 'Category name cannot exceed 100 characters'
            }),
            description: Joi.string().max(500).allow('').messages({
                'string.max': 'Category description cannot exceed 500 characters'
            })
        })

        try {
            await schema.validateAsync(req.body, { abortEarly: false })
            next()
        } catch (error) {
            next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.details))
        }
    },

    update: async (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string().min(3).max(100).messages({
                'string.min': 'Category name must be at least 3',
                'string.max': 'Category name cannot exceed 100 characters'
            }),
            description: Joi.string().max(500).allow('').messages({
                'string.max': 'Category description cannot exceed 500 characters'
            })
        }).min(1)

        try {
            await schema.validateAsync(req.body, { abortEarly: false })
            next()
        } catch (error) {
            next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.details))
        }
    }

}

export default categoryValidation