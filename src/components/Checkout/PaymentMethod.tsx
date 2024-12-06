import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PaiementService from "../../providers/paiementService";
import { toast } from "react-toastify";
import { usePayementStore } from "../../store/payementStore";
import useAuthStore from "../../store/loginStore";
import { AnimatePresence, motion } from "framer-motion";
import { Shield } from "lucide-react";
import PaymentLoader from "../PaymentLoader";
import { useCartStore } from "../../store/cartStore";
import { configService } from "../../providers/configService";

interface PaymentMethodProps {
  amount: number;
  ticketOwnerInfo: any; //information servant à l'achat du ticket
  payment_number: string;
}

interface PaymentOption {
  id: string;
  name: string;
  icon: string;
  color: string;
}
interface PayementInstructions {
  id: string;
  deepLink?: string;
  redirectUrl?: string;
  icon: string;
  name: string;
}

const paymentOptions: PaymentOption[] = [
  // {
  //   id: "card",
  //   name: "Carte bancaire",
  //   icon: "/assets/images/payments/bank-card.png",
  //   color: "bg-blue-500",
  // },

  {
    id: "orange",
    name: "Orange Money",
    icon: "/assets/images/payments/orange.png",
    color: "bg-[#FF7900]",
  },
  {
    id: "wave",
    name: "Wave",
    icon: "/assets/images/payments/wave.png",
    color: "bg-[#1DC1EC]",
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
  ticketOwnerInfo,
  payment_number,
}: PaymentMethodProps) {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<PaymentOption>(
    {} as PaymentOption
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const { setTransaction, setTransactionAllInfo } = usePayementStore();
  const { userInfo } = useAuthStore();
  const { items } = useCartStore();
  const [paymentStatus, setPaymentStatus] = useState<
    "processing" | "success" | "error" | "ticketgeneration" | null
  >(null);

  const [instructions, setInstructions] = useState({} as PayementInstructions);

  const [transactionLocalInformation, setTransactionLocalInformation] =
    useState({} as any);

  // Payement and payement status checker
  const handlePayment = async () => {
    if (!selectedMethod || isProcessing) return;

    // Is already conneceted
    setIsProcessing(true);

    try {
      const payload = {
        user_uuid: userInfo.uuid,
        number_to_debit: payment_number,
        platform: selectedMethod.id,
        amount: amount,
        raw_data: items,
      };
      const response = await PaiementService.cashout(payload);

      console.log("payload", payload);

      console.log(response);

      if (response.success) {
        setIsProcessing(false);

        // Get the URL and transaction data
        const deepLinkUrl = response.data.data.deepLinkUrl;
        const externalTransactionId = response.data.data.externalTransactionId;
        const _be_removed_deepLinkUrl_ = response.data.data
          ._be_removed_deepLinkUrl_
          ? response.data.data._be_removed_deepLinkUrl_
          : "";
        const codeService = response.data.data.codeService;
        const plateform = selectedMethod.id;

        //  Save data to session storage
        sessionStorage.setItem("externalTransactionId", externalTransactionId);
        sessionStorage.setItem("deepLinkUrl", deepLinkUrl);
        sessionStorage.setItem("amount", amount.toString());
        sessionStorage.setItem(
          "transactionallinfo",
          JSON.stringify(response.data.data)
        );
        sessionStorage.setItem(
          "_be_removed_deepLinkUrl_",
          _be_removed_deepLinkUrl_
        );
        sessionStorage.setItem("codeService", codeService);
        sessionStorage.setItem("plateform", plateform);

        setInstructions({
          redirectUrl: _be_removed_deepLinkUrl_,
          name: plateform,
          icon: selectedMethod.icon,
          id: selectedMethod.id,
        });

        // Save payment data to the store
        setTransaction({
          externalTransactionId,
          deepLinkUrl,
          amount,
          _be_removed_deepLinkUrl_,
          codeService,
          plateform,
        });

        setTransactionLocalInformation({
          externalTransactionId,
          deepLinkUrl,
          amount,
          _be_removed_deepLinkUrl_,
          codeService,
          plateform,
          transactionId: response.data.data.transactionId,
          tel: response.data.data.tel,
        });

        const payementAsyncChecker =
          await PaiementService.checkTransactionStatusAsync(
            externalTransactionId,
            `${configService.callBackBaseUrl}/${externalTransactionId}?state=success`
          );
          console.log(payementAsyncChecker);

        setTransactionAllInfo(response.data.data);
        setIsProcessing(false);
        setPaymentStatus("processing");

        // Activate payement checker
        // payementCheckerTimer(5000);
      } else {
        setIsProcessing(false);
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(
        error.message
          ? error.message
          : "Une erreur s'est produite. Veuillez recommencer."
      );
      setIsProcessing(false);
      setPaymentStatus("error");
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
              selectedMethod.id === option.id
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
              checked={selectedMethod.id === option.id}
              onChange={() => {
                console.log("option", option);
                setSelectedMethod(option);
              }}
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
                selectedMethod.id === option.id
                  ? "border-brand-red bg-brand-red"
                  : "border-gray-300"
              }`}
            >
              {selectedMethod.id === option.id && (
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
          disabled={!selectedMethod.id || isProcessing}
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
              <div></div>
            </div>
          ) : (
            "Payer maintenant"
          )}
        </motion.button>

        <div className="mt-4 flex items-start gap-2 text-xs text-gray-500">
          <Shield className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <p>
            Paiement sécurisé et crypté. Vos informations bancaires ne sont
            jamais stockées.
          </p>
        </div>
      </div>

      {/* OTP POPUP */}
      <AnimatePresence>
        {paymentStatus && (
          <PaymentLoader
            status={paymentStatus}
            instructions={instructions}
            orderDetails={{
              amount,
              paymentMethod: selectedMethod.id || "",
              tel: ticketOwnerInfo.tel,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
