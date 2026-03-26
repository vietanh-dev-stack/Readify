import axios from '../api/axiosCustomize';

const wishlistService = {
  getWishlist: async () => {
    const response = await axios.get('/wishlist');
    return response.data;
  },

  addToWishlist: async (bookId) => {
    const response = await axios.post('/wishlist', { bookId });
    return response.data;
  },

  removeFromWishlist: async (bookId) => {
    const response = await axios.delete(`/wishlist/${bookId}`);
    return response.data;
  }
};

export default wishlistService;
