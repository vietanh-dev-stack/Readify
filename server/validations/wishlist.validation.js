import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/apiError.js'

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/)

const wishlistValidation = {

    add: async (req, res, next) => {
        const schema = Joi.object({
            bookId: objectId.required()
        })

        try {
            await schema.validateAsync(req.body, { abortEarly: false })
            next()
        } catch (error) {
            throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.details)
        }
    }
}

export default wishlistValidation