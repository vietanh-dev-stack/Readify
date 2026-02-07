import { StatusCodes } from "http-status-codes"
import publisherService from "../services/publisher.service.js"


const publisherController = {

    createPublisher: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const result = await publisherService.createPublisher(userId, req.body)
            return res.status(StatusCodes.CREATED).json(result)
        } catch (error) {
            next(error)
        }
    },

    getPublisher: async (req, res, next) => {
        try {
            const result = await publisherService.getPublisher()
            return res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    },

    updatePublisher: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const puId = req.params.puId
            const result = await publisherService.updatePublisher(puId, userId, req.body)
            return res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    },

    deletePublisher: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const puId = req.params.puId
            await publisherService.deletePublisher(puId, userId)
            return res.status(StatusCodes.OK).json({message: 'Delete publisher successfully'})
        } catch (error) {
            next(error)
        }
    }
}

export default publisherController