import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contact() {
  return (
    <div className="pt-4 sm:pt-6 pb-20">
      <div className="max-w-lg mx-auto px-3 sm:px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-4 sm:p-6"
        >
          <h1 className="text-xl font-bold text-gray-900 mb-6">Contactez-nous</h1>
          
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-brand-red flex-shrink-0" />
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Téléphone</h2>
                <p className="text-sm text-gray-600">+225 07 00 00 00 00</p>
                <p className="text-xs text-gray-500">Du lundi au vendredi, 8h - 18h</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-brand-red flex-shrink-0" />
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Email</h2>
                <p className="text-sm text-gray-600">contact@passpro.ci</p>
                <p className="text-xs text-gray-500">Réponse sous 24h</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-brand-red flex-shrink-0" />
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Adresse</h2>
                <p className="text-sm text-gray-600">Abidjan, Côte d'Ivoire</p>
                <p className="text-xs text-gray-500">Cocody, Riviera Palmeraie</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}