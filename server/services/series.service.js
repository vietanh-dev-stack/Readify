import { StatusCodes } from "http-status-codes"
import Series from '../models/series.model.js'
import ApiError from "../utils/apiError.js"


const seriesService = {


    createSeries: async (userId, data) => {
        try {
            const series = await Series.findOne({ title: data.title })
            if (series) {
                throw new ApiError(StatusCodes.CONFLICT, 'Series already exists')
            }

            const newSeries = new Series({
                userId,
                title: data.title,
                description: data.description,
                totalVolumes: data.totalVolumes,
            })
            await newSeries.save()
            return newSeries
        } catch (error) {
            throw error
        }
    },

    getSeries: async () => {
        try {
            const series = await Series.find({ isDelete: false })
            return series
        } catch (error) {
            throw error
        }
    },

    updateSeries: async (seId, userId, data) => {
        try {
            const series = await Series.findById(seId)
            if (!series || series.isDelete) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Series not found')
            }

            if (series.userId.toString() !== userId.toString()) {
                throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permisson to update this series')
            }

            if (data.status && !['ongoing', 'completed'].includes(data.status)) {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Series status is invalid')
            }

            if (data.title && data.title !== series.title) {
                const existed = await Series.findOne({title: data.title, isDelete: false, _id: {$ne: seId}})
                if(existed){
                    throw new ApiError(StatusCodes.CONFLICT, 'Series already exists')
                }
                series.title = data.title
            }
            if (data.description !== undefined) {
                series.description = data.description
            }
            if (data.totalVolumes !== undefined) {
                series.totalVolumes = data.totalVolumes
            }
            if (data.status !== undefined) {
                series.status = data.status
            }
            await series.save()
            return series
        } catch (error) {
            throw error
        }
    },

    deleteSeries: async (seId, userId) => {
        try {
            const series = await Series.findById(seId)
            if(!series || series.isDelete){
                throw new ApiError(StatusCodes.NOT_FOUND, 'Series not found')
            }

            if(series.userId.toString() !== userId.toString()){
                throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permisson to delete this series')
            }
            series.isDelete = true
            await series.save()
            return series
        } catch (error) {
            throw error
        }
    }
}


export default seriesService