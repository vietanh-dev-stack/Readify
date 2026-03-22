import axiosCustomize from '../api/axiosCustomize'

export const fetchAuthors = async () => {
    return await axiosCustomize.get('/author')
}

export const createAuthor = async (data) => {
    return await axiosCustomize.post('/author/create', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const updateAuthor = async (id, formData) => {
    return await axiosCustomize.put(`/author/update/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const deleteAuthor = async (id) => {
    return await axiosCustomize.delete(`/author/delete/${id}`)
}

export const fetchAuthorById = async (id) => {
    return await axiosCustomize.get(`/author/${id}`)
}
