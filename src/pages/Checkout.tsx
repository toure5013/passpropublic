import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonalInfo from "../components/Checkout/PersonalInfo";
import PaymentMethod from "../components/Checkout/PaymentMethod";
import { useCartStore } from "../store/cartStore";
import UserService from "../providers/userServices";
import { toast } from "react-toastify";

type CheckoutStep = "personal-info" | "payment";

export default function Checkout() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("personal-info");
  const [isLoading, setIsLoading] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    surname: "",
    phone: "",
  });
  const {
    // items,
    // getTotal,
    getFinalTotal,
  } = useCartStore();

  const createUser = async (personalInfo: any) => {
    setIsLoading(true);

    try {
      const response = await UserService.register(personalInfo);
      if (response.success) {
        toast.success("Compte initié avec succès");
        setPersonalInfo(personalInfo);
        setIsLoading(true);
        setCurrentStep("payment");
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
  const handlePersonalInfoSubmit = async (info: typeof personalInfo) => {
    setIsLoading(true);
    try {
      const response: any = await UserService.searchUserByPhoneNumber(
        info.phone
      );

      console.log(response);

      if (response.success) {
        // user exists, set userinfo in the state
        const userInfo = response.user;
        setPersonalInfo(userInfo);
        setIsLoading(false);
        setCurrentStep("payment");
      } else {
        if (`${response.message}`.includes("n'existe pas")) {
          toast.info(
            "Merci de patienter. Encore une étape de vérification et nous passons au paiement. "
          );
          setIsLoading(false);

          // create user account
          await createUser({
            ...info,
            name: info.name,
            surname: info.surname,
            tel: info.phone,
            birth_date: "1995-01-26",
            c_password: `${new Date().toISOString()}`,
            password: `${new Date().toISOString()}`,
            sponsor_code: "",
            district_id: 2,
          });
          setIsLoading(false);
        }else {
          setIsLoading(false);
          toast.error(response.message);
        }
      }
    } catch (error: any) {
      console.log(error);
      if (`${error.message}`.includes("n'existe pas")) {
        toast.info(
          "Merci de patienter. Encore une étape de vérification et nous passons au paiement. "
        );
        // create user account
        await createUser(info);
      } else {
        setIsLoading(false);
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="pt-4 sm:pt-6 pb-20">
      <div className="max-w-lg mx-auto px-3 sm:px-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h1 className="text-xl font-bold text-gray-900 mb-6">
            Finaliser votre commande
          </h1>

          {currentStep === "personal-info" ? (
            <PersonalInfo
              initialValues={personalInfo}
              onSubmit={handlePersonalInfoSubmit}
              isLoading = {isLoading}
            />
          ) : (
            <PaymentMethod
              userInfo={personalInfo}
              amount={getFinalTotal()} // À remplacer par le montant réel du panier
            />
          )}
        </div>
      </div>
    </div>
  );
}
