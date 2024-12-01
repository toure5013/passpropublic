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
  description: string;
  deepLink?: string;
  redirectUrl?: string;
}
interface PaymentLoaderProps {
  status: "processing" | "success" | "error" | "ticketgeneration";
  message?: string;
  instructions?: PayementInstructions;
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
          text: message || "Traitement du paiement en cours...",
          bgColor: "bg-brand-yellow/10",
          textColor: "text-brand-red",
          instruction:
            "Ne fermez pas cette fenêtre pendant le traitement du paiement.",
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
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {config.icon}
            </motion.div>
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
            className={`text-lg font-semibold ${config.textColor} text-center mb-2`}
          >
            {config.text}
          </h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            {config.instruction}
          </p>

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
                  <Info className="h-4 w-4 text-brand-red" />
                  <span className="text-xs font-medium text-gray-900">
                    {instructions?.description}{" "}
                    {instructions?.redirectUrl ? (
                      <a
                        href={sanitizeWaveUrlBasedOnDevice(
                          instructions.redirectUrl
                        )}
                        target="_blank"
                        className="text-brand-red"
                      >
                        {" "}
                        cliquez ici{" "}
                      </a>
                    ) : null}
                  </span>
                </div>
              </div>
            </div>
          )}

          {status === "processing" && (
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-6">
              <motion.div
                className="h-full bg-brand-red"
                initial={{ width: "0%" }}
                animate={{
                  width: ["0%", "100%"],
                  transition: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              />
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
