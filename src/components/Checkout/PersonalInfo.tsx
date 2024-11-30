import React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";

interface PersonalInfoProps {
  initialValues: {
    name: string;
    surname: string;
    tel: string;
  };
  isLoading?: boolean;
  onSubmit: (data: PersonalInfoProps["initialValues"]) => void;
}

export default function PersonalInfo({
  initialValues,
  onSubmit,
  isLoading
}: PersonalInfoProps) {
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
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
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Prénom
        </label>
        <input
          type="text"
          id="name"
          value={initialValues.name}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
          {...register("name", { required: "Le prénom est requis" })}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="surname"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nom
        </label>
        <input
          type="text"
          id="surname"
          value={initialValues.surname}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
          {...register("surname", { required: "Le nom est requis" })}
        />
        {errors.surname && (
          <p className="mt-1 text-xs text-red-500">{errors.surname.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Numéro de téléphone
        </label>
        <input
          type="tel"
          id="phone"
           maxLength={10}
          minLength={10}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
          {...register("tel", {
            required: "Le numéro de téléphone est requis",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Numéro de téléphone invalide",
            },
          })}
        />
        {errors.tel && (
          <p className="mt-1 text-xs text-red-500">{errors.tel.message}</p>
        )}
      </div>

      {isLoading ?   //CENTER ISLAODING
          <div className="w-full flex items-center justify-center">
            <Loader color="#FF8A00" />
          </div> : <button
        type="submit"
        className="w-full py-3 bg-brand-button text-white rounded-brand text-sm font-medium hover:opacity-90 transition-opacity mt-6"
      >
        Continuer
      </button>
}
      <p className="text-xs text-center text-gray-500 mt-4">
        Vos informations sont sécurisées et ne seront utilisées que pour cette
        commande
      </p>
    </form>
  );
}
