import Joi from 'joi'
import { StatusCodes } from "http-status-codes"
import ApiError from '../utils/apiError.js'

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/)

const cartValidation = {

    create: async (req, res, next) => {
        const schema = Joi.object({
            bookId: objectId.required(),
            quantity: Joi.number().integer().min(0).required().messages({
                'any.required': 'Quantity is required',
                'number.base': 'Quantity must be a number',
                'number.integer': 'Quantity must be a integer',
                'number.min': 'Quantity must be at least 0'
            })
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
            quantity: Joi.number().integer().min(0).messages({
                'number.base': 'Quantity must be a number',
                'number.integer': 'Quantity must be a integer',
                'number.min': 'Quantity must be at least 0'
            })
        })

        try {
            await schema.validateAsync(req.body, { abortEarly: false })
            next()
        } catch (error) {
            throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.details)
        }
    }
}

export default cartValidation