import React, { useState } from 'react';
import { Minus, Plus, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../../store/cartStore';

interface TicketCategory {
  id: string;
  name: string;
  price: number;
  description: string;
  available: number;
}

interface TicketSelectorProps {
  eventId: string;
  eventTitle: string;
  categories: TicketCategory[];
}

export default function TicketSelector({ eventId, eventTitle, categories }: TicketSelectorProps) {
  const navigate = useNavigate();
  const addToCart = useCartStore(state => state.addToCart);
  const [selections, setSelections] = useState<Record<string, number>>(() => {
    return categories.reduce((acc, category) => ({
      ...acc,
      [category.id]: 0
    }), {});
  });

  const updateQuantity = (categoryId: string, delta: number) => {
    const currentQuantity = selections[categoryId];
    const category = categories.find(c => c.id === categoryId);
    
    if (!category) return;
    
    const newQuantity = currentQuantity + delta;
    if (newQuantity >= 0 && newQuantity <= Math.min(10, category.available)) {
      setSelections(prev => ({
        ...prev,
        [categoryId]: newQuantity
      }));
    }
  };

  const hasSelections = Object.values(selections).some(quantity => quantity > 0);
  
  const totalAmount = categories.reduce((sum, category) => {
    return sum + (category.price * (selections[category.id] || 0));
  }, 0);

  const handleProceedToCheckout = () => {
    // Ajouter chaque sélection au panier
    Object.entries(selections).forEach(([categoryId, quantity]) => {
      if (quantity > 0) {
        const category = categories.find(c => c.id === categoryId);
        if (category) {
          addToCart({
            eventId,
            eventTitle,
            categoryId,
            categoryName: category.name,
            quantity,
            price: category.price
          });
        }
      }
    });
    
    navigate('/panier');
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
        {categories.map((category, index) => (
          <motion.div 
            key={category.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <motion.div
                  animate={{ rotate: selections[category.id] > 0 ? 360 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Ticket className="h-4 w-4 text-brand-red" />
                </motion.div>
                <div>
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                  <p className="text-xs text-gray-500">
                    {category.available} places disponibles
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-1">{category.description}</p>
              <p className="text-sm font-semibold text-brand-red">
                {category.price.toLocaleString()} F CFA
              </p>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => updateQuantity(category.id, -1)}
                className="p-1 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                disabled={selections[category.id] === 0}
              >
                <Minus className="h-4 w-4 text-gray-600" />
              </motion.button>
              
              <AnimatePresence mode="wait">
                <motion.span
                  key={selections[category.id]}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="w-5 text-center text-sm font-medium"
                >
                  {selections[category.id]}
                </motion.span>
              </AnimatePresence>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => updateQuantity(category.id, 1)}
                className="p-1 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                disabled={selections[category.id] >= Math.min(10, category.available)}
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
            animate={{ opacity: 1, height: 'auto' }}
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