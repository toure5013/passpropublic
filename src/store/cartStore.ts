import create from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  eventId: string;
  eventTitle: string;
  categoryId: string;
  categoryName: string;
  quantity: number;
  price: number;
}

interface CartStore {
  items: CartItem[];
  promoCode: string | null;
  promoDiscount: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (eventId: string, categoryId: string) => void;
  updateQuantity: (eventId: string, categoryId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getFinalTotal: () => number;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
}

const PROMO_CODES = {
  'WELCOME': 10, // 10% de réduction
  'SUMMER': 15, // 15% de réduction
  'VIP': 20, // 20% de réduction
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      promoDiscount: 0,
      
      addToCart: (item) => {
        set((state) => {
          const existingItem = state.items.find(
            i => i.eventId === item.eventId && i.categoryId === item.categoryId
          );

          if (existingItem) {
            return {
              ...state,
              items: state.items.map(i =>
                i.eventId === item.eventId && i.categoryId === item.categoryId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              )
            };
          }

          return { ...state, items: [...state.items, item] };
        });
      },

      removeFromCart: (eventId, categoryId) => {
        set((state) => ({
          ...state,
          items: state.items.filter(
            i => !(i.eventId === eventId && i.categoryId === categoryId)
          )
        }));
      },

      updateQuantity: (eventId, categoryId, quantity) => {
        set((state) => ({
          ...state,
          items: state.items.map(item =>
            item.eventId === eventId && item.categoryId === categoryId
              ? { ...item, quantity }
              : item
          )
        }));
      },

      clearCart: () => set({ items: [], promoCode: null, promoDiscount: 0 }),

      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getFinalTotal: () => {
        const { getTotal, promoDiscount } = get();
        const total = getTotal();
        return total - (total * promoDiscount / 100);
      },

      applyPromoCode: (code) => {
        const discount = PROMO_CODES[code.toUpperCase()];
        if (discount) {
          set({ promoCode: code.toUpperCase(), promoDiscount: discount });
          return true;
        }
        return false;
      },

      removePromoCode: () => {
        set({ promoCode: null, promoDiscount: 0 });
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);