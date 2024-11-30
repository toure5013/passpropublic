import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PaiementService from "../../providers/paiementService";
import { toast } from "react-toastify";
import { usePayementStore } from "../../store/payementStore";

interface PaymentMethodProps {
  amount: number;
  userInfo: any;
  payment_number: string;
}

interface PaymentOption {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const paymentOptions: PaymentOption[] = [
  {
    id: "card",
    name: "Carte bancaire",
    icon: "/assets/images/payments/bank-card.png",
    color: "bg-blue-500",
  },
  {
    id: "wave",
    name: "Wave",
    icon: "/assets/images/payments/wave.png",
    color: "bg-[#1DC1EC]",
  },
  {
    id: "orange",
    name: "Orange Money",
    icon: "/assets/images/payments/orange.png",
    color: "bg-[#FF7900]",
  },
  {
    id: "mtn",
    name: "MTN Money",
    icon: "/assets/images/payments/mtn.png",
    color: "bg-[#FFC403]",
  },
  {
    id: "moov",
    name: "Moov Money",
    icon: "/assets/images/payments/moov.png",
    color: "bg-[#0066B3]",
  },
];

export default function PaymentMethod({
  amount,
  userInfo,
  payment_number,
}: PaymentMethodProps) {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { setTransaction } = usePayementStore();
  const { setTransactionAllInfo } = usePayementStore();

  const handlePayment = async () => {
    if (!selectedMethod || isProcessing) return;

    setIsProcessing(true);


    try {
      const response = await PaiementService.cashout({
        user_uuid: userInfo.uuid,
        number_to_debit: payment_number ? payment_number : userInfo.tel,
        platform: selectedMethod,
        amount: amount,
      });

      if (!response.success) {
        toast.error(response.message);
        setIsProcessing(false);
        return;
      }

      if (response.success) {
        console.log(response.data.data._be_removed_deepLinkUrl_);
        setIsProcessing(false);
        
        // Get the URL and transaction data
        const deepLinkUrl = response.data.data.deepLinkUrl;
        const externalTransactionId = response.data.data.externalTransactionId;
        const _be_removed_deepLinkUrl_ = response.data.data._be_removed_deepLinkUrl_ ? response.data.data._be_removed_deepLinkUrl_ : "";
        const codeService = response.data.data.codeService;
        const plateform = selectedMethod;


        //  Save data to session storage
        await sessionStorage.setItem(
          "externalTransactionId",
          externalTransactionId,
        );
        await sessionStorage.setItem("deepLinkUrl", deepLinkUrl);
        await sessionStorage.setItem("amount", amount.toString());
        await sessionStorage.setItem(
          "transactionallinfo",
          JSON.stringify(response.data.data)
        );
        await sessionStorage.setItem(
          "_be_removed_deepLinkUrl_",
          _be_removed_deepLinkUrl_
        );
        await sessionStorage.setItem("codeService", codeService);
        await sessionStorage.setItem("plateform", plateform);

        // Save payment data to the store
        setTransaction({
          externalTransactionId,
          deepLinkUrl,
          amount,
          _be_removed_deepLinkUrl_,
          codeService,
          plateform,
        });

        await setTransactionAllInfo(response.data.data);
        setIsProcessing(false);

        // Encode the deepLinkUrl and redirect
        navigate("/paiement/status");
      } else {
        setIsProcessing(false);
        toast.error(response.message);
      }
    } catch (error) {
      // console.log(error);
      setIsProcessing(false);
      toast.error("Une erreur s'est produite. Veuillez recommencer.");
      navigate("/paiement/erreur");
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Moyen de paiement
        </h2>
        <p className="text-sm text-gray-600">
          Choisissez votre moyen de paiement préféré
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {paymentOptions.map((option) => (
          <motion.label
            key={option.id}
            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedMethod === option.id
                ? "border-brand-red bg-brand-red/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={option.id}
              checked={selectedMethod === option.id}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="sr-only"
              disabled={isProcessing}
            />
            <div className="flex items-center flex-1">
              <img
                src={option.icon}
                alt={option.name}
                className="h-8 w-8 object-contain"
              />
              <span className="ml-3 text-sm font-medium text-gray-900">
                {option.name}
              </span>
            </div>
            <div
              className={`w-4 h-4 rounded-full border-2 ml-4 ${
                selectedMethod === option.id
                  ? "border-brand-red bg-brand-red"
                  : "border-gray-300"
              }`}
            >
              {selectedMethod === option.id && (
                <div className="w-2 h-2 m-0.5 rounded-full bg-white" />
              )}
            </div>
          </motion.label>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-medium text-gray-700">
            Total à payer
          </span>
          <span className="text-xl font-bold text-brand-red">
            {amount.toLocaleString()} F CFA
          </span>
        </div>

        <motion.button
          onClick={handlePayment}
          disabled={!selectedMethod || isProcessing}
          className="w-full py-3 bg-brand-button text-white rounded-brand text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <motion.div
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span className="ml-2">Traitement en cours...</span>
            </div>
          ) : (
            "Payer maintenant"
          )}
        </motion.button>

        <p className="mt-4 text-xs text-center text-gray-500">
          Paiement sécurisé et crypté
        </p>
      </div>
    </div>
  );
}
