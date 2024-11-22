import React from 'react';
import { motion } from 'framer-motion';

export default function Terms() {
  return (
    <div className="pt-4 sm:pt-6 pb-20">
      <div className="max-w-lg mx-auto px-3 sm:px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-4 sm:p-6"
        >
          <h1 className="text-xl font-bold text-gray-900 mb-6">
            Conditions Générales de Vente
          </h1>
          
          <div className="space-y-6 text-sm text-gray-600">
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">
                1. Objet
              </h2>
              <p className="leading-relaxed">
                Les présentes Conditions Générales de Vente régissent l'utilisation du service de billetterie en ligne PassPro, accessible via l'application mobile et le site web.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">
                2. Prix et Paiement
              </h2>
              <p className="leading-relaxed">
                Les prix des billets sont indiqués en Francs CFA toutes taxes comprises. Le paiement est exigible immédiatement à la commande et peut être effectué par carte bancaire ou mobile money.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">
                3. Validité des Billets
              </h2>
              <p className="leading-relaxed">
                Chaque billet est muni d'un QR code unique et ne peut être utilisé qu'une seule fois. La reproduction ou falsification des billets est strictement interdite.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">
                4. Remboursement
              </h2>
              <p className="leading-relaxed">
                En cas d'annulation de l'événement, les billets seront intégralement remboursés. Aucun remboursement ne sera effectué en cas de non-utilisation du billet.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}