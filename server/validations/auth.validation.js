import Joi from 'joi'
import { StatusCodes } from "http-status-codes"
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from "../utils/validators.js"
import ApiError from '../utils/apiError.js'

const authValidation = {
    login: async (req, res, next) => {
        const schema = Joi.object({
            email: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE).required(),
            password: Joi.string().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE).required()
        })

        try {
            await schema.validateAsync(req.body, { abortEarly: false })
            next()
        } catch (error) {
            next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
        }
    },
    
    register: async (req, res, next) => {
        const schema = Joi.object({
            email: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE).required(),
            password: Joi.string().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE).required(),
            confirmPassword: Joi.string().valid(Joi.ref('password')).required()
        })

        try {
            await schema.validateAsync(req.body, { allowUnknown: true })
            next()
        } catch (error) {
            next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
        }
    }
}

export default authValidation