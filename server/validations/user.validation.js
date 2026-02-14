import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/apiError.js'
import { PHONE_RULE, PHONE_RULE_MESSAGE } from '../utils/validators.js'

const userValidation = {

    updateProfile: async (req, res, next) => {
        const schema = Joi.object({
            username: Joi.string().trim().min(1).max(50).messages({
                'string.empty': 'Username cannot be empty',
                'string.min': 'Username cannot be empty',
                'string.max': 'Username cannot be exceed 50 characters',
            }),
            phone: Joi.string()
                .pattern(PHONE_RULE)
                .messages({
                    'string.pattern.base': PHONE_RULE_MESSAGE
                }),
            avatar: Joi.string().uri().allow('').optional().messages({
                'string.uri': 'Avatar must be a valid URL'
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


export default userValidation