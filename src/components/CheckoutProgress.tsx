import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, ShoppingCart, CreditCard } from 'lucide-react';

interface CheckoutProgressProps {
  currentStep: 'selection' | 'cart' | 'payment';
}

const steps = [
  { id: 'selection', label: 'Sélection', icon: Ticket },
  { id: 'cart', label: 'Panier', icon: ShoppingCart },
  { id: 'payment', label: 'Paiement', icon: CreditCard }
];

export default function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep);
  };

  const pulseAnimation = {
    scale: [1, 1.1, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="relative z-10">
      <div className="max-w-lg mx-auto px-3 sm:px-4 py-3">
        <div className="relative flex justify-between">
          {/* Barre de progression */}
          <div 
            className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200/50 backdrop-blur-sm"
            style={{ zIndex: 0 }}
          />
          <motion.div 
            className="absolute top-4 left-0 h-0.5"
            style={{ 
              zIndex: 1,
              background: 'linear-gradient(90deg, #FF8A00 0%, #D43530 100%)',
              filter: 'drop-shadow(0 0 2px rgba(255,138,0,0.3))'
            }}
            initial={{ width: '0%' }}
            animate={{ 
              width: `${(getCurrentStepIndex() / (steps.length - 1)) * 100}%` 
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />

          {/* Points lumineux animés sur la barre */}
          <motion.div
            className="absolute top-4 h-0.5 w-4 bg-white/50 blur-sm"
            animate={{
              x: ['0%', '100%'],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ zIndex: 2 }}
          />

          {/* Étapes */}
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = getCurrentStepIndex() > index;
            const isCurrent = step.id === currentStep;
            
            return (
              <div 
                key={step.id} 
                className="relative flex flex-col items-center"
                style={{ zIndex: 3 }}
              >
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted || isCurrent
                      ? 'bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end'
                      : 'bg-gray-200/80 backdrop-blur-sm'
                  }`}
                  initial={false}
                  animate={isCurrent ? pulseAnimation : {}}
                  whileHover={{ scale: 1.1 }}
                  style={{
                    boxShadow: (isCompleted || isCurrent) 
                      ? '0 0 10px rgba(255,138,0,0.3)' 
                      : 'none'
                  }}
                >
                  <StepIcon 
                    className={`h-4 w-4 ${
                      isCompleted || isCurrent ? 'text-white' : 'text-gray-600'
                    }`}
                  />
                </motion.div>
                <motion.span 
                  className={`mt-2 text-xs ${
                    isCurrent 
                      ? 'font-medium text-brand-red' 
                      : isCompleted 
                        ? 'text-brand-red/70' 
                        : 'text-gray-500'
                  }`}
                  animate={isCurrent ? { opacity: [0.7, 1, 0.7] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {step.label}
                </motion.span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}