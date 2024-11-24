import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Calendar, MapPin, Clock, Users, Share2 } from "lucide-react";
import TicketSelector from "../components/Booking/TicketSelector";
import { useEventStore } from "../store/eventStore";
import { motion } from "framer-motion";


export default function EventBooking() {
  const { id } = useParams();
  const {  getEventById } = useEventStore();
  const [event, setEvent] = React.useState<any>({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);


  async function getEventByIdAsync(id: number) {
    setIsLoading(true);
    const _event =  await getEventById(+id);
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
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-2 sm:top-4 right-2 sm:right-4 p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors">
                  <Share2 className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-gray-600" />
                </button>
              </div>

              <div className="p-4">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  {event.title}
                </h1>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    <span className="text-sm">{event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {event.description}
                </p>
              </div>
            </div>

            {/* Sélecteur de tickets */}
            {/* <TicketSelector
              eventId={event.id}
              eventTitle={event.title}
              categories={event.categories}
            /> */}
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
