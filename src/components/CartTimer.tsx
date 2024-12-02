import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useCartTimer } from '../context/CartTimerContext';

export default function CartTimer({onExpire}: {onExpire: () => void}) {
  const { timeLeft, isWarning } = useCartTimer();

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  React.useEffect(() => {
    if (timeLeft === 0) {
      onExpire();
    }
  }, [timeLeft, onExpire]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs ${
        isWarning 
          ? 'bg-red-50 text-red-500' 
          : 'bg-brand-yellow/10 text-brand-red'
      }`}
    >
      <Clock className="h-3.5 w-3.5" />
      <motion.span
        key={timeLeft}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        className="font-medium tabular-nums"
      >
        {`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
      </motion.span>
      <span className="hidden sm:inline">
        {isWarning ? 'Panier bientôt expiré !' : 'avant expiration'}
      </span>
    </motion.div>
  );
}