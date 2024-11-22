import React from 'react';
import { AlertCircle, Clock, Ban, Shield } from 'lucide-react';

export default function TicketGuidelines() {
  const guidelines = [
    {
      icon: <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />,
      title: "Gardez votre e-ticket prêt",
      text: "Conservez-le en sécurité sur votre téléphone ou imprimez-le pour une présentation rapide à l'entrée."
    },
    {
      icon: <Clock className="h-4 w-4 sm:h-5 sm:w-5" />,
      title: "Arrivez en avance",
      text: "Prévoir 30 à 45 minutes d'avance pour éviter les files d'attente."
    },
    {
      icon: <Ban className="h-4 w-4 sm:h-5 sm:w-5" />,
      title: "Évitez les objets interdits",
      text: "Consultez la liste des objets interdits (bouteilles, objets tranchants, etc) pour éviter les contrôles prolongés."
    },
    {
      icon: <Shield className="h-4 w-4 sm:h-5 sm:w-5" />,
      title: "Respectez les consignes",
      text: "Suivez les instructions du personnel pour assurer la sécurité de tous."
    }
  ];

  return (
    <div className="mt-4 bg-gray-50 rounded-lg p-4 print:bg-white">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Conseils d'usage</h3>
      <div className="space-y-4">
        {guidelines.map((item, index) => (
          <div key={index} className="flex gap-3">
            <div className="flex-shrink-0 text-brand-red mt-0.5">
              {item.icon}
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}