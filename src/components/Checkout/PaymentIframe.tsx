import { useParams } from "react-router-dom";

export default function PaymentIframe() {
    const { sl } = useParams();

    console.log("sl");
    console.log(sl);
    

    if(!sl) {
        //go back 
        // window.history.back();
        return
    };
    
    const payementUrl = decodeURIComponent(sl);
    console.log(payementUrl);
    
    return (
        <div className="w-full h-full flex items-center justify-center">
            <iframe
                src={payementUrl}
                className="w-full h-full"
            />
            <button
                className="absolute top-5 right-5 text-gray-600 hover:text-brand-red"
                onClick={() => window.history.back()}
            >
                Retour
            </button>
        </div>
    );
}