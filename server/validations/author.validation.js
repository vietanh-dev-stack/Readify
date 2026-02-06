import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/apiError.js'


const authorValidation = {

    create: async (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string().required().messages({
                'string.empty': 'Name is required'
            }),
            bio: Joi.string().allow('').optional()
        })

        try {
            await schema.validateAsync(req.body, { abortEarly: false })
            next()
        } catch (error) {
            next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.details))
        }
    }
}


export default authorValidation