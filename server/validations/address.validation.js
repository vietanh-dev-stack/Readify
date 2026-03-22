import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/apiError.js'
import { PHONE_RULE, PHONE_RULE_MESSAGE } from '../utils/validators.js'

const addressValidation = {

    create: async (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string().required().trim().min(3).max(30),

            phone: Joi.string()
                .required()
                .pattern(PHONE_RULE)
                .messages({
                    'string.empty': 'Phone is required',
                    'string.pattern.base': 'Phone number is invalid'
                }),

            province: Joi.string().required().trim().min(2).max(50),
            district: Joi.string().required().trim().min(2).max(50),
            ward: Joi.string().required().trim().min(2).max(50),
            street: Joi.string().required().trim().min(2).max(100),

            isDefault: Joi.boolean().optional()
        })

        try {
            await schema.validateAsync(req.body, { abortEarly: false })
            next()
        } catch (error) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                error.details.map(e => e.message)
            )
        }
    },

    update: async (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string().trim().min(3).max(30),

            phone: Joi.string()
                .required()
                .pattern(PHONE_RULE)
                .messages({
                    'string.empty': 'Phone is required',
                    'string.pattern.base': 'Phone number is invalid'
                }),

            province: Joi.string().trim().min(2).max(50),
            district: Joi.string().trim().min(2).max(50),
            ward: Joi.string().trim().min(2).max(50),
            street: Joi.string().trim().min(2).max(100),

            isDefault: Joi.boolean().optional()
        }).min(1)

        try {
            await schema.validateAsync(req.body, { abortEarly: false })
            next()
        } catch (error) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                error.details.map(e => e.message)
            )
        }
    }
}

export default addressValidation