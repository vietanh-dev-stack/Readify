import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/apiError.js'


const publisherValidation = {

    create: async (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string().required().messages({
                'string.empty': 'Name is required'
            }),
            address: Joi.string().allow('').optional()
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
            name: Joi.string().optional(),
            address: Joi.string().allow('').optional()
        }).min(1)

        try {
            await schema.validateAsync(req.body, { abortEarly: false })
            next()
        } catch (error) {
            next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.details))
        }
    }

}

export default publisherValidation