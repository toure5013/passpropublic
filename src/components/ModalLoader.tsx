import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function ModalLoader({
  title,
  description,
  bottom_message = "",
  orderDetails,
  isprocessing = true,
}: any) {
  const staticConfig = {
    icon: <Loader2 className="h-12 w-12 text-brand-red" />,
    text: `En attente de paiement`,
    bgColor: "bg-brand-yellow/10",
    textColor: "text-brand-red",
  };

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
          className={`w-24 h-24 ${staticConfig.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}
        >
          {isprocessing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {staticConfig.icon}
            </motion.div>
          ) : (
            staticConfig.icon
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2
            className={`text-sm font-semibold ${staticConfig.textColor} text-center mb-2`}
          >
            {title}
          </h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            {description}
          </p>

          {orderDetails && (
            <div className="border-t pt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="h-4 w-4">💳</span>{" "}
                  {/* Replace with an icon */}
                  Paiement par{" "}
                  <span className="font-bold text-brand-red">
                    {orderDetails.paymentMethod}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="h-4 w-4">📞</span>{" "}
                  {/* Replace with an icon */}
                  <span>+225 {orderDetails.tel}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="h-4 w-4">ℹ️</span>{" "}
                  {/* Replace with an icon */}
                  <span className="text-xs font-medium text-gray-900">
                    Une fois votre paiement confirmé par l’opérateur, vous
                    recevrez un SMS de confirmation.
                  </span>
                </div>
              </div>
            </div>
          )}


          <hr className="my-3" />
          
          <div className="text-xs text-gray-600 text-center mt-2">
            {bottom_message}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
