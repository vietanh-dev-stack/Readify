import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/apiError.js'

const orderValidation = {
    create: async (req, res, next) => {
        const schema = Joi.object({
            addressId: Joi.string().required(),
            paymentMethod: Joi.string().valid('cod', 'momo', 'vnpay').required(),
            couponCode: Joi.string().optional()
        })

        try {
            await schema.validateAsync(req.body, { abortEarly: false })
            next()
        } catch (error) {
            throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.details)
        }
    }
}

export default orderValidation