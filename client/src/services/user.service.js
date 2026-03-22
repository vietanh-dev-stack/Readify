import axiosCustomize from '../api/axiosCustomize'


export const updateProfile = async (data) => {
    return await axiosCustomize.put('/user/update-profile', data)
}

export const fetchUsers = async () => {
    return await axiosCustomize.get('/user/get-user')
}

export const createUser = async (data) => {
    return await axiosCustomize.post('/user/create-user', data)
}

export const updateRole = async (userId, data) => {
    return await axiosCustomize.patch(`/user/update-role/${userId}`, data)
}   

export const updateStatus = async (userId) => {
    return await axiosCustomize.patch(`/user/update-status/${userId}`)
}