import React from 'react';
import { motion } from 'framer-motion';

export default function Help() {
  const faqs = [
    {
      question: "Comment acheter un ticket ?",
      answer: "Sélectionnez l'événement qui vous intéresse, choisissez votre catégorie de ticket et la quantité souhaitée, puis procédez au paiement en suivant les étapes indiquées."
    },
    {
      question: "Comment récupérer mon ticket ?",
      answer: "Après votre achat, votre e-ticket sera disponible dans la section 'Mes tickets'. Vous pouvez le télécharger en PDF ou le présenter directement sur votre téléphone."
    },
    {
      question: "Quels sont les moyens de paiement acceptés ?",
      answer: "Nous acceptons les paiements par carte bancaire, Wave, Orange Money, MTN Money et Moov Money."
    },
    {
      question: "Comment obtenir un remboursement ?",
      answer: "En cas d'annulation de l'événement, le remboursement est automatique. Pour toute autre demande, contactez notre service client."
    }
  ];

  return (
    <div className="pt-4 sm:pt-6 pb-20">
      <div className="max-w-lg mx-auto px-3 sm:px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-4 sm:p-6"
        >
          <h1 className="text-xl font-bold text-gray-900 mb-6">Centre d'aide</h1>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-gray-100 pb-4"
              >
                <h2 className="text-sm font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h2>
                <p className="text-sm text-gray-600">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}