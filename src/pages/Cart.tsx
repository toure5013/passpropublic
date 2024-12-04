import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, Tag, X, LinkIcon } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';
import ImageLoader from '../components/ImageLoader';
import { MyCustomEvent } from '../utils/eventtypes';
import { useEventStore } from '../store/eventStore';
import { configService } from '../providers/configService';
import CartTimer from '../components/CartTimer';
import { toast } from 'react-toastify';

export default function Cart() {
  const navigate = useNavigate();

  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    getTotal, 
    getFinalTotal,
    promoCode,
    promoDiscount,
    applyPromoCode,
    removePromoCode,
    acceptTerms,
    setAcceptTerms,
    clearCart
  } = useCartStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [event, setEvent] = React.useState<MyCustomEvent>({} as MyCustomEvent);
  const { getEventById } = useEventStore();

  
  function getEventByIdAsync(id: number) {
    const _event:MyCustomEvent =  getEventById(+id);
    return _event;
  }

  const handleApplyPromo = () => {
    if (!promoInput.trim()) {
      setPromoError('Veuillez entrer un code promo');
      return;
    }

    const success = applyPromoCode(promoInput);
    if (success) {
      setPromoError('');
      setPromoInput('');
    } else {
      setPromoError('Code promo invalide');
    }
  };

  const handleCartExpire = () => {
    clearCart();
    navigate('/');
  };

  if (items.length === 0) {
    return (
      <div className="pt-4 sm:pt-6">
        <div className="max-w-lg mx-auto px-3 sm:px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-4 sm:p-6 text-center"
          >
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
              Votre panier est vide
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm mb-4">
              Découvrez nos événements et ajoutez des billets à votre panier.
            </p>
            <Link
              to="/"
              className="inline-block bg-brand-button rounded-brand text-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Voir les événements
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 sm:pt-6">
      <div className="max-w-lg mx-auto px-3 sm:px-4">
      <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
            Tickets sélectionnés
          </h1>
          <CartTimer onExpire={handleCartExpire} />
        </div>


        <AnimatePresence>
          <div className="space-y-3 sm:space-y-4">
            {items.map((item) => (
              <motion.div 
                key={`${item.id}-${item.ticketPriceId}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="flex gap-2 p-2 sm:p-3">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden">
                    {item ? <ImageLoader
                       src={configService.baseUrlImage + item.event_ticket_img}
                       alt={item.event_name}
                      className="w-full h-full object-cover"
                    /> : ''}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 mb-0.5 truncate">
                          {getEventByIdAsync(item.id).event_name}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2">
                          Catégorie: {item.price_label}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.ticketPriceId)}
                        className="text-gray-400 hover:text-gray-500 ml-2"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.ticketPriceId, item.quantity - 1)}
                          className="p-1 rounded-md hover:bg-gray-100"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3 text-gray-600" />
                        </button>
                        <span className="text-xs font-medium w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.ticketPriceId, item.quantity + 1)}
                          className="p-1 rounded-md hover:bg-gray-100"
                          disabled={item.quantity >= 10}
                        >
                          <Plus className="h-3 w-3 text-gray-600" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-brand-red">
                        {(item.price * item.quantity).toLocaleString()} F CFA
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 sm:mt-6 space-y-4"
        >
          {/* Code Promo */}
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Code promo</h3>
            {promoCode ? (
              <div className="flex items-center justify-between bg-brand-yellow/10 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-brand-red" />
                  <span className="text-sm font-medium text-brand-red">
                    {promoCode} (-{promoDiscount}%)
                  </span>
                </div>
                <button
                  onClick={removePromoCode}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="Entrez votre code"
                    className="w-full px-3 py-2 text-sm input-gradient-focus"
                  />
                  {promoError && (
                    <p className="mt-1 text-xs text-red-500">{promoError}</p>
                  )}
                </div>
                <button
                  onClick={handleApplyPromo}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Appliquer
                </button>
              </div>
            )}
          </div>

          {/* Total et Checkout */}
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sous-total</span>
                <span className="text-sm font-medium text-gray-900">
                  {getTotal().toLocaleString()} F CFA
                </span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between items-center text-brand-red">
                  <span className="text-sm">Réduction</span>
                  <span className="text-sm font-medium">
                    -{(getTotal() * promoDiscount / 100).toLocaleString()} F CFA
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-medium text-gray-900">Total</span>
                <span className="text-lg font-bold text-brand-red">
                  {getFinalTotal().toLocaleString()} F CFA
                </span>
              </div>
            </div>


            <label className="flex items-start gap-2 text-left mb-4">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 h-4 w-4 text-brand-red border-gray-300 rounded focus:ring-brand-red"
              />
              <span className="text-sm text-gray-600">
                En poursuivant, j'accepte les{' '}
                <a 
                  href="/conditions" 
                  target="_blank"
                  className="text-brand-red hover:text-brand-red/80 font-medium inline-flex items-center gap-0.5"
                >
                  conditions générales d'utilisation
                  <LinkIcon className="h-3 w-3" />
                </a>
              </span>
            </label>
            
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (!acceptTerms) {
                    toast.error("Veuillez accepter les conditions d'utilisation", {
                      autoClose: 1000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                    });
                    return
                  }

                  navigate("/checkout")
                }}
                className="block w-full text-center bg-brand-button rounded-brand text-white py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
                // disabled={!acceptTerms}
              >
                Procéder au paiement
              </motion.button>
              
          </div>
        </motion.div>
      </div>
    </div>
  );
}