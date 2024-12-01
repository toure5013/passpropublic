import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import PaiementService from "../../providers/paiementService";
import { usePayementStore } from "../../store/payementStore";
import { Loader } from "lucide-react";
import PaymentLoader from "../PaymentLoader";

export default function PaymentStatus() {
  const navigate = useNavigate();

  const { externalTransactionId, _be_removed_deepLinkUrl_, plateform, amount , phone} = usePayementStore();
  const [isProcessing, setIsprocessing] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [attemptCount, setAttemptCount] = useState(0); // Track the number of attempts
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Use a ref to store the timer
  const [paymentStatus, setPaymentStatus] = useState<
    "processing" | "success" | "error"
  >("processing");

  const payementStatusChecker = async () => {
    try {
      const response = await PaiementService.checkTransaction(
        `${externalTransactionId}`
      );
      const paymentData = response.data ? response.data : {};

      if (!paymentData) {
        return;
      }

      if (
        paymentData.status === "SUCCESS" ||
        paymentData.status === "SUCCESSFUL"
      ) {
        navigate("/paiement/succes");
        // initiate ticket generation
        return;
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
        console.log(
          "Le paiement est en cours de traitement. Veuillez patienter."
        );
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
      console.log(error);
      console.error("Erreur lors de la vérification du paiement:", error);
      setErrorMessage(
        "En cours de vérification du paiement. Veuillez patienter."
      );
    }
  };

  async function payementCheckerTimer( seconds = 10000) {
    setIsprocessing(true);
    // Initialize the timer
    if (attemptCount < 20) {
      timerRef.current = setTimeout(() => {
        setAttemptCount((prev) => prev + 1);
        payementStatusChecker();
      }, seconds);
    } else {
      setIsprocessing(false);
    }
  }

  // setPaymentStatus("success");

  
  useEffect(() => {
    setIsprocessing(false);
  }, [externalTransactionId]);


  // Add the visibility event listener

  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden" && timerRef.current) {
      clearTimeout(timerRef.current); // Clear the timer if the page becomes hidden
      timerRef.current = null;
    }
  };

  useEffect(() => {
    if(plateform ==="mtn" || plateform ==="moov" ){
      setInstructions("Une demande de débit de paiement a été envoyée à votre numéro de téléphone. Veuillez vérifier votre téléphone pour confirmer le paiement.");
      payementCheckerTimer();
    }else {
      setInstructions("Veuillez cliquer sur le lien suivant afin de procéder au paiement.");
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (timerRef.current) clearTimeout(timerRef.current); // Clean up the timer
    };
  }, [plateform]);


  console.log("externalTransactionId");
  console.log(externalTransactionId);
  console.log("deepLinkUrl");
  console.log(plateform);
  console.log("---------------------");

  console.log({ externalTransactionId, _be_removed_deepLinkUrl_, plateform });
  
  if (isProcessing) {
    return (
      <div className="w-full">
        <div className="w-full h-full relative flex items-center justify-center mt-4">
          <div className="flex flex-col items-center">
            <h6 className="text-lg font-semibold text-gray-900 justify-content-center text-center">
              En attente de <br /> confirmation de paiement
            </h6>
            <Loader className="animate-spin my-10" color="#FF0000" />
            <div className="max-w-lg text-center mx-10">
              <p className="text-xs">{instructions}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return (
     (
      <PaymentLoader
        status={paymentStatus}
        orderDetails={{
          amount:+`${amount}`,
          paymentMethod: plateform || "",
          tel: phone,
          // items: items,
        }}
      />
    )
  )

  return (
    <> 
      {_be_removed_deepLinkUrl_ ? (
        <div className="w-full">
          <div className="w-full h-full relative flex items-center justify-center mt-4">
            <div className="flex flex-col items-center">
              <h6 className="text-sm font-semibold text-gray-900 justify-content-center text-center ">
                Veuillez confirmer votre paiement <br /> en cliquant sur le lien
                suivant:
              </h6>
              <button
                className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity"
                onClick={() => {
                  if(_be_removed_deepLinkUrl_)
                  window.open(_be_removed_deepLinkUrl_, "_blank");
                  payementCheckerTimer()
                }}
                type="button"
              >
                Confirmer le paiement
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div className="flex flex-col items-center mt-4">
            <Loader className="animate-spin" color="#FF0000" />
            <h6 className="text-sm text-center font-semibold mt-3 text-gray-900">
              {instructions}
            </h6>
          </div>
        </div>
      )}
    </>
  );
}
