import create from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  eventId: number;
  eventTitle: string;
  ticketPriceId: number;
  price_label: string;
  quantity: number;
  price: number;
}

interface CartStore {
  items: CartItem[];
  promoCode: string | null;
  promoDiscount: number;
  acceptTerms: boolean;
  addToCart: (item: CartItem) => void;
  addOneToCartMutiple: (item: CartItem) => void;
  removeFromCart: (eventId: number, ticketPriceId: number) => void;
  updateQuantity: (
    eventId: number,
    ticketPriceId: number,
    quantity: number
  ) => void;
  removeAllItems: () => void;
  clearCart: () => void;
  getTotal: () => number;
  getFinalTotal: () => number;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  setAcceptTerms: (value: boolean) => void;
}

const PROMO_CODES: any = {
  WELCOME: 10, // 10% de réduction
  SUMMER: 15, // 15% de réduction
  VIP: 20, // 20% de réduction
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      promoDiscount: 0,
      acceptTerms: false,
      setAcceptTerms: (value) => {
        set({ acceptTerms: value });
      },

      addToCart: (item) => {
        set((state) => {
          const existingItem = state.items.find(
            (i) =>
              i.eventId === item.eventId &&
              i.ticketPriceId === item.ticketPriceId
          );

          if (existingItem) {
            return {
              ...state,
              items: state.items.map((i) =>
                i.eventId === item.eventId &&
                i.ticketPriceId === item.ticketPriceId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }

          return { ...state, items: [...state.items, item] };
        });
      },

      addOneToCartMutiple: (item) => {
        set(() => ({
          items: [item], // Replace the current cart with the new item
        }));
      },

      removeFromCart: (eventId, ticketPriceId) => {
        set((state) => ({
          ...state,
          items: state.items.filter(
            (i) => !(i.eventId == eventId && i.ticketPriceId == ticketPriceId)
          ),
        }));
      },

      updateQuantity: (eventId, ticketPriceId, quantity) => {
        set((state) => ({
          ...state,
          items: state.items.map((item) =>
            item.eventId == eventId && item.ticketPriceId == ticketPriceId
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      removeAllItems: () => set({ items: [] }),

      clearCart: () => set({ items: [], promoCode: null, promoDiscount: 0 }),

      getTotal: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getFinalTotal: () => {
        const { getTotal, promoDiscount } = get();
        const total = getTotal();
        return total - (total * promoDiscount) / 100;
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
      name: "cart-storage",
    }
  )
);
