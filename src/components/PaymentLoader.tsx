import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Phone,
  CreditCard,
  Info,
} from "lucide-react";
import { sanitizeWaveUrlBasedOnDevice } from "../utils/paymentUtils";

interface PayementInstructions {
  deepLink?: string;
  externalTransactionId?: string;
  _be_removed_deepLinkUrl_?: string;
  redirectUrl?: string;
  icon: string;
  name: string;
}
interface PaymentLoaderProps {
  status: "processing" | "success" | "error" | "ticketgeneration";
  message?: string;
  instructions: PayementInstructions;
  orderDetails?: {
    amount: number;
    paymentMethod: string;
    tel: string;
    // items: Array<{
    //   name: string;
    //   quantity: number;
    //   price: number;
    // }>;
  };
}

export default function PaymentLoader({
  status,
  message,
  orderDetails,
  instructions,
}: PaymentLoaderProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "processing":
        return {
          icon: <Loader2 className="h-12 w-12 text-brand-red" />,
          text: `En attente de paiement`,
          bgColor: "bg-brand-yellow/10",
          textColor: "text-brand-red",
          instruction: instructions.name === "mtn" || instructions.name === "moov"
          ? "Une demande de débit de paiement a été envoyée à votre numéro de téléphone. Veuillez vérifier votre téléphone pour confirmer le paiement."
          : "Veuillez cliquer sur le bouton ci-dessous pour effectuer le paiement",
          isBouttonActive:
            instructions.name == "wave" || instructions.name == "orange",
        };
      case "success":
        return {
          icon: <CheckCircle2 className="h-12 w-12 text-green-500" />,
          text: message || "Paiement effectué avec succès !",
          bgColor: "bg-green-50",
          textColor: "text-green-600",
          instruction: "Vos tickets seront disponibles dans quelques instants.",
        };
      case "ticketgeneration":
        return {
          icon: <CheckCircle2 className="h-12 w-12 text-green-500" />,
          text: message || "Génération des tickets en cours !",
          bgColor: "bg-green-50",
          textColor: "text-green-600",
          instruction: "Vos tickets seront disponibles dans quelques instants.",
        };
      case "error":
        return {
          icon: <XCircle className="h-12 w-12 text-red-500" />,
          text: message || "Une erreur est survenue",
          bgColor: "bg-red-50",
          textColor: "text-red-600",
          instruction: "Veuillez réessayer ou contacter le support.",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-6 sm:p-8 max-w-sm w-full mx-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className={`w-24 h-24 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}
        >
          {status === "processing" ? (
            // <motion.div
            //   animate={{ rotate: 360 }}
            //   transition={{
            //     duration: 1,
            //     repeat: Infinity,
            //     ease: "linear",
            //   }}
            // >
            //   {config.icon}
            // </motion.div>
            <div className="flex items-center ">
              <img
                src={instructions.icon}
                alt={instructions.name}
                className="h-8 w-8 object-contain"
              />
            </div>
          ) : (
            config.icon
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2
            className={`text-sm font-semibold ${config.textColor} text-center mb-2`}
          >
            {config.text}
          </h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            {config.instruction}
          </p>

          {config.isBouttonActive && (
            <motion.button
              onClick={() => {
                console.log(instructions);
                
                if (instructions.redirectUrl) {
                  window.open(
                    sanitizeWaveUrlBasedOnDevice(instructions.redirectUrl),
                    "_blank"
                  );
                }
              }}
              className="w-full py-2 mb-4 bg-brand-button text-white rounded-brand text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              Payer maintenant
            </motion.button>
          )}

          {orderDetails && (
            <div className="border-t pt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CreditCard className="h-4 w-4 text-xs" />
                  Paiement par{" "}
                  <span className="font-bold text-brand-red">
                    {orderDetails.paymentMethod}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4 text-xs" />
                  <span>+225 {orderDetails.tel}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Info className="h-10 w-10 text-brand-red text-xs" />
                  <span className="text-xs font-medium text-gray-900">
                    Une fois votre paiement confirmé par l’opérateur, vous
                    recevrez un SMS de confirmation.
                  </span>
                </div>
              </div>
            </div>
          )}
          <div className="text-xs text-gray-600 text-center mt-2">
            Si après 24H, vous n’avez toujours pas reçu votre ticket, veuillez
            contacter le service client au +225 07 59 94 94 94
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

