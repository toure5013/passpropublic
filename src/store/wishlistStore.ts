import create from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistItem {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  price: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
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