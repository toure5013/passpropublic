import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import TicketService from "../../providers/ticketService";
import useAuthStore from "../../store/loginStore";
import PaiementService from "../../providers/paiementService";
import { AnimatePresence, motion } from "framer-motion";
import PaymentLoader from "../PaymentLoader";
import ModalLoader from "../ModalLoader";

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
  const [errorMessage, setErrorMessage] = useState("");
  const [attemptCount, setAttemptCount] = useState(0); // Track the number of attempts
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { userInfo } = useAuthStore();
  const [items, setItems] = useState<any>([]);
  const [transactionLocalInformation, setTransactionLocalInformation] =
    useState({} as any);
  const [externalTransactionId, setExternalTransactionId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<
    "processing" | "success" | "error" | "ticketgeneration" | null
  >(null);

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
            nom: items[i].ticketOwnerInfo.name
              ? items[i].ticketOwnerInfo.name
              : userInfo.name,
            prenoms: items[i].ticketOwnerInfo.surname
              ? items[i].ticketOwnerInfo.surname
              : userInfo.surname,
            tel: items[i].ticketOwnerInfo.tel
              ? items[i].ticketOwnerInfo.tel
              : userInfo.tel,
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

  async function orderCheckerTimer(interval = 5000) {
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

      if (
        paymentData.status === "SUCCESS" ||
        paymentData.status === "SUCCESSFUL" || paymentData.status === "PAID"
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

        // Generate tickets
        await buyTickets();

        // CHANGE CART REMOTE STATUS

        try {
          const deleteCartResponse = await TicketService.deleteCartItem(
            paymentData.raw_data[0].user_tel,
            paymentData.raw_data[0].id
          );
          console.log(deleteCartResponse);
          
        } catch (error) {
          console.error("Error deleting cart item:", error);
          toast.error(
            "Une erreur est survenue lors de la suppression de l'article du panier."
          );
        }

        // Navigate to success page
        setPaymentStatus("success");
        navigate("/paiement/succes");
      } else if (
        !paymentData.status ||
        paymentData.status == "PENDING" ||
        paymentData.status == "PROCESSING"
      ) {
        setPaymentStatus("processing");
        orderCheckerTimer();
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
      toast.error(
        "Nous avons pas reçu vos informations de paiement. Veuillez recommencer."
      );
      // navigate("/");
      return;
    }
    setExternalTransactionId(`${trid}`);
    orderCheckerTimer();
  }, []);

  useEffect(() => {
    if (!trid) {
      toast.error(
        "Nous avons pas reçu vos informations de paiement. Veuillez recommencer."
      );
      // navigate("/");
      return;
    }
    setExternalTransactionId(`${trid}`);
    orderCheckerTimer();
  }, [trid, attemptCount]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <ModalLoader
        bottom_message={
          "Si après 24H, vous n’avez toujours pas reçu votre ticket, veuillez contacter le service client au +225 07 59 94 94 94"
        }
        title="Vérification du paiement"
        description="Veuillez patienter quelques instants. Pendant que nous vérifions le paiement."
      />
    </div>
  );
}
