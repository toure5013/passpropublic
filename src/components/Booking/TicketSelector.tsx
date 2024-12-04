import React, { useState } from "react";
import { Minus, Plus, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "../../store/cartStore";
import {
  MyCustomEvent,
  MyCustomEventTicketPrice,
} from "../../utils/eventtypes";

interface TicketSelectorProps {
  event: MyCustomEvent;
  eventId: number;
  eventTitle: string;
  ticketOwnerInfo?: {
    name : string;
    surname : string;
    tel : string
    uuid : string
  };
  ticketPrices: MyCustomEventTicketPrice[];
}

export default function TicketSelector({
  event,
  ticketOwnerInfo,
  ticketPrices,
}: TicketSelectorProps) {
  const navigate = useNavigate();
  const {
    items,
    removeFromCart,
    getTotal,
    getFinalTotal,
    promoCode,
    promoDiscount,
    applyPromoCode,
    addToCart,
    removePromoCode,
  } = useCartStore();

  const [selections, setSelections] = useState<Record<number, number>>(() => {
    //if items is not empty, set selections to items
    if (items.length > 0) {
      return items.reduce(
        (acc, item) => ({
          ...acc,
          [item.ticketPriceId]: item.quantity,
        }),
        {}
      );
    } else {
      return ticketPrices.reduce(
        (acc, ticketPrice) => ({
          ...acc,
          [ticketPrice.id]: 0,
        }),
        {}
      );
    }
  });

  const updateQuantity = (ticketPriceId: number, delta: number) => {
    console.log("j'update");

    const currentQuantity = selections[ticketPriceId]
      ? selections[ticketPriceId]
      : 0;
    const ticketPrice = ticketPrices.find((c) => c.id === ticketPriceId);

    if (!ticketPrice) return;

    const newQuantity = currentQuantity + delta;
    if (newQuantity >= 0) {
      setSelections((prev) => ({
        ...prev,
        [ticketPriceId]: newQuantity,
      }));
    }
  };

  const hasSelections = Object.values(selections).some(
    (quantity) => quantity > 0
  );

  const totalAmount = ticketPrices.reduce((sum, ticketPrice) => {
    return sum + ticketPrice.price * (selections[ticketPrice.id] || 0);
  }, 0);

  const handleProceedToCheckout = () => {
    // Ajouter chaque sélection au panier
    Object.entries(selections).forEach(([ticketPriceId, quantity]) => {
      if (quantity > 0) {
        const ticketPrice = ticketPrices.find((c) => c.id === +ticketPriceId);
        if (ticketPrice) {
          addToCart({
            id: event.id,
            quantity: quantity,
            event_name: event.event_name,
            ticketPriceId: +ticketPriceId,
            price_label: ticketPrice.price_label,
            price: ticketPrice.price,
            event_ticket_img: event.event_ticket_img
              ? event.event_ticket_img
              : "",
            event_cover: event.event_cover ? event.event_cover : "",
            event_date: event.event_date ? event.event_date : "",
            event_hour: event.event_hour ? event.event_hour : "",
            event_localization: event.event_localization
              ? event.event_localization
              : "",
            event_room_capacity: event.event_room_capacity
              ? event.event_room_capacity
              : "",
            event_commune: event.event_commune,
            payment_online: event.payment_online ?  event.payment_online : "",
            payment_on_delivery: event.payment_on_delivery ? event.payment_on_delivery :  "",
            ticket_physic: event.ticket_physic ? event.ticket_physic :  "",
            ticket_virtual: event.ticket_virtual ? event.ticket_virtual : "",
            observation: event.observation,
            ticketOwnerInfo: ticketOwnerInfo
          });
        }
      }
    });

    navigate("/panier");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-sm p-4"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Sélectionnez vos billets
      </h2>

      <div className="space-y-4">
        {ticketPrices.map((ticketPrice, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <motion.div
                  animate={{ rotate: selections[ticketPrice.id] > 0 ? 360 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Ticket className="h-4 w-4 text-brand-red" />
                </motion.div>
                {/* <div>
                  <h3 className="font-medium text-gray-900">{ticketPrice.price_label}</h3>
                  <p className="text-xs text-gray-500">
                    {event.event_room_capacity} places disponibles
                  </p>
                </div> */}
              </div>
              <p className="text-xs text-gray-600 mb-1">
                {ticketPrice.price_label}
              </p>
              <p className="text-sm font-semibold text-brand-red">
                {ticketPrice.price.toLocaleString()} F CFA
              </p>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => updateQuantity(ticketPrice.id, -1)}
                className="p-1 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                disabled={selections[ticketPrice.id] === 0}
              >
                <Minus className="h-4 w-4 text-gray-600" />
              </motion.button>

              <AnimatePresence mode="wait">
                <motion.span
                  key={selections[ticketPrice.id] + index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="w-5 text-center text-sm font-medium"
                >
                  {selections[ticketPrice.id] || 0}
                </motion.span>
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => updateQuantity(ticketPrice.id, 1)}
                className="p-1 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                disabled={
                  selections[ticketPrice.id] >=
                  Math.min(10, +event.event_room_capacity)
                }
              >
                <Plus className="h-4 w-4 text-gray-600" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {hasSelections && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 space-y-4"
          >
            <div className="flex justify-between items-center py-3 border-t">
              <span className="font-medium">Total</span>
              <motion.span
                key={totalAmount}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-lg font-bold text-brand-red"
              >
                {totalAmount.toLocaleString()} F CFA
              </motion.span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleProceedToCheckout}
              className="w-full py-3 bg-brand-button text-white rounded-brand text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Continuer
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
