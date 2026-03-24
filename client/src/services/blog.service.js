import axiosCustomize from "../api/axiosCustomize";

export const fetchBlogs = async () => {
    return await axiosCustomize.get('/blog')
}

export const fetchBlogById = async (id) => {
    return await axiosCustomize.get(`/blog/${id}`)
}