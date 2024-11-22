import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonalInfo from '../components/Checkout/PersonalInfo';
import PaymentMethod from '../components/Checkout/PaymentMethod';

type CheckoutStep = 'personal-info' | 'payment';

export default function Checkout() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('personal-info');
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });

  const handlePersonalInfoSubmit = (info: typeof personalInfo) => {
    setPersonalInfo(info);
    setCurrentStep('payment');
  };

  const handlePaymentComplete = (paymentMethod: string) => {
    // Simuler le paiement
    console.log('Paiement effectué avec:', paymentMethod);
    // Rediriger vers la page de confirmation
    navigate('/confirmation');
  };

  return (
    <div className="pt-4 sm:pt-6 pb-20">
      <div className="max-w-lg mx-auto px-3 sm:px-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h1 className="text-xl font-bold text-gray-900 mb-6">
            Finaliser votre commande
          </h1>

          {currentStep === 'personal-info' ? (
            <PersonalInfo 
              initialValues={personalInfo}
              onSubmit={handlePersonalInfoSubmit}
            />
          ) : (
            <PaymentMethod
              onPaymentComplete={handlePaymentComplete}
              amount={25000} // À remplacer par le montant réel du panier
            />
          )}
        </div>
      </div>
    </div>
  );
}