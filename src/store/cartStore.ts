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
  ticketOwnerInfo? : {
    name: string;
    surname: string;
    tel: string;
    uuid: string
  }
};


interface CartStore {
  items: CartItem[];
  promoCode: string | null;
  promoDiscountAmount: number;
  acceptTerms: boolean;
  codePromoInfo: any;
  codePromoStatus: string;
  addToCart: (item: CartItem) => void;
  updateAllItemsOwnerInformation: (ticketOwnerInfo: any) => void;
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
  applyPromoCode: (code: string, promoDiscountAmount : number, codePromoInfo : any, codePromoStatus : string,) => boolean;
  removePromoCode: () => void;
  setAcceptTerms: (value: boolean) => void;
  setCodePromoInfo: (codePromoInfo: any) => void;

}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      
      items: [],
      promoCode: null,
      promoDiscountAmount: 0,
      acceptTerms: false,
      codePromoInfo : {},
      codePromoStatus : "",


      setCodePromoInfo: (codePromoInfo) => {
        set({ codePromoInfo });
      },
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

      updateAllItemsOwnerInformation: (ticketOwnerInfo) => {
        set((state) => {
          return {
            ...state,
            items: state.items.map((item) => {
              return {
                ...item,
                ticketOwnerInfo
              };
            }),
          };
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

      clearCart: () => set({ items: [], promoCode: null, promoDiscountAmount: 0 }),

      getTotal: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getFinalTotal: () => {
        const { getTotal, promoDiscountAmount } = get();
        const total = getTotal();
        return total - promoDiscountAmount;
      },

      applyPromoCode: (_promoCode, _codePromoInfo, _promoDiscountAmount, _codePromoStatus) => {
        if (_promoDiscountAmount) {
          set({ promoCode: _promoCode, promoDiscountAmount: _promoDiscountAmount, codePromoInfo : _codePromoInfo, codePromoStatus : _codePromoStatus });
          return true;
        }
        return false;
      },

      removePromoCode: () => {
        set({ promoCode: null, promoDiscountAmount: 0 });
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
