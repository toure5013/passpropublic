import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PaymentMethod from "../components/Checkout/PaymentMethod";
import { useCartStore } from "../store/cartStore";
import UserService from "../providers/userServices";
import { toast } from "react-toastify";
import useAuthStore from "../store/loginStore";
import CartTimer from "../components/CartTimer";
import TicketOwnerInfo from "../components/Checkout/TicketOwnerInfo";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Smartphone } from "lucide-react";
import CodeInput from "../components/CodeInput";

type CheckoutStep = "personal-info" | "payment";

interface TicketOwnerInfoType {
  name: string;
  surname: string;
  tel: string;
  birth_date?: string;
}

export default function Checkout() {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("personal-info");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { getFinalTotal } = useCartStore();
  // OTP
  const [otpSent, setOtpSent] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const isOtpComplete = code.every((digit) => digit !== "");
  const { login, updateUserInfo, isLoggedIn, userInfo } = useAuthStore();
  const [ticketOwnerInfo, setTicketOwnerInfo] = useState(
    userInfo ? userInfo : {}
  );
  const handleTicketOwnerInfoSubmit = async (
    tickerOwnerInfo: TicketOwnerInfoType
  ) => {
    setTicketOwnerInfo({
      tel: tickerOwnerInfo.tel,
      name: tickerOwnerInfo.name,
      surname: tickerOwnerInfo.surname,
    });

    // is not logged in
    if (!isLoggedIn) {
      setShowConfirmation(true);
      return;
    }

    setCurrentStep("payment");
  };

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
        // toast.success(response.message);
        toast.success("Code otp envoyé par sms avec succès !");
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
        setShowConfirmation(false);

        //change by payment screen
        setCurrentStep("payment");
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

  useEffect(() => {
    if (!isLoggedIn) {
      //remove user info from local storage
      localStorage.removeItem("user_tel");
      localStorage.removeItem("user_uuid");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_surname");
      localStorage.removeItem("user");
      localStorage.removeItem("user_info");
      localStorage.removeItem("user_wallet");
      updateUserInfo({});
    }
  }, []);

  return (
    <div className="pt-4 sm:pt-6 pb-20">
      <div className="max-w-lg mx-auto px-3 sm:px-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">
              Finaliser votre commande
            </h1>
            <CartTimer onExpire={() => navigate("/cart")} />
          </div>

          {
            currentStep === "personal-info" ? (
              <TicketOwnerInfo
                initialValues={ticketOwnerInfo}
                onSubmit={handleTicketOwnerInfoSubmit}
                isLoggedIn={isLoggedIn}
                isLoading={isLoading}
              />
            ) : currentStep === "payment" ? (
              <PaymentMethod
                payment_number={
                  ticketOwnerInfo.tel ? ticketOwnerInfo.tel : userInfo.tel
                }
                ticketOwnerInfo={ticketOwnerInfo ? ticketOwnerInfo : userInfo}
                amount={getFinalTotal()} // À remplacer par le montant réel du panier
              />
            ) : null //ADD OTP SCREEN
          }
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
                  disabled={isLoading}
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleVerifyOtp()}
                  disabled={!isOtpComplete || isLoading}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-brand-button rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirmer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
