import create from 'zustand';
import { persist } from 'zustand/middleware';
import { MyCustomEvent } from '../utils/eventtypes';

interface WishlistStore {
  items: MyCustomEvent[];
  addToWishlist: (item: MyCustomEvent) => void;
  removeFromWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToWishlist: (item) => {
        set((state) => ({
          items: state.items.some(i => i.id === item.id)
            ? state.items
            : [...state.items, item]
        }));
      },

      removeFromWishlist: (id) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== id)
        }));
      },

      isInWishlist: (id) => {
        return get().items.some(item => item.id === id);
      }
    }),
    {
      name: 'wishlist-storage'
    }
  )
);