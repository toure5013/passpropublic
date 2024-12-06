import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import TicketService from "../../providers/ticketService";
import useAuthStore from "../../store/loginStore";
import PaiementService from "../../providers/paiementService";
import { AnimatePresence, motion } from "framer-motion";
import PaymentLoader from "../PaymentLoader";
import ModalLoader from "../ModalLoader";
import UserService from "../../providers/userServices";

interface PayementInstructions {
  id: string;
  deepLink?: string;
  redirectUrl?: string;
  icon: string;
  name: string;
}

export default function PaymentStatus() {
  const { trid } = useParams();
  const navigate = useNavigate();

  // payement status checker
  const [attemptCount, setAttemptCount] = useState(0); // Track the number of attempts
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  //   const { userInfo } = useAuthStore();
  const [items, setItems] = useState<any>([]);
  const [externalTransactionId, setExternalTransactionId] = useState("");
  const [ticketOwnerInfo, setTicketOwnerInfo] = useState<any>({});

  const [paymentStatus, setPaymentStatus] = useState<
    "processing" | "success" | "error" | "ticketgeneration" | null
  >(null);

  // GENERATE USET TICKET
  const buyTickets = async () => {
    for (let i = 0; i < items.length; i++) {
      try {
        const response: any = await TicketService.buyTicket({
          user_uuid: ticketOwnerInfo.uuid,
          nom: ticketOwnerInfo.name,
          prenoms: ticketOwnerInfo.surname,
          tel: ticketOwnerInfo.tel,
          event_id: items[i].id,
          event_ticket_price_id: items[i].ticketPriceId,
          is_for_me: true,
          payment_type: items[i].payment_online ? "online" : "on_delivery",
          ticket_type: items[i].ticket_virtual ? "virtual" : "physic",
          ticket_owner_info: {
            nom: ticketOwnerInfo.name,
            prenoms: ticketOwnerInfo.surname,
            tel: ticketOwnerInfo.tel,
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

  async function orderCheckerTimer(interval = 10000) {
    try {
      // Clear any existing timers to avoid duplicates
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Start a new interval
      timerRef.current = setInterval(() => {
        setAttemptCount((prev) => prev + 1);
        getOrderMetaData();
      }, interval);
    } catch (error) {
      console.log("==>>>>>>> Timer error <<<<<===");
      console.error(error);
    }
  }

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

  async function getOrderMetaData(): Promise<void> {
    try {
      const response = await PaiementService.getOrderMetaDataByTransactionID(
        `${trid}`
      );

      const paymentData = response?.data?.[0]; // Assuming `data` array exists based on your example.

      if (!paymentData) {
        toast.error(
          "Nous n'avons pas reçu vos informations de paiement. Veuillez recommencer."
        );
        return;
      }

      if (paymentData.status == "COMPLETED") {
        toast.info("Vos tickets on dejà été générés. Merci.");
        navigate("/tickets");
        return;
      }

      if (
        paymentData.status === "SUCCESS" ||
        paymentData.status === "SUCCESSFUL" ||
        paymentData.status === "PAID"
      ) {
        // Parse raw_data into JSON if it exists
        if (paymentData.raw_data) {
          try {
            paymentData.raw_data = JSON.parse(paymentData.raw_data);
          } catch (error) {
            console.error("Error parsing raw_data:", error);
            toast.error(
              "Erreur dans les données de paiement. Veuillez contacter le support."
            );
            return;
          }
        }

        // Initiate ticket generation
        setPaymentStatus("ticketgeneration");
        setItems(paymentData.raw_data || []); // Assuming raw_data contains the ticket items

        // Get uset all information by
        const ticketOwnerInfo = await getUserByPhoneNumber(
          paymentData.user_tel
        );

        setTicketOwnerInfo(ticketOwnerInfo ? ticketOwnerInfo : {});

        console.log("Ticket owner info:", ticketOwnerInfo);

        // Generate tickets
        // await buyTickets();

        // CHANGE CART REMOTE STATUS
        console.log("PAYLAOD", {
          ...paymentData,
          status: "COMPLETED",
        });

        // try {
        //   const updateCartResponse = await TicketService.updateUserCart(
        //     paymentData.user_tel,
        //     {
        //       ...paymentData,
        //       status: "COMPLETED",
        //     }
        //   );
        //   console.log("updateCartResponse", updateCartResponse);
        // } catch (error) {
        //   console.error("Error deleting cart item:", error);
        //   toast.error(
        //     "Une erreur est survenue lors de la suppression de l'article du panier."
        //   );
        // }

        // Navigate to success page
        setPaymentStatus("success");
        navigate("/paiement/succes");
      } else if (
        paymentData.status == "PENDING" ||
        paymentData.status == "PROCESSING"
      ) {
        setPaymentStatus("processing");
        console.log(
          "En cours de traitement, le panier n'est pas encore payer..."
        );

        // orderCheckerTimer();
      } else if (
        paymentData.status === "FAIL" ||
        paymentData.status === "FAILLED"
      ) {
        toast.error("Votre paiement a echoué. Veuillez recommencer.");
        navigate("/paiement/erreur");
      }
    } catch (error) {
      console.error("Error fetching payment metadata:", error);
      toast.error(
        "Une erreur est survenue lors de la récupération des informations de paiement."
      );
    }
  }

  useEffect(() => {
    if (!trid) {
    //   toast.error(
    //     "Nous avons pas reçu vos informations de paiement. Veuillez recommencer."
    //   );
      // navigate("/");
      return;
    }
    setExternalTransactionId(`${trid}`);
    // orderCheckerTimer();
  }, []);


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <ModalLoader
        bottom_message={
          "Si après 24H, vous n’avez toujours pas reçu votre ticket, veuillez contacter le service client au +225 07 59 94 94 94"
        }
        title="Vérification du paiement"
        description="Votre ticket est en cours de traitement, vous recevrez un sms de confirmation lorsque votre ticket est disponible."
      />
    </div>
  );
}
