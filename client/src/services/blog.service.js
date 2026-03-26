import axiosCustomize from "../api/axiosCustomize";

export const fetchBlogs = async () => {
    return await axiosCustomize.get('/blog')
}

export const fetchBlogAdmin = async () => {
    return await axiosCustomize.get('/blog/admin')
}

export const fetchBlogById = async (id) => {
    return await axiosCustomize.get(`/blog/${id}`)
}

export const createBlog = async (data) => {
    return await axiosCustomize.post('/blog', data)
}

export const uploadBlog = async (id, data) => {
    return await axiosCustomize.put(`/blog/${id}`, data)
}

export const deleteBlog = async (id) => {
    return await axiosCustomize.delete(`/blog/${id}`)
}