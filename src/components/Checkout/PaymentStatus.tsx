import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function PaymentStatus() {
    const {trid} = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        if (!trid) {
            toast.error("Nous avons pas reçu vos informations de paiement. Veuillez recommencer.");
            navigate("/");
            return;
        }
    }, []);

    useEffect(() => {
        if (!trid) {
            toast.error("Nous avons pas reçu vos informations de paiement. Veuillez recommencer.");
            navigate("/");
            return;
        }
    }, [trid]);

    function checkTransactionStatus() {
        const transactionId = trid;
        if (!transactionId) {
            toast.error("Nous avons pas reçu vos informations de paiement. Veuillez recommencer.");
            navigate("/");
            return;
        }
    }

    return (
        <div className="w-full h-full flex items-center justify-center">
            <h1 className="text-2xl font-bold text-gray-900">Paiement en cours...</h1>
        </div>
    );
}