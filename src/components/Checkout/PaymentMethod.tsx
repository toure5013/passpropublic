import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PaiementService from "../../providers/paiementService";
import { toast } from "react-toastify";
import { usePayementStore } from "../../store/payementStore";
import useAuthStore from "../../store/loginStore";
import { AnimatePresence, motion } from "framer-motion";
import {  Shield } from "lucide-react";
import PaymentLoader from "../PaymentLoader";
import { useCartStore } from "../../store/cartStore";
import TicketService from "../../providers/ticketService";

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
  const { setTransaction, setTransactionAllInfo, externalTransactionId } =
    usePayementStore();
  const { userInfo } = useAuthStore();
  const { items } = useCartStore();
  const [paymentStatus, setPaymentStatus] = useState<
    "processing" | "success" | "error" | "ticketgeneration" | null
  >(null);

  const [instructions, setInstructions] = useState({} as PayementInstructions);

  const [transactionLocalInformation, setTransactionLocalInformation] =
    useState({} as any);

  // payement status checker
  const [errorMessage, setErrorMessage] = useState("");
  const [attemptCount, setAttemptCount] = useState(0); // Track the number of attempts
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // GENERATE USET TICKET
  const buyTickets = async () => {
    for (let i = 0; i < items.length; i++) {
      try {
        const response: any = await TicketService.buyTicket({
          user_uuid: userInfo.uuid,
          nom: userInfo.name,
          prenoms: userInfo.surname,
          tel: userInfo.tel,
          event_id: items[i].id,
          event_ticket_price_id: items[i].ticketPriceId,
          is_for_me: true,
          payment_type: items[i].payment_online ? "online" : "on_delivery",
          ticket_type: items[i].ticket_virtual ? "virtual" : "physic",
          ticket_owner_info: {
            nom: ticketOwnerInfo.name ? ticketOwnerInfo.name : userInfo.name,
            prenoms: ticketOwnerInfo.surname
              ? ticketOwnerInfo.surname
              : userInfo.surname,
            tel: ticketOwnerInfo.tel ? ticketOwnerInfo.tel : userInfo.tel,
          },
          delivery_information: {
            district_id: 1,
            adresse_geo: "En ligne",
          },
        });

        console.log(">>>>>>>>>> ---- CREATE TICKET response >>>>>>>>>> ---- ");
        console.log(response);

        if (response.success) {
          console.log(response.message);
        }
      } catch (error) {
        console.log(">>>>>>>>>> ---- CREATE error response >>>>>>>>>> ---- ");

        console.log(error);
      }
    }
  };

  // Payement and payement status checker
  const handlePayment = async () => {
    if (!selectedMethod || isProcessing) return;

    // Is already conneceted
    setIsProcessing(true);

    try {
      const response = await PaiementService.cashout({
        user_uuid: userInfo.uuid,
        number_to_debit: payment_number,
        platform: selectedMethod.id,
        amount: amount,
        raw_data: items,
      });

      console.log({
        user_uuid: userInfo.uuid,
        number_to_debit: payment_number,
        platform: selectedMethod.id,
        amount: amount,
        items: items,
      });

      console.log(response);

      if (!response.success) {
        toast.error(response.message);
        setIsProcessing(false);
        return;
      }

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

  const payementStatusChecker = async () => {
    console.log("TRANSACTION INFORMATIONS");

    console.log(
      `${
        transactionLocalInformation.externalTransactionId
          ? transactionLocalInformation.externalTransactionId
          : externalTransactionId
      }`
    );

    try {
      const response = await PaiementService.checkTransaction(
        `${
          transactionLocalInformation.externalTransactionId
            ? transactionLocalInformation.externalTransactionId
            : externalTransactionId
        }`
        // "19620241201201320674cc3606edda"
      );
      const paymentData = response.data ? response.data : {};

      if (!paymentData) {
        return;
      }

      if (
        paymentData.status === "SUCCESS" ||
        paymentData.status === "SUCCESSFUL"
      ) {
        // initiate ticket generation
        setPaymentStatus("ticketgeneration");
        await buyTickets();

        navigate("/paiement/succes");
      } else if (
        paymentData.status === "FAIL" ||
        paymentData.status === "FAILLED"
      ) {
        navigate("/paiement/erreur");
        return;
      } else if (
        paymentData.status === "PENDING" ||
        paymentData.status === "PROCESSING"
      ) {
        setErrorMessage(
          "Le paiement est en cours de traitement. Veuillez patienter."
        );
      } else {
        console.log("Le paiement n'est pas encore traité. Veuillez patienter.");
        setErrorMessage(
          "Le paiement n'est pas encore traité. Veuillez patienter."
        );
      }
    } catch (error) {
      console.log("=========>>>>>>> PAYEMENT ERROR <<<<<=========");
      console.log(error);
      console.error("Erreur lors de la vérification du paiement:", error);
      setErrorMessage(
        "En cours de vérification du paiement. Veuillez patienter."
      );
    }
  };

  async function payementCheckerTimer(interval = 5000) {
    console.log("interval", interval);

    try {
      // Clear any existing timers to avoid duplicates
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Start a new interval
      timerRef.current = setInterval(() => {
        setAttemptCount((prev) => prev + 1);
        if (transactionLocalInformation._be_removed_deepLinkUrl_) {
          payementStatusChecker();
        }
      }, interval);
    } catch (error) {
      console.log("==>>>>>>> Timer error <<<<<===");
      console.error(error);
    }
  }

  useEffect(() => {
    // Start the payment checker only if transaction information exists
    if (
      transactionLocalInformation &&
      transactionLocalInformation._be_removed_deepLinkUrl_
    ) {
      payementStatusChecker();
    }
  }, [transactionLocalInformation, attemptCount]); // Depend only on transactionLocalInformation

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
