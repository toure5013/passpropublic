import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, RefreshCcw, Mail } from 'lucide-react';

export default function PaymentError() {
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
            className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center"
          >
            <XCircle className="w-10 h-10 text-red-500" />
          </motion.div>

          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Échec du paiement
          </h1>
          
          <p className="text-sm text-gray-600 mb-6">
            Une erreur est survenue lors du traitement de votre paiement. Veuillez réessayer ou contacter notre support.
          </p>

          <div className="space-y-3 mb-6">
            <Link
              to="/checkout"
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-brand-button rounded-brand text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <RefreshCcw className="w-4 h-4" />
              Réessayer le paiement
            </Link>

            <a
              href="mailto:support@passpro.ci"
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-gray-100 rounded-brand text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Contacter le support
            </a>
          </div>

          <div className="text-xs text-gray-500 space-y-2">
            <p>Code erreur: #PAY_ERR_001</p>
            <p>
              Support disponible 24/7:<br />
              support@passpro.ci<br />
              +225 07 00 00 00 00
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}