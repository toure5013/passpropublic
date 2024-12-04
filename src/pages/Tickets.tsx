import React, { useEffect, useState } from "react";
import { Calendar, Loader, MapPin, QrCode } from "lucide-react";
import { Link } from "react-router-dom";
import TicketService from "../providers/ticketService";
import { MyCustomTicket } from "../utils/tickettypes";
import { useTicketStore } from "../store/ticketStore";
import useAuthStore from "../store/loginStore";
import { formatDate } from "../utils/paymentUtils";

export default function Tickets() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isLoggedIn, userInfo } = useAuthStore();

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

  useEffect(() => {
    if (isLoggedIn) {
      getMyTicketsAsync(userInfo.userUuid);
    }
  }, []);

  if (isLoading === true) {
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

  if (tickets.length === 0) {
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
                    <span className="text-[10px] sm:text-xs font-medium">
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
    </div>
  );
}
