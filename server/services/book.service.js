import Book from '../models/book.model.js'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/apiError.js'
import cloudinaryProvider from '../providers/cloudinaryProvider.js'
import slugify from '../utils/slugify.js'
import Category from '../models/category.model.js'
import Series from '../models/series.model.js'
import Author from '../models/author.model.js'
import Publisher from '../models/publisher.model.js'
import Inventory from '../models/inventory.model.js'

const bookService = {

    createBook: async (userId, data, files) => {
        try {
            const book = await Book.findOne({ title: data.title })
            if (book) {
                throw new ApiError(StatusCodes.CONFLICT, 'Book already exists')
            }
            const slug = slugify(data.title)
            const existedSlug = await Book.findOne({ slug })
            if (existedSlug) {
                throw new ApiError(StatusCodes.CONFLICT, 'Book slug already exists')
            }

            const existedCate = await Category.findById(data.categoryId)
            if (!existedCate) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
            }
            if (data.seriesId) {
                const existedSerie = await Series.findById(data.seriesId)
                if (!existedSerie) {
                    throw new ApiError(StatusCodes.NOT_FOUND, 'Series not found')
                }
            }
            const authorIds = Array.isArray(data.authorIds) ? data.authorIds : [data.authorIds]
            const authors = await Author.find({ _id: { $in: authorIds } })
            if (authors.length !== authorIds.length) {
                throw new ApiError(
                    StatusCodes.NOT_FOUND, 'One or more authors not found')
            }
            data.authorIds = authorIds

            const existedPublisher = await Publisher.findById(data.publisherId)
            if (!existedPublisher) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Publisher not found')
            }

            if (data.discountPrice !== undefined && data.discountPrice >= data.price) {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Discount price must be less than price')
            }

            let coverImage = null
            if (files?.coverImage) {
                const result = await cloudinaryProvider.uploadImageBuffer(
                    files.coverImage[0].buffer,
                    'Readify/books'
                )
                coverImage = result.url
            }

            let images = []
            if (files?.images?.length) {
                const uploadResults = await Promise.all(
                    files.images.map(file => cloudinaryProvider.uploadImageBuffer(
                        file.buffer,
                        'Readify/books'
                    ))
                )
                images = uploadResults.map(r => r.url)
            }

            const newBook = new Book({
                userId,
                title: data.title,
                slug,
                description: data.description,
                categoryId: data.categoryId,
                seriesId: data.seriesId,
                authorIds: data.authorIds,
                publisherId: data.publisherId,
                price: data.price,
                discountPrice: data.discountPrice,
                coverImage,
                images,
                pages: data.pages,
                bookLanguage: data.bookLanguage,
                releaseDate: data.releaseDate
            })
            await newBook.save()
            return newBook
        } catch (error) {
            throw error
        }
    },

    getBook: async () => {
        try {
            const books = await Book.find({ status: { $in: ['active', 'out_of_stock'] } })
                .populate(['categoryId', 'seriesId', 'authorIds', 'publisherId'])
            return books
        } catch (error) {
            throw error
        }
    },

    updateBook: async (bId, userId, data, files) => {
        try {
            const book = await Book.findById(bId)
            if (!book) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Book not found')
            }
            if (book.userId.toString() !== userId.toString()) {
                throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to update this book')
            }
            if (data.title && data.title !== book.title) {
                const existed = await Book.findOne({ title: data.title, _id: { $ne: bId } })
                if (existed) {
                    throw new ApiError(StatusCodes.CONFLICT, 'Book already exists')
                }

                const newSlug = slugify(data.title)
                const existedSlug = await Book.findOne({ slug: newSlug, _id: { $ne: bId } })
                if (existedSlug) {
                    throw new ApiError(StatusCodes.CONFLICT, 'Book slug already exists')
                }
                book.title = data.title
                book.slug = newSlug
            }

            if (data.description !== undefined) {
                book.description = data.description
            }

            if (data.categoryId !== undefined) {
                const existedCate = await Category.findById(data.categoryId)
                if (!existedCate) {
                    throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found')
                }
                book.categoryId = data.categoryId
            }

            if (data.seriesId !== undefined) {
                const existedSerie = await Series.findById(data.seriesId)
                if (!existedSerie) {
                    throw new ApiError(StatusCodes.NOT_FOUND, 'Series not found')
                }
                book.seriesId = data.seriesId
            }

            if (data.authorIds !== undefined) {
                const authorIds = Array.isArray(data.authorIds) ? data.authorIds : [data.authorIds]
                const authors = await Author.find({ _id: { $in: authorIds } })
                if (authors.length !== authorIds.length) {
                    throw new ApiError(
                        StatusCodes.NOT_FOUND, 'One or more authors not found'
                    )
                }
                book.authorIds = authorIds
            }

            if (data.publisherId !== undefined) {
                const existedPublisher = await Publisher.findById(data.publisherId)
                if (!existedPublisher) {
                    throw new ApiError(StatusCodes.NOT_FOUND, 'Publisher not found')
                }
                book.publisherId = data.publisherId
            }

            if (data.price !== undefined) {
                book.price = data.price
            }

            if (data.discountPrice !== undefined) {
                const checkPrice = data.price ?? book.price
                if (data.discountPrice >= checkPrice) {
                    throw new ApiError(StatusCodes.BAD_REQUEST, 'Discount price must be less than price')
                }
                book.discountPrice = data.discountPrice
            }

            if (files?.coverImage) {
                const result = await cloudinaryProvider.uploadImageBuffer(
                    files.coverImage[0].buffer,
                    'Readify/books'
                )
                book.coverImage = result.url
            }

            if (files?.images?.length) {
                const uploadResults = await Promise.all(
                    files.images.map(file => cloudinaryProvider.uploadImageBuffer(file.buffer, 'Readify/books'))
                )
                book.images = uploadResults.map(r => r.url)
            }

            if (data.pages !== undefined) {
                book.pages = data.pages
            }

            if (data.bookLanguage !== undefined) {
                book.bookLanguage = data.bookLanguage
            }

            if (data.releaseDate !== undefined) {
                book.releaseDate = data.releaseDate
            }

            await book.save()
            return book
        } catch (error) {
            throw error
        }
    },

    deleteBook: async (bId, userId) => {
        try {
            const book = await Book.findOne({ _id: bId, status: { $in: ['active', 'out_of_stock'] } })
            if (!book) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Book not found')
            }
            if (book.userId.toString() !== userId.toString()) {
                throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permissions to delete this book')
            }
            book.status = 'hidden'
            await book.save()
            return book
        } catch (error) {
            throw error
        }
    },

    getBookById: async (bId) => {
        try {
            const book = await Book.findOne({ _id: bId, status: { $in: ['active', 'out_of_stock'] } })
                .populate(['categoryId', 'seriesId', 'authorIds', 'publisherId'])
                .lean()
            if (!book) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Book not found')
            }

            const inventory = await Inventory.findOne({ bookId: bId })
            if (inventory) {
                book.stock = Math.max(0, inventory.quantity - (inventory.reserved || 0))
            } else {
                book.stock = 0
            }

            return book
        } catch (error) {
            throw error
        }
    },

    getQuantityByBook: async (bId) => {
        try {
            const inventory = await Inventory.findOne({ bookId: bId })
            if (!inventory) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Inventory not found for this book')
            }
            const available = Math.max(0, inventory.quantity - inventory.reserved)
            return available
        } catch (error) {
            throw error
        }
    }

}

export default bookService