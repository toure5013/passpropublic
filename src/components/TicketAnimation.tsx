import React from 'react';
import { motion } from 'framer-motion';
import { Ticket } from 'lucide-react';

export default function TicketAnimation() {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ 
        scale: [0.5, 1.2, 1],
        opacity: 1,
        rotate: [0, 10, 0]
      }}
      transition={{ 
        duration: 0.5,
        times: [0, 0.6, 1],
        ease: "easeOut"
      }}
      className="fixed bottom-24 right-4 z-50 bg-brand-red text-white p-3 rounded-full shadow-lg"
    >
      <Ticket className="h-6 w-6" />
    </motion.div>
  );
}