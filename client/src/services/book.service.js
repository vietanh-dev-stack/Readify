import axiosCustomize from '../api/axiosCustomize'

export const fetchBooks = async () => {
  return await axiosCustomize.get('/book')
};

export const fetchBookById = async (id) => {
  return await axiosCustomize.get(`/book/${id}`)
};