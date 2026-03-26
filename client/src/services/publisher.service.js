import axiosCustomize from '../api/axiosCustomize'

export const fetchPublishers = async () => {
    return await axiosCustomize.get('/publisher')
}

export const createPublisher = async (data) => {
    return await axiosCustomize.post('/publisher', data)
}

export const updatePublisher = async (id, data) => {
    return await axiosCustomize.put(`/publisher/${id}`, data)
}

export const deletePublisher = async (id) => {
    return await axiosCustomize.delete(`/publisher/${id}`)
}
