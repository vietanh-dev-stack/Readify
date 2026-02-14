import { StatusCodes } from "http-status-codes"
import ApiError from "../utils/apiError.js"
import Author from '../models/author.model.js'
import cloudinaryProvider from '../providers/cloudinaryProvider.js'


const authorSerive = {

    createAuthor: async (userId, data) => {
        try {
            const { name, bio, image } = data
            const author = await Author.findOne({ name: data.name, isDelete: false })
            if (author) {
                throw new ApiError(StatusCodes.CONFLICT, 'Author already exists')
            }

            let avatar = null
            if (image) {
                const uploadResult = await cloudinaryProvider.uploadImageBuffer(
                    image.buffer,
                    'Readify/authors'
                )
                avatar = uploadResult.url
            }


            const newAuthor = new Author({
                userId,
                name,
                bio,
                avatar
            })
            await newAuthor.save()
            return newAuthor
        } catch (error) {
            throw error
        }
    },

    getAuthor: async () => {
        try {
            const authors = await Author.find({ isDelete: false })
            return authors
        } catch (error) {
            throw error
        }
    },

    updateAuthor: async (aId, userId, data) => {
        try {
            const author = await Author.findById(aId)
            if (!author || author.isDelete) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Author not found')
            }

            if (author.userId.toString() !== userId.toString()) {
                throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to update this author')
            }

            if (data.name && data.name !== author.name) {
                const existed = await Author.findOne({ name: data.name, isDelete: false, _id: { $ne: aId } })
                if (existed) {
                    throw new ApiError(StatusCodes.CONFLICT, 'Author already exists')
                }
                author.name = data.name
            }
            if (data.bio !== undefined) {
                author.bio = data.bio
            }

            if (data.image) {
                const uploadResult = await cloudinaryProvider.uploadImageBuffer(
                    data.image.buffer,
                    'Readify/authors'
                )
                author.avatar = uploadResult.url
            }

            await author.save()
            return author
        } catch (error) {
            throw error
        }
    },

    deleteAuthor: async (aId, userId) => {
        try {
            const author = await Author.findById(aId)
            if (!author || author.isDelete) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Author not found')
            }

            if (author.userId.toString() !== userId.toString()) {
                throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to delete this author')
            }

            author.isDelete = true
            await author.save()
            return author
        } catch (error) {
            throw error
        }
    },

    getAuthorById: async (aId) => {
        try {
            const author = await Author.findById(aId)
            if(!author || author.isDelete) {
                throw new ApiError(StatusCodes.NOT_FOUND)
            }
            return author
        } catch (error) {
            throw error
        }
    }
}

export default authorSerive