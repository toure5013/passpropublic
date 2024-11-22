import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, UserCheck, Bell } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="pt-4 sm:pt-6 pb-20">
      <div className="max-w-lg mx-auto px-3 sm:px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-4 sm:p-6"
        >
          <h1 className="text-xl font-bold text-gray-900 mb-6">
            Politique de Confidentialité
          </h1>
          
          <div className="space-y-6">
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-5 w-5 text-brand-red" />
                <h2 className="text-base font-semibold text-gray-900">
                  Notre Engagement
                </h2>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                PassPro s'engage à protéger vos données personnelles conformément à la loi ivoirienne n°2013-450 du 19 juin 2013 relative à la protection des données personnelles. Cette politique s'applique à l'utilisation de notre application mobile et site web.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <UserCheck className="h-5 w-5 text-brand-red" />
                <h2 className="text-base font-semibold text-gray-900">
                  Données Collectées
                </h2>
              </div>
              <div className="text-sm text-gray-600 space-y-2">
                <p>Nous collectons uniquement les données nécessaires à nos services :</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Informations d'identification (nom, prénom)</li>
                  <li>Coordonnées (email, téléphone)</li>
                  <li>Données de transaction</li>
                  <li>Informations de navigation</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Lock className="h-5 w-5 text-brand-red" />
                <h2 className="text-base font-semibold text-gray-900">
                  Protection et Utilisation
                </h2>
              </div>
              <div className="text-sm text-gray-600 space-y-2">
                <p>Vos données sont utilisées pour :</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>La gestion de vos commandes de billets</li>
                  <li>L'amélioration de nos services</li>
                  <li>La communication sur les événements</li>
                  <li>La prévention des fraudes</li>
                </ul>
                <p className="mt-3">
                  Nous utilisons des protocoles de sécurité avancés pour protéger vos données. Elles ne sont jamais vendues à des tiers et ne sont partagées qu'avec les organisateurs d'événements dans la limite nécessaire.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Bell className="h-5 w-5 text-brand-red" />
                <h2 className="text-base font-semibold text-gray-900">
                  Vos Droits
                </h2>
              </div>
              <div className="text-sm text-gray-600 space-y-2">
                <p>Vous disposez des droits suivants :</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Accéder à vos données personnelles</li>
                  <li>Les modifier ou les supprimer</li>
                  <li>Limiter leur utilisation</li>
                  <li>Retirer votre consentement</li>
                </ul>
                <p className="mt-3">
                  Pour exercer ces droits ou pour toute question, contactez-nous à privacy@passpro.ci
                </p>
              </div>
            </section>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                Dernière mise à jour : Janvier 2024
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}