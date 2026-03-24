import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/apiError.js";
import Blog from '../models/blog.model.js'
import cloudinaryProvider from "../providers/cloudinaryProvider.js";
import slugify from '../utils/slugify.js'

const blogService = {

    createBlog: async (userId, data) => {
        try {
            const { title, content, image, status } = data

            const slug = slugify(data.title)

            let thumbnail = null
            if (image) {
                const uploadResult = await cloudinaryProvider.uploadImageBuffer(
                    image.buffer,
                    'Readify/blogs'
                )
                thumbnail = uploadResult.url
            }

            const newBlog = new Blog({
                userId,
                title,
                slug,
                content,
                thumbnail,
                status
            })

            await newBlog.save()
            return newBlog
        } catch (error) {
            throw error
        }
    },

    getBlog: async () => {
        try {
            const blogs = await Blog.find({ status: 'published' }).sort({ createdAt: -1 }).populate('userId')
            return blogs
        } catch (error) {
            throw error
        }
    },

    updateBlog: async (bid, userId, data) => {
        try {
            const blog = await Blog.findById(bid)
            if (!blog) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Blog not found')
            }

            if (blog.userId.toString() !== userId.toString()) {
                throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to update this blog')
            }

            if (data.title !== undefined) {
                let baseSlug = slugify(data.title)
                let slug = baseSlug
                let count = 1

                // kiểm tra trùng nhưng loại trừ chính blog hiện tại
                while (await Blog.findOne({ slug, _id: { $ne: blog._id } })) {
                    slug = `${baseSlug}-${count++}`
                }

                blog.title = data.title
                blog.slug = slug
            }

            if (data.image) {
                const uploadResult = await cloudinaryProvider.uploadImageBuffer(
                    data.image.buffer,
                    'Readify/blogs'
                )
                blog.thumbnail = uploadResult.url
            }

            if(data.status !== undefined) {
                blog.status = data.status
            }

            await blog.save()
            return blog
        } catch (error) {
            throw error
        }
    },

    deleteBlog: async (bid, userId) => {
        try {
            const blog = await Blog.findById(bid)
            if (!blog) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Blog not found')
            }

            if (blog.userId.toString() !== userId.toString()) {
                throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to delete this blog')
            }

            await Blog.findByIdAndDelete(bid)
        } catch (error) {
            throw error
        }
    },

    getBlogById: async (bid) => {
        try {
            const blog = await Blog.findById(bid).populate('userId')
            if (!blog || blog.status === 'draft') {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Blog not found')
            }
            return blog
        } catch (error) {
            throw error
        }
    }

}


export default blogService