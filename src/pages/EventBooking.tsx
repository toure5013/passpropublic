import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Calendar, MapPin, Clock, Users, Share2 } from "lucide-react";
import TicketSelector from "../components/Booking/TicketSelector";
import { useEventStore } from "../store/eventStore";
import { motion } from "framer-motion";
import { configService } from "../providers/configService";
import { MyCustomEvent } from "../utils/eventtypes";

export default function EventBooking() {
  const { id } = useParams();
  const { getEventById } = useEventStore();
  const [event, setEvent] = React.useState<MyCustomEvent>({} as MyCustomEvent);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);

  async function getEventByIdAsync(id: number) {
    setIsLoading(true);
    const _event:MyCustomEvent = await getEventById(+id);
    /*
    {
  "id": 120,
  "event_name": "1XEVENTTEST",
  "event_enterprise_name": "SD",
  "event_type_id": 1,
  "description": null,
  "event_ticket_img": "/event_cover/1XEVENTTEST_cover_2024_10_27_16_27_12.jpg",
  "event_date": "2024-12-30",
  "event_cover": "/event_cover/1XEVENTTEST_cover_2024_10_27_16_27_12.jpg",
  "event_hour": "16:00",
  "event_place_id": 4,
  "event_localization": "Palais de la culture",
  "event_commune": "Treichville",
  "event_room": "Salle Anoumabo",
  "event_room_capacity": "4000",
  "event_longitude": "5.2871032",
  "event_latitude": "-3.9776399",
  "payment_online": "true",
  "payment_on_delivery": "false",
  "ticket_physic": "false",
  "ticket_virtual": "true",
  "observation": null,
  "recommandation": null,
  "status": 1,
  "created_at": "2024-10-25T18:38:33.000000Z",
  "updated_at": "2024-10-27T16:27:12.000000Z",
  "ticket_prices": [
    {
      "id": 185,
      "event_id": 120,
      "price_label": "pauvre",
      "price": 100
    },
    {
      "id": 181,
      "event_id": 120,
      "price_label": "PASS",
      "price": 200
    },
    {
      "id": 182,
      "event_id": 120,
      "price_label": "VIP",
      "price": 300
    },
    {
      "id": 183,
      "event_id": 120,
      "price_label": "VVIP",
      "price": 500
    }
  ],
  "event_type": {
    "id": 1,
    "name": "Concert"
  },
  "event_place": {
    "id": 4,
    "district_id": 9,
    "place": "Palais de la culture",
    "description": null,
    "longitude": "5.2871032",
    "latitude": "-3.9776399",
    "map_link": "https://www.google.com/maps/dir//palais+de+la+culture/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0xfc1ebc3ed8a44d1:0x75aed55330be96b9?sa=X&ved=2ahUKEwiosLGV8Kz9AhX6SfEDHWSuDw0Q9Rd6BQiAARAE",
    "created_at": "2023-02-24T00:14:51.000000Z",
    "updated_at": "2023-03-05T18:28:23.000000Z"
  }
}
    
    */
    console.log(_event);
    setEvent(_event);
  }

  //if current event is null redirect to home
  useEffect(() => {
    if (id) {
      console.log(+id);
      getEventByIdAsync(+id);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      console.log(+id);
      getEventByIdAsync(+id);
    }
  }, []);

  const handleAddToCart = (selections: Record<string, number>) => {
    // Ajouter au panier
    console.log("Sélections:", selections);
  };

  
  return (
    <>
      {event ? (
        <div className="pt-4 sm:pt-6 pb-20">
          <div className="max-w-lg mx-auto px-3 sm:px-4">
            {/* Image et informations de l'événement */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
              <div className="relative h-48 sm:h-64">
                <img
                  src={configService.baseUrlImage + event.event_ticket_img}
                  alt={event.event_name}
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-2 sm:top-4 right-2 sm:right-4 p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors">
                  <Share2 className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-gray-600" />
                </button>
              </div>

              <div className="p-4">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  {event.event_name}
                </h1>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    <span className="text-sm">{event.event_date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    <span className="text-sm">{event.event_hour}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    <span className="text-sm">{event.event_place?.place}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {event.description}
                </p>
              </div>
            </div>

            {/* Sélecteur de tickets */}
          
             <TicketSelector
             event={event}
              eventId={event.id}
              eventTitle={event.event_name}
              ticketPrices={event.ticket_prices ? event.ticket_prices : []}
            /> 
          </div>
        </div>
      ) : (
        <div className="w-full h-screen flex flex-col justify-center items-center">
          <div>Event pas trouvé </div>
          {/*  */}
          <div className="flex items-center justify-between">
            <motion.button
              className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-brand-button rounded-brand text-[10px] sm:text-xs font-medium text-white hover:opacity-90 transition-opacity"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
            >
              Revenir à l'accueil
            </motion.button>
          </div>
        </div>
      )}
    </>
  );
}
