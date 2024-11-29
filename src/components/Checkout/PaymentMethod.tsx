import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface PaymentMethodProps {
  amount: number;
  onPaymentComplete: (method: string) => void;
}
 
interface PaymentOption {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const paymentOptions: PaymentOption[] = [
  {
    id: 'card',
    name: 'Carte bancaire',
    icon: '/assets/images/payments/bank-card.png',
    color: 'bg-blue-500'
  },
  {
    id: 'wave',
    name: 'Wave',
    icon: '/assets/images/payments/wave.png',
    color: 'bg-[#1DC1EC]'
  },
  {
    id: 'orange',
    name: 'Orange Money',
    icon: '/assets/images/payments/orange.png',
    color: 'bg-[#FF7900]'
  },
  {
    id: 'mtn',
    name: 'MTN Money',
    icon: '/assets/images/payments/mtn.png',
    color: 'bg-[#FFC403]'
  },
  {
    id: 'moov',
    name: 'Moov Money',
    icon: '/assets/images/payments/moov.png',
    color: 'bg-[#0066B3]'
  }
];

export default function PaymentMethod({ amount }: PaymentMethodProps) {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!selectedMethod || isProcessing) return;

    setIsProcessing(true);

    try {
      // Simuler un appel API de paiement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simuler un succès ou échec aléatoire
      const isSuccess = Math.random() > 0.3;
      
      if (isSuccess) {
        navigate('/paiement/succes');
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      navigate('/paiement/erreur');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Moyen de paiement
        </h2>
        <p className="text-sm text-gray-600">
          Choisissez votre moyen de paiement préféré
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {paymentOptions.map((option) => (
          <motion.label
            key={option.id}
            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedMethod === option.id
                ? 'border-brand-red bg-brand-red/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={option.id}
              checked={selectedMethod === option.id}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="sr-only"
              disabled={isProcessing}
            />
            <div className="flex items-center flex-1">
              <img
                src={option.icon}
                alt={option.name}
                className="h-8 w-8 object-contain"
              />
              <span className="ml-3 text-sm font-medium text-gray-900">
                {option.name}
              </span>
            </div>
            <div className={`w-4 h-4 rounded-full border-2 ml-4 ${
              selectedMethod === option.id
                ? 'border-brand-red bg-brand-red'
                : 'border-gray-300'
            }`}>
              {selectedMethod === option.id && (
                <div className="w-2 h-2 m-0.5 rounded-full bg-white" />
              )}
            </div>
          </motion.label>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-medium text-gray-700">Total à payer</span>
          <span className="text-xl font-bold text-brand-red">
            {amount.toLocaleString()} F CFA
          </span>
        </div>

        <motion.button
          onClick={handlePayment}
          disabled={!selectedMethod || isProcessing}
          className="w-full py-3 bg-brand-button text-white rounded-brand text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <motion.div
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span className="ml-2">Traitement en cours...</span>
            </div>
          ) : (
            "Payer maintenant"
          )}
        </motion.button>

        <p className="mt-4 text-xs text-center text-gray-500">
          Paiement sécurisé et crypté
        </p>
      </div>
    </div>
  );
}