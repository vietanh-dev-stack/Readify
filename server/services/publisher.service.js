import { StatusCodes } from "http-status-codes"
import Publisher from '../models/publisher.model.js'
import ApiError from "../utils/apiError.js"


const publisherService = {

    createPublisher: async (userId, data) => {
        try {
            const publisher = await Publisher.findOne({name: data.name, isDelete: false})
            if(publisher){
                throw new ApiError(StatusCodes.CONFLICT, 'Publisher already exists')
            }
            const newPublisher = new Publisher({
                userId,
                name: data.name,
                address: data.address
            })
            await newPublisher.save()
            return newPublisher
        } catch (error) {
            throw error
        }
    },

    getPublisher: async () => {
        try {
            const publishers = await Publisher.find({isDelete: false})
            return publishers
        } catch (error) {
            throw error
        }
    },

    updatePublisher: async (puId, userId, data) => {
        try {
            const publisher = await Publisher.findById(puId)
            if(!publisher || publisher.isDelete){
                throw new ApiError(StatusCodes.NOT_FOUND, 'Publisher not found')
            }
            if(publisher.userId.toString() !== userId.toString()){
                throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to update this publisher')
            }
            if(data.name && data.name !== publisher.name){
                const existed = await Publisher.findOne({name: data.name, isDelete: false, _id: {$ne: puId}})
                if(existed){
                    throw new ApiError(StatusCodes.CONFLICT, 'Publisher already exists')
                }
                publisher.name = data.name
            }
            if(data.address !== undefined){
                publisher.address = data.address
            }
            await publisher.save()
            return publisher
        } catch (error) {
            throw error
        }
    },

    deletePublisher: async (puId, userId) => {
        try {
            const publisher = await Publisher.findById(puId)
            if(!publisher || publisher.isDelete){
                throw new ApiError(StatusCodes.NOT_FOUND, 'Publisher not found')
            }
            if(publisher.userId.toString() !== userId.toString()){
                throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to delete this publisher')
            }
            publisher.isDelete = true
            await publisher.save()
            return publisher
        } catch (error) {
            throw error
        }
    }
}

export default publisherService