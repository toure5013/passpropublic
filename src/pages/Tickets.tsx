import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  Calendar,
  Loader,
  MapPin,
  QrCode,
  Smartphone,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import TicketService from "../providers/ticketService";
import { MyCustomTicket } from "../utils/tickettypes";
import { useTicketStore } from "../store/ticketStore";
import useAuthStore from "../store/loginStore";
import { formatDate } from "../utils/paymentUtils";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import UserService from "../providers/userServices";
import CodeInput from "../components/CodeInput";
import PaiementService from "../providers/paiementService";

export default function Tickets() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const isOtpComplete = code.every((digit) => digit !== "");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [otpSentTimer, setOtpSentTimer] = useState(0);
  const { updateUserInfo, isLoggedIn, userInfo, login } = useAuthStore();
  const [ticketOwnerInfo, setTicketOwnerInfo] = useState(
    userInfo ? userInfo : {}
  );

  const goToLogin = () => {
    // setShowConfirmation(true);
    toast.error("Veuillez vous connecter, afin de voir vos tickets");
    navigate({
      pathname: "/connexion",
      search: "?route_from=tickets",
    });
  };

  //useTicketStore
  const { updateAllTickets } = useTicketStore();

  const [tickets, setTickets] = React.useState<MyCustomTicket[]>(
    [] as MyCustomTicket[]
  );

  const getMyTicketsAsync = async (eventTypeId?: number) => {
    setIsLoading(true);

    try {
      const response = await TicketService.getMyTickets(
        `${userInfo.uuid}`,
        eventTypeId
      );

      console.log("tickets ------ ", response.data?.tickets);

      if (response.status === 200) {
        setTickets(response.data.tickets || []);
        updateAllTickets(response.data.tickets || []);
      } else {
        console.log("Alerte", response.toString(), 5); // Adjust flushMessage implementation
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      console.log("Alerte", "Une erreur est survenue", 5); // Adjust flushMessage implementation
    } finally {
      setIsLoading(false);
    }
  };

  async function getUserByPhoneNumber(phoneNumber: string): Promise<any> {
    try {
      const response: any = await UserService.searchUserByPhoneNumber(
        phoneNumber
      );

      if (response.success) {
        return response.user;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching user by phone number:", error);
      return null;
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      getMyTicketsAsync(userInfo.userUuid);
    } else {
      goToLogin();
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      getMyTicketsAsync(userInfo.userUuid);
    } else {
      goToLogin();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (otpSentTimer > 0) {
      console.log(otpSentTimer);

      const otpInterval = setInterval(() => {
        setOtpSentTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(otpInterval); // Clear the interval on unmount
    }
  }, [otpSentTimer]);

  const handleVerifyOtp = async () => {
    if (!isOtpComplete) {
      setOtpError("Veuillez entrer le code complet");
      return;
    }

    try {
      console.log("code", {
        login: ticketOwnerInfo.tel,
        password: code.join(""),
      });

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
    console.log("newOtp", newOtp);
    console.log("Code", code);

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

        //  decrease the timer here
        setOtpSentTimer(60);
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

  if (isLoading === true && showConfirmation === false) {
    return (
      <div className="pt-4 sm:pt-6">
        <div className="max-w-lg mx-auto px-3 sm:px-4">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 text-center">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
              Chargement des tickets
            </h1>
            <div className="w-full flex items-center justify-center">
              <Loader color="#FF8A00" />
            </div>
            <p className="text-gray-600 text-xs sm:text-sm mb-4">
              Veuillez patienter...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (tickets.length === 0 && showConfirmation === false) {
    return (
      <div className="pt-4 sm:pt-6">
        <div className="max-w-lg mx-auto px-3 sm:px-4">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 text-center">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
              Vous n'avez pas encore de tickets
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm mb-4">
              Vos tickets achetés apparaîtront ici.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 sm:pt-6">
      <div className="max-w-lg mx-auto px-3 sm:px-4">
        <div className="space-y-3 sm:space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-lg shadow-sm p-3 sm:p-4"
            >
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900">
                  {ticket.event.event_name}
                </h2>
                <span className="px-2 py-1 bg-brand-yellow/10 text-brand-red rounded text-[10px] sm:text-xs font-medium">
                  {ticket.event.event_type.name}
                </span>
              </div>

              <div className="space-y-2 mb-3 sm:mb-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
                  <span className="text-xs sm:text-sm">
                    {ticket.event.event_date} - {ticket.event.event_hour}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
                  <span className="text-xs sm:text-sm">
                    {ticket.event.event_localization}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
                <div>
                  <div className="flex items-center text-gray-500">
                    <QrCode className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
                    <span className="text-[10px] sm:text-xs font-medium">
                      {ticket.ticket_serial.s.substring(0, 10)}
                    </span>
                  </div>
                  <div>
                    <span className="flex items-center text-gray-500">
                      Date d’achat :{formatDate(ticket.created_at)}
                    </span>
                  </div>
                </div>

                <Link
                  to={`/tickets/${ticket.id}`}
                  className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-brand-button text-white rounded-brand text-[10px] sm:text-xs font-medium hover:opacity-90 transition-opacity"
                >
                  Voir le ticket
                </Link>
              </div>
            </div>
          ))}
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
                    {otpSent && otpSentTimer > 0 ? (
                      <p>Renvoyer le code dans {otpSentTimer} seconde(s)</p>
                    ) : (
                      <button
                        onClick={() => handleSendOtp()}
                        className="text-sm text-brand-red hover:text-brand-red/80"
                      >
                        Renvoyer le code
                      </button>
                    )}
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
