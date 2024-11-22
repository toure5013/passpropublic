import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';

interface PersonalInfoProps {
  initialValues: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  onSubmit: (data: PersonalInfoProps['initialValues']) => void;
}

export default function PersonalInfo({ initialValues, onSubmit }: PersonalInfoProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialValues
  });

  // Générer un numéro de commande aléatoire
  const orderNumber = React.useMemo(() => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `CMD-${randomNum}`;
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="mb-6">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
        >
          <div>
            <p className="text-xs text-gray-500">Numéro de commande</p>
            <p className="text-sm font-semibold text-gray-900">{orderNumber}</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-brand-yellow/10 flex items-center justify-center">
            <span className="text-xs font-medium text-brand-red">1/2</span>
          </div>
        </motion.div>
      </div>

      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
          Prénom
        </label>
        <input
          type="text"
          id="firstName"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
          {...register('firstName', { required: 'Le prénom est requis' })}
        />
        {errors.firstName && (
          <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
          Nom
        </label>
        <input
          type="text"
          id="lastName"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
          {...register('lastName', { required: 'Le nom est requis' })}
        />
        {errors.lastName && (
          <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Numéro de téléphone
        </label>
        <input
          type="tel"
          id="phone"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
          {...register('phone', { 
            required: 'Le numéro de téléphone est requis',
            pattern: {
              value: /^[0-9]{10}$/,
              message: 'Numéro de téléphone invalide'
            }
          })}
        />
        {errors.phone && (
          <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-brand-button text-white rounded-brand text-sm font-medium hover:opacity-90 transition-opacity mt-6"
      >
        Continuer
      </button>

      <p className="text-xs text-center text-gray-500 mt-4">
        Vos informations sont sécurisées et ne seront utilisées que pour cette commande
      </p>
    </form>
  );
}