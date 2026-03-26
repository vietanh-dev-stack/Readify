import axiosCustomize from '../api/axiosCustomize'

export const fetchSeries = async () => {
    return await axiosCustomize.get('/series')
}

export const createSeries = async (data) => {
    return await axiosCustomize.post('/series', data)
}

export const updateSeries = async (id, data) => {
    return await axiosCustomize.put(`/series/${id}`, data)
}

export const deleteSeries = async (id) => {
    return await axiosCustomize.delete(`/series/${id}`)
}
