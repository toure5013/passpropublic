import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Ticket } from 'lucide-react';

export default function PaymentSuccess() {
  return (
    <div className="pt-4 sm:pt-6 pb-20">
      <div className="max-w-lg mx-auto px-3 sm:px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-sm p-6 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2 
            }}
            className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center"
          >
            <CheckCircle className="w-10 h-10 text-green-500" />
          </motion.div>

          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Paiement réussi !
          </h1>
          
          <p className="text-sm text-gray-600 mb-6">
            Votre commande a été confirmée. Vos tickets sont maintenant disponibles.
          </p>

          <Link
            to="/tickets"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-brand-button rounded-brand text-white text-sm font-medium hover:opacity-90 transition-opacity mb-4"
          >
            <Ticket className="w-4 h-4" />
            Voir mes tickets
          </Link>

          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-brand-red transition-colors"
          >
            Retour à l'accueil
          </Link>
        </motion.div>
      </div>
    </div>
  );
}