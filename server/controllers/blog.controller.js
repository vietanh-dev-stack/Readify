import { StatusCodes } from "http-status-codes";
import blogService from "../services/blog.service.js";

const blogController = {

    createBlog: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const data = {...req.body, image: req.file}
            const result = await blogService.createBlog(userId, data)
            console.log('File: ', req.file);
            return res.status(StatusCodes.CREATED).json(result)
        } catch (error) {
            next(error)
        }
    },

    getBlog: async (req, res, next) => {
        try {
            const result = await blogService.getBlog()
            return res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    },

    getBlogAdmin: async (req, res, next) => {
        try {
            const result = await blogService.getBlogAdmin()
            return res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    },

    updateBlog: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const bid = req.params.bid
            const data = {...req.body, image: req.file}
            const result = await blogService.updateBlog(bid, userId, data)
            return res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    },

    deleteBlog: async (req, res, next) => {
        try {
            const userId = req.jwtDecoded._id
            const bid = req.params.bid
            const result = await blogService.deleteBlog(bid, userId)
            return res.status(StatusCodes.OK).json({ message: 'Deleted blog successfully' })
        } catch (error) {
            next(error)
        }
    },

    getBlogById: async (req, res, next) => {
        try {
            const bid = req.params.bid
            const result = await blogService.getBlogById(bid)
            return res.status(StatusCodes.OK).json(result)
        } catch (error) {
            next(error)
        }
    }
}

export default blogController