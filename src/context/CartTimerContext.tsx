import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

interface CartTimerContextType {
  timeLeft: number;
  isWarning: boolean;
}

const CartTimerContext = createContext<CartTimerContextType | null>(null);

export function CartTimerProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const clearCart = useCartStore(state => state.clearCart);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes en secondes
  const [isWarning, setIsWarning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          clearCart();
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [clearCart, navigate]);

  useEffect(() => {
    setIsWarning(timeLeft <= 120); // Warning quand il reste moins de 2 minutes
  }, [timeLeft]);

  return (
    <CartTimerContext.Provider value={{ timeLeft, isWarning }}>
      {children}
    </CartTimerContext.Provider>
  );
}

export function useCartTimer() {
  const context = useContext(CartTimerContext);
  if (!context) {
    throw new Error('useCartTimer must be used within a CartTimerProvider');
  }
  return context;
}