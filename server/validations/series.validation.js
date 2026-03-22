import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/apiError.js'


const seriesValidation = {

    create: async (req, res, next) => {
        const schema = Joi.object({
            title: Joi.string().max(200).required().messages({
                'string.empty': 'Series title is required',
                'string.max': 'Series title cannot exceed 200 character'
            }),
            description: Joi.string().max(500).allow('').messages({
                'string.max': 'Series description cannot exceed 500 characters'
            }),
            totalVolumes: Joi.number().integer().min(1).optional().messages({
                'number.base': 'Volumes must be a number',
                'number.integer': 'Volumes must be an integer',
                'number.min': 'Volumes must be at least 1'
            }),
            status: Joi.string().valid('ongoing', 'completed').optional()
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
            title: Joi.string().max(200).messages({
                'string.max': 'Series title cannot exceed 200 characters'
            }),
            description: Joi.string().max(500).allow('').messages({
                'string.max': 'Series description cannot exceed 500 characters'
            }),
            totalVolumes: Joi.number().integer().min(1).messages({
                'number.base': 'Volumes must be a number',
                'number.integer': 'Volumes must be an integer',
                'number.min': 'Volumes must be at least 1'
            }),
            status: Joi.string().valid('ongoing', 'completed').optional()
        }).min(1)
        
        try {
            await schema.validateAsync(req.body, { abortEarly: false })
            next()
        } catch (error) {
            next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.details))
        }
    }
}


export default seriesValidation