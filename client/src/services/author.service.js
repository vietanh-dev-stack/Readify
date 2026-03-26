import axiosCustomize from '../api/axiosCustomize'

export const fetchAuthors = async () => {
    return await axiosCustomize.get('/author')
}

export const createAuthor = async (data) => {
    return await axiosCustomize.post('/author', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const updateAuthor = async (id, formData) => {
    return await axiosCustomize.put(`/author/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const deleteAuthor = async (id) => {
    return await axiosCustomize.delete(`/author/${id}`)
}

export const fetchAuthorById = async (id) => {
    return await axiosCustomize.get(`/author/${id}`)
}
