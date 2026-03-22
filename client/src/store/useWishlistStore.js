import { create } from 'zustand';
import wishlistService from '../services/wishlist.service';

const useWishlistStore = create((set, get) => ({
  wishlist: [],
  loading: false,
  error: null,

  fetchWishlist: async () => {
    set({ loading: true });
    try {
      const data = await wishlistService.getWishlist();
      // Assuming the API returns the wishlist object with bookIds populated as books
      set({ wishlist: data?.bookIds || [], loading: false, error: null });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  toggleWishlist: async (book) => {
    const { wishlist } = get();
    const isInWishlist = wishlist.some((item) => item._id === book._id);
    
    try {
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(book._id);
        set({ wishlist: wishlist.filter((item) => item._id !== book._id) });
      } else {
        await wishlistService.addToWishlist(book._id);
        set({ wishlist: [...wishlist, { _id: book._id }] });
      }
      return !isInWishlist; // Returns the new state
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
      throw error;
    }
  },

  setWishlist: (wishlist) => set({ wishlist }),
  
  clearWishlist: () => set({ wishlist: [] }),
}));

export default useWishlistStore;
