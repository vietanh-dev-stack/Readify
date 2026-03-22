import axiosCustomize from '../api/axiosCustomize'

export const fetchCategories = async () => {
    return await axiosCustomize.get('/cate')
}

export const createCategory = async (data) => {
    return await axiosCustomize.post('/cate/create', data)
}

export const updateCategory = async (id, data) => {
    return await axiosCustomize.put(`/cate/update/${id}`, data)
}

export const deleteCategory = async (id) => {
    return await axiosCustomize.delete(`/cate/delete/${id}`)
}
