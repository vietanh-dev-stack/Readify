import axiosCustomize from '../api/axiosCustomize'

// --- Book APIs ---
export const fetchBooks = async (params = {}) => {
  return await axiosCustomize.get('/book', { params })
}

export const fetchBookById = async (id) => {
  return await axiosCustomize.get(`/book/${id}`)
}

export const createBook = async (formData) => {
  return await axiosCustomize.post('/book/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const updateBook = async (id, formData) => {
  return await axiosCustomize.put(`/book/update/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const deleteBook = async (id) => {
  return await axiosCustomize.delete(`/book/delete/${id}`)
}

export const fetchBookQuantity = async (id) => {
  return await axiosCustomize.get(`/book/quantity/${id}`)
}

// --- Inventory APIs ---
export const fetchInventory = async () => {
  return await axiosCustomize.get('/inventory')
}

export const createInventory = async (data) => {
  return await axiosCustomize.post('/inventory/create', data)
}

export const updateInventory = async (id, data) => {
  return await axiosCustomize.put(`/inventory/update/${id}`, data)
}