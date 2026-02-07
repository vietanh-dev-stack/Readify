import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/apiError.js'

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/)

const bookValidation = {

    create: async (req, res, next) => {
        const schema = Joi.object({
            title: Joi.string().trim().required(),
            description: Joi.string().allow('').optional(),

            categoryId: objectId.required(),
            seriesId: objectId.optional(),
            publisherId: objectId.required(),
            authorIds: Joi.array().items(objectId).min(1).required(),

            price: Joi.number().positive().required(),
            discountPrice: Joi.number().min(0).optional(),

            coverImage: Joi.string().uri().required(),
            images: Joi.array().items(Joi.string().uri()).default([]),

            pages: Joi.number().integer().min(1).required(),
            bookLanguage: Joi.string().allow('').optional(),

            releaseDate: Joi.date().optional(),
            status: Joi.string().valid('active', 'hidden', 'out_of_stock').optional()
        })

        try {
            await schema.validateAsync(req.body, { abortEarly: false })
            next()
        } catch (error) {
            throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.details)
        }
    },

    update: async (req, res, next) => {
        const schema = Joi.object({
            title: Joi.string().trim(),
            authorIds: Joi.array().items(objectId).min(1),

            price: Joi.number().positive(),
            discountPrice: Joi.number().min(0),

            coverImage: Joi.string().uri(),
            images: Joi.array().items(Joi.string().uri()),

            pages: Joi.number().integer().min(1),
            bookLanguage: Joi.string().allow(''),

            releaseDate: Joi.date(),
            status: Joi.string().valid('active', 'hidden', 'out_of_stock')
        })

        try {
            await schema.validateAsync(req.body, { abortEarly: false })
            next()
        } catch (error) {
            throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.details)
        }
    }
}


export default bookValidation