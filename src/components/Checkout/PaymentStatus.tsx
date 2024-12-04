import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import TicketService from "../../providers/ticketService";
import useAuthStore from "../../store/loginStore";
import PaiementService from "../../providers/paiementService";

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
  const [isTransactionComplete, setIsTransactionComplete] = useState(false);
  const [ticketOwnerInfo, setTicketOwnerInfo] = useState({} as any);
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


  async function getOrderMetaData() {
      const response = await PaiementService.getOrderMetaDataByTransactionID(`${trid}`);
      const paymentData = response.data ? response.data : {};

      if (!paymentData) {
        return;
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

  useEffect(() => {
    if (!trid) {
      toast.error(
        "Nous avons pas reçu vos informations de paiement. Veuillez recommencer."
      );
      // navigate("/");
      return;
    }
  }, []);

  useEffect(() => {
    if (!trid) {
      toast.error(
        "Nous avons pas reçu vos informations de paiement. Veuillez recommencer."
      );
      // navigate("/");
      return;
    }

    payementStatusChecker();
    
  }, [trid]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <h1 className="text-2xl font-bold text-gray-900">Paiement en cours...</h1>
    </div>
  );
}
