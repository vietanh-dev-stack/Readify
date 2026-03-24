import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/apiError.js'

const blogValidation = {

    create: async (req, res, next) => {
        const schema = Joi.object({
            title: Joi.string().required().messages({
                'string.empty': 'Title is required'
            }),
            content: Joi.string().required().messages({
                'string.empty': 'Content is required'
            }),
            status: Joi.string().valid('draft', 'published').optional()
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