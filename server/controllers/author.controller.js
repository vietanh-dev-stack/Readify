import { StatusCodes } from "http-status-codes"
import authorSerive from "../services/author.service.js"



const authorController = {

    createAuthor: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const data = {...req.body, image: req.file}
            const result = await authorSerive.createAuthor(userId, data)
            return res.status(StatusCodes.CREATED).json(result)
        } catch (error) {
            next(error)
        }
    },

    getAuthor: async (req, res, next) => {
        try {
            const result = await authorSerive.getAuthor()
            return res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    },

    updateAuthor: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const aId = req.params.aId
            const data = {...req.body, image: req.file}
            const result = await authorSerive.updateAuthor(aId, userId, data)
            return res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    },

    deleteAuthor: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const aId = req.params.aId
            const result = await authorSerive.deleteAuthor(aId, userId)
            return res.status(StatusCodes.OK).json({ message: 'Delete author successfully' })
        } catch (error) {
            next(error)
        }
    }
}

export default authorController