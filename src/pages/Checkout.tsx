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
  const { getFinalTotal, updateAllItemsOwnerInformation } = useCartStore();
  // OTP

  const { updateUserInfo, isLoggedIn, userInfo } = useAuthStore();
  const [ticketOwnerInfo, setTicketOwnerInfo] = useState(
    userInfo && isLoggedIn ? userInfo : {}
  );

  const handleTicketOwnerInfoSubmit = async (
    tickerOwnerInfo: TicketOwnerInfoType
  ) => {
    setIsLoading(true);
    try {
      if (!isLoggedIn || !userInfo.user_uuid) {
        await handleSendOtp(tickerOwnerInfo);
      }

      setTicketOwnerInfo({
        user_uuid: userInfo.user_uuid ? userInfo.user_uuid : userInfo.uuid,
        ...tickerOwnerInfo,
      });

      // update all cart items by adding user info
      updateAllItemsOwnerInformation(tickerOwnerInfo);
      console.log("tickerOwnerInfo >>>>>>", tickerOwnerInfo);

      // Go to payement
      setIsLoading(false);
      setCurrentStep("payment");
    } catch (error) {
      console.log("error");
      console.log(error);
      toast.error("Une erreur s'est produite. Veuillez recommencer.");
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (_tickerOwnerInfo: TicketOwnerInfoType) => {
    console.log("_tickerOwnerInfo.tel");
    console.log(_tickerOwnerInfo.tel);

    try {
      const response: any = await UserService.register(
        {
          tel: _tickerOwnerInfo.tel,
          name: _tickerOwnerInfo.name ? _tickerOwnerInfo.name : "",
          password: "123456",
          c_password: "123456",
          surname: _tickerOwnerInfo.surname ? _tickerOwnerInfo.surname : "",
        },
        false
      );

      console.log(response);

      if (response.success) {
        toast.success("Information enregistrée avec succès !");

        // Set user infos
        updateUserInfo({
          user_uuid: response.user.uuid,
          tel: ticketOwnerInfo.tel,
          name: ticketOwnerInfo.name ? ticketOwnerInfo.name : "",
          surname: ticketOwnerInfo.surname ? ticketOwnerInfo.surname : "",
        });

        setTicketOwnerInfo({
          user_uuid: response.user.uuid,
          ...ticketOwnerInfo,
        });
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

  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     // remove user info from local storage
  //     localStorage.removeItem("user_tel");
  //     localStorage.removeItem("user_uuid");
  //     localStorage.removeItem("user_name");
  //     localStorage.removeItem("user_surname");
  //     localStorage.removeItem("user");
  //     localStorage.removeItem("user_info");
  //     localStorage.removeItem("user_wallet");
  //     updateUserInfo({});
  //   }

  //   console.log(ticketOwnerInfo)
  //   console.log(userInfo)

  // }, []);

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
    </div>
  );
}
