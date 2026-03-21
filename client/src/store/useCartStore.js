import { create } from 'zustand';
import * as cartService from '../services/cart.service';

const useCartStore = create((set, get) => ({
  cartItems: [],
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const response = await cartService.getCartItems();
      // Adjust according to backend response structure
      set({ cartItems: response.data?.items || [], loading: false, error: null });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addToCart: async (bookId, quantity, book) => {
    set({ loading: true });
    try {
      await cartService.addToCart(bookId, quantity);
      
      const { cartItems } = get();
      const existingItemIndex = cartItems.findIndex(item => {
        const itemId = typeof item.bookId === 'object' ? item.bookId._id : item.bookId;
        return itemId === bookId;
      });
      
      if (existingItemIndex > -1) {
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += quantity;
        set({ cartItems: updatedCartItems });
      } else {
        set({ cartItems: [...cartItems, { bookId: book, quantity }] });
      }
      
      set({ loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateCartItem: async (bookId, quantity) => {
    try {
      await cartService.updateCartItem(bookId, quantity);
      const { cartItems } = get();
      const updatedCartItems = cartItems.map(item => 
        item.bookId._id === bookId ? { ...item, quantity } : item
      );
      set({ cartItems: updatedCartItems });
    } catch (error) {
      console.error('Failed to update cart item:', error);
      throw error;
    }
  },

  removeFromCart: async (bookId) => {
    try {
      await cartService.removeFromCart(bookId);
      const { cartItems } = get();
      set({ cartItems: cartItems.filter(item => item.bookId._id !== bookId) });
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    }
  },

  clearCart: () => set({ cartItems: [] }),
}));

export default useCartStore;
