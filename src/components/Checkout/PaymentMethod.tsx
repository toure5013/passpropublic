import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PaiementService from "../../providers/paiementService";
import { toast } from "react-toastify";
import { usePayementStore } from "../../store/payementStore";
import useAuthStore from "../../store/loginStore";
import UserService from "../../providers/userServices";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Shield, Smartphone } from "lucide-react";
import CodeInput from "../CodeInput";
import PaymentLoader from "../PaymentLoader";
import { useCartStore } from "../../store/cartStore";
import TicketService from "../../providers/ticketService";
import { a } from "framer-motion/client";

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
  description: string;
  deepLink?: string;
  redirectUrl?: string;
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
  ticketOwnerInfo,
  payment_number,
}: PaymentMethodProps) {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { setTransaction, setTransactionAllInfo, externalTransactionId } =
    usePayementStore();
  const { login, updateUserInfo, isLoggedIn, userInfo } = useAuthStore();
  const { items } = useCartStore();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "processing" | "success" | "error" | "ticketgeneration" | null
  >(null);

  // OTP
  const [otpSent, setOtpSent] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [instructions, setInstructions] = useState({} as PayementInstructions);

  const [transactionLocalInformation, setTransactionLocalInformation] =
    useState({} as any);

  // payement status checker
  const [errorMessage, setErrorMessage] = useState("");
  const [attemptCount, setAttemptCount] = useState(0); // Track the number of attempts
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Us

  const handleSendOtp = async () => {
    try {
      const response: any = await UserService.register({
        tel: ticketOwnerInfo.tel,
        name: ticketOwnerInfo.name ? ticketOwnerInfo.name : "",
        password: ticketOwnerInfo.password ? ticketOwnerInfo.password : "",
        c_password: ticketOwnerInfo.c_password
          ? ticketOwnerInfo.c_password
          : "",
        surname: ticketOwnerInfo.surname ? ticketOwnerInfo.surname : "",
      });

      if (response.success) {
        toast.success(response.message);
        setOtpSent(true);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(
        error.message
          ? error.message
          : "Une erreur s'est produite. Veuillez recommencer."
      );
    }
  };

  const handleVerifyOtp = async () => {
    if (!isOtpComplete) {
      setOtpError("Veuillez entrer le code complet");
      return;
    }

    try {
      const response: any = await UserService.login({
        login: ticketOwnerInfo.tel,
        password: code.join(""),
      });

      if (response.success && response.user) {
        const userInfo = response.user;
        userInfo.userType = "public";

        // Store user data in localStorage
        localStorage.setItem("user_tel", userInfo.tel);
        localStorage.setItem("user_uuid", userInfo.uuid);
        localStorage.setItem("user_info", JSON.stringify(userInfo));
        localStorage.setItem("type", userInfo.type);
        localStorage.setItem("userType", userInfo.userType);

        // update state
        updateUserInfo(userInfo);

        login();

        toast.success(response["message"]);
        setIsProcessing(false);
        setShowConfirmation(false);

        //init payment
        // await handlePayment();
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(
        error.message
          ? error.message
          : "Une erreur s'est produite. Veuillez recommencer."
      );
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...code];
    newOtp[index] = value;
    setCode(newOtp);
    setOtpError("");

    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const isOtpComplete = code.every((digit) => digit !== "");

  // GENERATE USET TICKET
  const buyTickets = async () => {
    for (let i = 0; i < items.length; i++) {
      try {
        const response: any = await TicketService.buyTicket({
          user_uuid: userInfo.uuid,
          nom: userInfo.name,
          prenoms: userInfo.surname,
          tel: userInfo.tel,
          event_id: items[i].eventId,
          event_ticket_price_id: items[i].ticketPriceId,
          is_for_me: true,
          payment_type: "online",
          ticket_type: "virtual",
          ticket_owner_info: {
            nom: ticketOwnerInfo.name ? ticketOwnerInfo.name : userInfo.name,
            prenoms: ticketOwnerInfo.surname
              ? ticketOwnerInfo.surname
              : userInfo.surname,
            tel: ticketOwnerInfo.tel ? ticketOwnerInfo.tel : userInfo.tel,
          },
          delivery_information: {
            district_id: 1,
            adresse_geo: "",
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

    // is not logged in
    if (!isLoggedIn) {
      setShowConfirmation(true);
      return;
    }

    // Is already conneceted
    setIsProcessing(true);
    setShowConfirmation(false);

    try {
      const response = await PaiementService.cashout({
        user_uuid: userInfo.uuid,
        number_to_debit: payment_number,
        platform: selectedMethod,
        amount: amount,
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
        const plateform = selectedMethod;

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
          description:
            plateform === "mtn" || plateform === "moov"
              ? "Une demande de débit de paiement a été envoyée à votre numéro de téléphone. Veuillez vérifier votre téléphone pour confirmer le paiement."
              : "Veuillez cliquer sur le lien suivant afin de procéder au paiement.",
          redirectUrl: _be_removed_deepLinkUrl_,
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
        payementCheckerTimer(5000);
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
    if (transactionLocalInformation && transactionLocalInformation._be_removed_deepLinkUrl_) {
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
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-sm w-full"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                  className="w-16 h-16 rounded-full bg-brand-yellow/10 flex items-center justify-center mx-auto mb-4"
                >
                  <Smartphone className="h-8 w-8 text-brand-red" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Confirmation d'identité
                </h3>

                {!otpSent ? (
                  <button
                    onClick={() => handleSendOtp()}
                    className="px-4 py-2 bg-brand-button text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Recevoir le code de confirmation
                  </button>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 mb-4">
                      Veuillez saisir le code reçu par SMS
                    </p>
                    <CodeInput
                      value={code}
                      onChange={handleOtpChange}
                      onKeyDown={handleOtpKeyDown}
                      error={otpError}
                    />
                    <button
                      onClick={() => handleSendOtp()}
                      className="text-sm text-brand-red hover:text-brand-red/80"
                    >
                      Renvoyer le code
                    </button>
                  </div>
                )}

                <div className="mt-6">
                  <div className="bg-orange-50 rounded-lg p-2 mb-6">
                    <div className="flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5 text-orange-500 flex-shrink-0" />
                      <p className="text-xs text-orange-700 truncate">
                        Accédez à vos tickets avec ce numéro
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  disabled={isProcessing}
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleVerifyOtp()}
                  disabled={!isOtpComplete || isProcessing}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-brand-button rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirmer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {paymentStatus && (
          <PaymentLoader
            status={paymentStatus}
            instructions={instructions}
            orderDetails={{
              amount,
              paymentMethod: selectedMethod || "",
              tel: ticketOwnerInfo.tel,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
