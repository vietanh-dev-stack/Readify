import axiosCustomize from '../api/axiosCustomize'

export const fetchCategories = async () => {
    return await axiosCustomize.get('/cate')
}

export const createCategory = async (data) => {
    return await axiosCustomize.post('/cate', data)
}

export const updateCategory = async (id, data) => {
    return await axiosCustomize.put(`/cate/${id}`, data)
}

export const deleteCategory = async (id) => {
    return await axiosCustomize.delete(`/cate/${id}`)
}

