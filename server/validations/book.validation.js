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
        if (req.body.authorIds) {
            if (typeof req.body.authorIds === 'string') {
                try {
                    req.body.authorIds = JSON.parse(req.body.authorIds)
                } catch {
                    req.body.authorIds = [req.body.authorIds]
                }
            }
        }

        ['price', 'discountPrice', 'pages'].forEach(field => {
            if (req.body[field] !== undefined) {
                const num = Number(req.body[field])
                if (isNaN(num)) {
                    return next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, `${field} must be a number`))
                }
                req.body[field] = num
            }
        })

        const schema = Joi.object({
            title: Joi.string().trim(),
            description: Joi.string().allow(''),
            categoryId: objectId,
            seriesId: objectId,
            publisherId: objectId,
            authorIds: Joi.array().items(objectId).min(1),
            price: Joi.number().positive(),
            discountPrice: Joi.number().min(0),
            pages: Joi.number().integer().min(1),
            bookLanguage: Joi.string().allow(''),
            releaseDate: Joi.date(),
            status: Joi.string().valid('active', 'hidden', 'out_of_stock')
        }).min(1)

        try {
            await schema.validateAsync(req.body, { abortEarly: false })
            next()
        } catch (error) {
            throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.details)
        }
    }
}


export default bookValidation