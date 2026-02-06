import { StatusCodes } from "http-status-codes"
import seriesService from "../services/series.service.js"


const seriesController = {

    createSeries: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const result = await seriesService.createSeries(userId, req.body)
            return res.status(StatusCodes.CREATED).json(result)
        } catch (error) {
            next(error)
        }
    },

    getSeries: async (req, res, next) => {
        try {
            const result = await seriesService.getSeries()
            return res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    },

    updateSeries: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const seId = req.params.seId
            const result = await seriesService.updateSeries(seId, userId, req.body)
            return res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    },

    deleteSeries: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const seId = req.params.seId
            const result = await seriesService.deleteSeries(seId, userId)
            return res.status(StatusCodes.OK).json({message: 'Delete series successfully'})
        } catch (error) {
            next(error)
        }
    }
}

export default seriesController