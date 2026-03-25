import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/apiError.js'

const blogValidation = {

    create: async (req, res, next) => {
        const schema = Joi.object({
            title: Joi.string().required().messages({
                'string.empty': 'Title is required'
            }),
            content: Joi.string().custom((value, helpers) => {
                const text = value.replace(/<[^>]*>/g, '').trim()
                if (!text) {
                    return helpers.error('any.empty')
                }
                return value
            }).required().messages({
                'any.empty': 'Content is required'
            }),
            status: Joi.string().valid('draft', 'published').optional(),
            image: Joi.any().optional()
        })

        try {
            await schema.validateAsync(req.body, { abortEarly: false })
            next()
        } catch (error) {
            next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error))
        }
    }
}

export default blogValidation