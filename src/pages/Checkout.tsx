import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PaymentMethod from "../components/Checkout/PaymentMethod";
import { useCartStore } from "../store/cartStore";
import UserService from "../providers/userServices";
import { toast } from "react-toastify";
import useAuthStore from "../store/loginStore";
import CartTimer from "../components/CartTimer";
import TicketOwnerInfo from "../components/Checkout/TicketOwnerInfo";

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
  const { updateUserInfo, userInfo } = useAuthStore();
  const [ticketOwnerInfo, setTicketOwnerInfo] = useState(
    userInfo ? userInfo : {}
  );
  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();

  const { getFinalTotal } = useCartStore();

  const createUser = async (ticketOwnerInfo: any) => {
    setIsLoading(true);

    try {
      const response: any = await UserService.register(ticketOwnerInfo);
      if (response.success) {
        toast.success("Compte initié avec succès");
        const userInfo = response.user;
        userInfo.userType = "public";

        updateUserInfo(userInfo);
        setTicketOwnerInfo(userInfo);
        setIsLoading(true);
      } else {
        setIsLoading(true);
        toast.error(response.message);
      }
    } catch (error: any) {
      console.log(error);
      setIsLoading(true);
      toast.error(error.message);
    }
  };

  const handleTicketOwnerInfoSubmit = async (
    tickerOwnerInfo: TicketOwnerInfoType
  ) => {
    // change screen
    setTicketOwnerInfo({
      tel: tickerOwnerInfo.tel,
      name: tickerOwnerInfo.name,
      surname: tickerOwnerInfo.surname,
    });
    setCurrentStep("payment");
    return;
  };

  const searchUserByPhoneAndCreate = async (
    tickerOwnerInfo: TicketOwnerInfoType
  ) => {
    try {
      const response: any = await UserService.searchUserByPhoneNumber(
        tickerOwnerInfo.tel
      );

      console.log(response);

      if (response.success) {
        // user exists, set userinfo in the state
        const userInfo = response.user;
        userInfo.userType = "public";

        // Store user data in localStorage
        localStorage.setItem("user_tel", userInfo.tel);
        localStorage.setItem("user_uuid", userInfo.uuid);
        localStorage.setItem("user_name", userInfo.name);
        localStorage.setItem("user_surname", userInfo.surname);
        localStorage.setItem("user_info", JSON.stringify(userInfo));
        localStorage.setItem("type", userInfo.type);
        localStorage.setItem("userType", userInfo.userType);

        // update state
        updateUserInfo(userInfo);
        setTicketOwnerInfo(userInfo);
        setIsLoading(false);

        // change screen
        setCurrentStep("payment");
      } else {
        if (`${response.message}`.includes("n'existe pas")) {
          // create user account
          await createUser({
            name: tickerOwnerInfo.name,
            surname: tickerOwnerInfo.surname,
            tel: tickerOwnerInfo.tel,
            birth_date: tickerOwnerInfo.birth_date
              ? tickerOwnerInfo.birth_date
              : "1995-01-26",
            c_password: `123456`,
            password: `123456`,
            sponsor_code: "",
            district_id: 1,
          });

          setCurrentStep("payment");
          setIsLoading(false);
        } else {
          setIsLoading(false);
          toast.error(response.message);
        }
      }
    } catch (error: any) {
      console.log(error);
      setIsLoading(false);
      toast.error(error.message);
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
    </div>
  );
}
