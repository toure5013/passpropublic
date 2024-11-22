import React, { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuickBuyProps {
  price: string;
  onPurchase: (quantity: number) => void;
}

export default function QuickBuy({ price, onPurchase }: QuickBuyProps) {
  const [quantity, setQuantity] = useState(1);

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };

  return (
    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2">Prix du billet</h3>
        <p className="text-xl sm:text-2xl font-bold text-brand-red">{price}</p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between bg-white rounded-lg p-2 sm:p-3 border border-gray-200">
          <button 
            onClick={decreaseQuantity}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600" />
          </button>
          <span className="text-sm sm:text-base font-medium text-gray-900">{quantity}</span>
          <button 
            onClick={increaseQuantity}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600" />
          </button>
        </div>

        <button 
          onClick={() => onPurchase(quantity)}
          className="w-full py-2 sm:py-2.5 px-3 sm:px-4 bg-brand-button rounded-brand text-xs sm:text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          Acheter maintenant
        </button>
      </div>

      <p className="mt-3 sm:mt-4 text-[10px] sm:text-xs text-gray-500 text-center">
        Pas de compte requis. Paiement sécurisé.
      </p>
    </div>
  );
}