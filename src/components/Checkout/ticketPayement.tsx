import { useState } from "react";
import useAuthStore from "../../store/loginStore";
import { useCartStore } from "../../store/cartStore";
import TicketService from "../../providers/ticketService";
import Logo from "../Logo";

const isOnlinePayment = true;
const _wantVirtuelTicket = true;

export default function TicketPayement() {
  const [isLoading, setIsLoading] = useState(false);
  const [prefs, setPrefs] = useState<any>(null);
  const { updateUserInfo, userInfo } = useAuthStore();
  const { items, getFinalTotal, removeAllItems } = useCartStore();

  const buyTicket = async () => {
    setIsLoading(true);

    try {
      const userUuid = userInfo.user_uuid || localStorage.getItem("user_uuid");

      const ticketData = {
        user_uuid: userUuid,
        nom: userInfo.name.trim(),
        prenoms: userInfo.surname.trim(),
        tel: userInfo.tel.replace(/\s/g, ""),
        event_id: items[0].eventId,
        event_ticket_price_id: items[0].price,
        is_for_me: true,
        payment_type: isOnlinePayment ? "online" : "on_delivery",
        ticket_type: _wantVirtuelTicket ? "virtual" : "physic",
        ticket_owner_info: {
          nom: userInfo.name.trim(),
          prenoms: userInfo.surname.trim(),
          tel: userInfo.tel.replace(/\s/g, ""),
        },
        delivery_information: {
          district_id: 0,
          adresse_geo: "",
        },
      };

      console.log("------>>>>>>>>> TICKET BUYING DATA START <<<<<<<<------");
      console.log(ticketData);
      console.log("------>>>>>>>>> TICKET BUYING DATA END <<<<<<<<------");

      const response = await TicketService.buyTicket(ticketData);

      if (response.data.success) {
        // remove all items from the cart
        removeAllItems();

        // redirect my ticket page
        // navigate(MyTicketsPage);
      } else {
        // handleResponseError(response.data.code, response.data.message);
      }
    } catch (error) {
      console.error("Error buying ticket:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between mb-6 border-b pb-4">
      <Logo className="h-12" />
      <div className="text-right">
        <h3 className="text-lg font-semibold text-gray-900">E-Ticket</h3>
        <p className="text-sm text-gray-500">Ticket électronique officiel</p>
      </div>
    </div>
  );
}
