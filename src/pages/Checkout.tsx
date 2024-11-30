import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonalInfo from "../components/Checkout/PersonalInfo";
import PaymentMethod from "../components/Checkout/PaymentMethod";
import { useCartStore } from "../store/cartStore";
import UserService from "../providers/userServices";
import { toast } from "react-toastify";
import useAuthStore from "../store/loginStore";

type CheckoutStep = "personal-info" | "payment";

export default function Checkout() {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("personal-info");
  const [isLoading, setIsLoading] = useState(false);
  const { updateUserInfo, userInfo } = useAuthStore();
  const [personalInfo, setPersonalInfo] = useState(userInfo ? userInfo : {});
  const { isLoggedIn } = useAuthStore();

  const { getFinalTotal } = useCartStore();

  const createUser = async (personalInfo: any) => {
    setIsLoading(true);

    try {
      const response: any = await UserService.register(personalInfo);
      if (response.success) {
        toast.success("Compte initié avec succès");
        const userInfo = response.user;
        userInfo.userType = "public";

        updateUserInfo(userInfo);
        setPersonalInfo(userInfo);
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

  const handlePersonalInfoSubmit = async (buyerInfo: typeof personalInfo) => {
    if (isLoggedIn) {
      // change screen
      setPersonalInfo({});
      setCurrentStep("payment");
      return;
    }

    // if user not logged in
    setIsLoading(true);
    try {
      const response: any = await UserService.searchUserByPhoneNumber(
        buyerInfo.tel
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
        setPersonalInfo(userInfo);
        setIsLoading(false);

        // change screen
        setCurrentStep("payment");
      } else {
        if (`${response.message}`.includes("n'existe pas")) {
          // create user account
          await createUser({
            ...buyerInfo,
            name: buyerInfo.name,
            surname: buyerInfo.surname,
            tel: buyerInfo.tel,
            birth_date: "1995-01-26",
            c_password: `${new Date().toISOString()}`,
            password: `${new Date().toISOString()}`,
            sponsor_code: "",
            district_id: 2,
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
          <h1 className="text-xl font-bold text-gray-900 mb-6">
            Finaliser votre commande
          </h1>

          {
            currentStep === "personal-info" ? (
              <PersonalInfo
                initialValues={personalInfo}
                onSubmit={handlePersonalInfoSubmit}
                isLoading={isLoading}
              />
            ) : currentStep === "payment" ? (
              <PaymentMethod
                payment_number={personalInfo.tel}
                userInfo={personalInfo}
                amount={getFinalTotal()} // À remplacer par le montant réel du panier
              />
            ) : null //ADD OTP SCREEN
          }
        </div>
      </div>
    </div>
  );
}
