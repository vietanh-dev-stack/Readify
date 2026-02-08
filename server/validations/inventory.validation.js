import Joi, { object } from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/apiError.js'


const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/)

const inventoryValidation = {

    create: async (req, res, next) => {
        const schema = Joi.object({
            bookId: objectId.required(),
            quantity: Joi.number().integer().min(1).required().messages({
                'number.base': 'Quantity must be a number',
                'number.integer': 'Quantity must be an integer',
                'number.min': 'Quantity must be at least 1',
                'any.required': 'Quantity is required'
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
            quantity: Joi.number().integer().min(1).messages({
                'number.base': 'Quantity must be a number',
                'number.integer': 'Quantity must be an integer',
                'number.min': 'Quantity must be at least 1',
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

export default inventoryValidation