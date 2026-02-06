import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/apiError.js'


const seriesValidation = {

    create: async (req, res, next) => {
        const schema = Joi.object({
            title: Joi.string().max(200).required().messages({
                'string.empty': 'Series title is required',
                'string.max': 'Series title cannot exceed 200 charaters'
            }),
            description: Joi.string().max(500).allow('').messages({
                'string.max': 'Series description cannot exceed 500 characters'
            }),
            totalVolumes: Joi.number().integer().min(1).required().messages({
                'number.base': 'Volumes must be a number',
                'number.integer': 'Volumes must be an integer',
                'number.min': 'Volumes must be at least 1',
                'any.required': 'Volumes is required'
            })
        })

        try {
            await schema.validateAsync(req.body, { abortEarly: false })
            next()
        } catch (error) {
            next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
        }
    },

    update: async (req, res, next) => {
        const schema = Joi.object({
            title: Joi.string().max(200).message({
                'title.max': 'Series title cannot exceed 200 charaters'
            }),
            description: Joi.string().max(500).allow().messages({
                'string.max': 'Series description cannot exceed 500 characters'
            }),
            totalVolumes: Joi.number().integer().min(1).message({
                'number.base': 'Volumes must be a number',
                'number.interger': 'Volumes must be an integer',
                'number.min': 'Volumes must be at least 1'
            })
        })
        
        try {
            await schema.validateAsync(req.body, { abortEarly: false })
            next()
        } catch (error) {
            next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message))
        }
    }
}


export default seriesValidation