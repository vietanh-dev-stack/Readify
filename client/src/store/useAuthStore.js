import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      login: (userData, token) => {
        // map username to name for compatibility
        const user = { 
          ...userData, 
          name: userData.username || userData.name 
        };
        set({ 
          user, 
          accessToken: token, 
          isAuthenticated: true 
        });
      },
      logout: () => set({ 
        user: null, 
        accessToken: null, 
        isAuthenticated: false 
      }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
