import create from "zustand";
import { persist } from "zustand/middleware";
import { MyCustomEventPlace, MyCustomEventType } from "../utils/eventtypes";

export type CartItem = {
  id: number;
  event_name: string;
  ticketPriceId: number;
  price_label: string;
  price: number;
  quantity: number;
  payment_online: string;
  payment_on_delivery: string;
  ticket_physic: string;
  ticket_virtual: string;

  event_enterprise_name?: string;
  event_type_id?: number;
  description?: string | null;
  event_ticket_img?: string;
  event_date: string;
  event_cover?: string;
  event_hour?: string;
  event_place_id?: number;
  event_localization: string;
  event_commune?: string;
  event_room?: string;
  event_room_capacity: string;
  event_longitude?: string;
  event_latitude?: string;

  observation?: string | null;
  recommandation?: string | null;
  status?: number;
  created_at?: string;
  updated_at?: string;
  event_type?: MyCustomEventType;
  event_place?: MyCustomEventPlace;
};


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
              i.id === item.id &&
              i.ticketPriceId === item.ticketPriceId
          );

          if (existingItem) {
            return {
              ...state,
              items: state.items.map((i) =>
                i.id === item.id &&
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
            (i) => !(i.id == eventId && i.ticketPriceId == ticketPriceId)
          ),
        }));
      },

      updateQuantity: (eventId, ticketPriceId, quantity) => {
        set((state) => ({
          ...state,
          items: state.items.map((item) =>
            item.id == eventId && item.ticketPriceId == ticketPriceId
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
