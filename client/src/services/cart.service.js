import axiosCustomize from '../api/axiosCustomize'

export const addToCart = async (bookId, quantity) => {
  return await axiosCustomize.post('/cart/add-to-cart', { bookId, quantity });
};

export const getCartItems = async () => {
  return await axiosCustomize.get('/cart');
};

export const updateCartItem = async (bookId, quantity) => {
  return await axiosCustomize.put(`/cart/update/${bookId}`, { quantity });
};

export const removeFromCart = async (bookId) => {
  return await axiosCustomize.delete(`/cart/delete/${bookId}`);
};