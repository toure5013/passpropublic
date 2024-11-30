import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PaiementService from "../../providers/paiementService";
import { usePayementStore } from "../../store/payementStore";
import { Loader } from "lucide-react";

export default function PaymentStatus() {
  const navigate = useNavigate();

  const { externalTransactionId, deepLinkUrl } = usePayementStore();

  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");
  const [attemptCount, setAttemptCount] = useState(0); // Track the number of attempts

  const payementStatusChecker = async () => {
    // try {
      const response = await PaiementService.checkTransaction(
        `${externalTransactionId}`
      );
      const paymentData = response.data ? response.data : {};

      if(!paymentData){
        return
      }

      if (response.success) {
        if (paymentData.status === "SUCCESS") {
          navigate("/paiement/succes");
          return;
        } else if (paymentData.status === "FAIL") {
          navigate("/paiement/erreur");
          return;
        } else if (
          paymentData.status === "PENDING" ||
          paymentData.status === "PROCESSING"
        ) {
          setErrorMessage(
            "Le paiement est en cours de traitement. Veuillez patienter."
          );
        }
      } else {
        setErrorMessage(response.message || "Une erreur s'est produite.");
        if (paymentData.status === "FAIL") {
          navigate("/paiement/erreur");
          return;
        } else if (
          paymentData.status === "PENDING" ||
          paymentData.status === "PROCESSING"
        ) {
          setErrorMessage(
            "Le paiement est en cours de traitement. Veuillez confirmer si ce n'est pas fait."
          );
        }
      }
    // } catch (error) {
    //   console.log(error);
    //   console.error("Erreur lors de la vérification du paiement:", error);
    //   setErrorMessage(
    //     "En cours de vérification du paiement. Veuillez patienter."
    //   );
    // } finally {
    // }
    setLoading(false);
  };

  useEffect(() => {
    if (attemptCount < 20) {
      const timeout = setTimeout(() => {
        setAttemptCount((prev) => prev + 1);
        payementStatusChecker();
      }, 20000); // Retry every 20 seconds

      return () => clearTimeout(timeout); // Clean up timeout on component unmount
    }
  }, [attemptCount, externalTransactionId]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Paiement en cours...
        </h1>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* <div className="w-full">
        {errorMessage && (
          <h1 className="text-2xl font-semibold text-red-600">
            {errorMessage}
          </h1>
        )}
      </div> */}

      <div className="w-full h-full relative flex items-center justify-center mt-4">
        {deepLinkUrl ? (
          <>
            <iframe
              src={deepLinkUrl}
              className="w-full h-full border-none"
              title="Confirmation du paiement"
              style={{ height: "60vh" }}
            />
            <button
              className="absolute top-5 right-5 px-4 py-2 bg-gray-100 text-gray-600 rounded hover:text-brand-red hover:bg-gray-200"
              onClick={() => window.history.back()}
            >
              Retour
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              En attente du lien de confirmation...
            </h1>
          </div>
        )}
      </div>

      <div className="w-full flex items-center justify-center">
        <Loader color="#FF8A00" />
      </div>
    </div>
  );
}
