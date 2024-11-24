import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Calendar,
  Users,
  TrendingUp,
  ArrowRight,
  Shield,
  CreditCard,
  Smartphone,
  Clock,
  Sparkles,
  Loader,
} from "lucide-react";
import { Link } from "react-router-dom";
import EventCard from "../components/EventCard";
import EventService from "../providers/eventService";
import TicketService from "../providers/ticketService";
import { useEventStore } from "../store/eventStore";

// Fixed data
const features = [
  {
    icon: <Calendar className="h-6 w-6" />,
    title: "Gestion simplifiée",
    description: "Gérez vos événements et vos billets en quelques clics",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Large audience",
    description: "Touchez des milliers de participants potentiels",
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Analyses détaillées",
    description: "Suivez vos ventes en temps réel",
  },
];

const advantages = [
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Paiement sécurisé",
    description: "Transactions cryptées et sécurisées",
  },
  {
    icon: <CreditCard className="h-8 w-8" />,
    title: "Plusieurs moyens de paiement",
    description: "Carte bancaire, mobile money",
  },
  {
    icon: <Smartphone className="h-8 w-8" />,
    title: "E-ticket instantané",
    description: "Recevez vos billets sur votre mobile",
  },
  {
    icon: <Clock className="h-8 w-8" />,
    title: "Service 24/7",
    description: "Support client disponible à tout moment",
  },
];

export default function Home() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const [events, setEvents] = useState<any[]>([]);
  const [eventTypes, setEventTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { updateEvent} = useEventStore();

  // Filtrer les événements tendances
  const trendingEvents = events.filter((event) => event.trending);

  //API CALLS
  // Function to search events based on the search key
  const searchEvents = async (event_type_name: string) => {
    setIsLoading(true); // Show loading state

    try {
      const response: any = await EventService.searchEvents(event_type_name);

      if (response.status === 200) {
        console.log("event_type_name");
        console.log(event_type_name);
        console.log(response?.events?.items || []);
        setEvents(response?.events?.items || []);
      } else {
        setError("Failed to load events");
      }
    } catch (error) {
      setError("An error occurred while fetching events");
      console.error(error);
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };

  // Function to get event types and the first set of events
  const getEventTypesWithFirstEvents = async () => {
    setIsLoading(true); // Show loading state

    try {
      const response = await TicketService.getEventTypesWithFirstEvents();

      if (response.status === 200) {
        const data = response.data.data;

        console.log("data");
        console.log(data);

        if (data) {
          localStorage.setItem("eventTypes", JSON.stringify(data.type_evenements));
          localStorage.setItem("allEvents", JSON.stringify(data.events?.items || []));
          setEventTypes([{ id: 0, name: "Tous" }, ...data.type_evenements]);
          updateEvent(data.events?.items || []);
          setEvents(data.events?.items || []);
        }
      } else {
        setError("Failed to load event types");
      }
    } catch (error) {
      setError("An error occurred while fetching event types");
      console.error(error);
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };

  // Function to get events by event type ID
  const getEventByTypeId = async (id?: number) => {
    setIsLoading(true); // Show loading state

    try {
      const response = await EventService.getEventByTypeId(id);

      if (response.status === 200) {
        console.log("response.data events");
        console.log(events);
        setEvents(response.data); // Set the event data if successful
        console.log(events);
      } else {
        setError("Failed to load events");
      }
    } catch (error) {
      setError("An error occurred while fetching events");
      console.error(error);
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };

  // Optionally, call the API when the component mounts
  useEffect(() => {
    getEventTypesWithFirstEvents(); // Call to get event types and first events
  }, []); // Empty array ensures it only runs on component mount

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end text-white py-6 sm:py-8 px-3 sm:px-4">
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold mb-2">
            Leader de la billeterie en Afrique de l'ouest
          </h1>
          <p className="text-white/90 mb-4 sm:mb-6 text-xs sm:text-sm">
            Découvrez et réservez les meilleurs événements en Côte d'Ivoire
          </p>

          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className={`absolute inset-0 bg-white rounded-xl transition-all duration-300 ${
                searchFocused ? "shadow-lg scale-105" : "shadow-md"
              }`}
              animate={{
                scale: searchFocused ? 1.02 : 1,
              }}
            />
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Rechercher un événement..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full h-12 rounded-xl text-gray-900 placeholder-gray-500 relative z-10 bg-transparent border-2 border-transparent focus:border-brand-yellow/30 transition-all duration-300 outline-none text-base pl-6 pr-16"
              />
              <motion.div
                className="absolute right-6 text-gray-400 z-20 pointer-events-none"
                animate={{
                  scale: searchFocused ? 1.1 : 1,
                  color: searchFocused ? "#FF8A00" : "#9CA3AF",
                }}
              >
                <Search className="h-5 w-5" />
              </motion.div>
            </div>

            <AnimatePresence>
              {searchValue && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-30 p-2"
                >
                  <div className="text-gray-600 text-sm p-2">
                    Recherche en cours pour : {searchValue}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* eventTypes  */}
        <div className="flex overflow-x-auto gap-2 sm:gap-3 pb-3 sm:pb-4 mb-4 sm:mb-6 scrollbar-hide -mx-3 px-3">
          {eventTypes.map((category: any) => (
            <motion.button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.name);
                if (category.name !== "Tout" && category.name !== "Tous") {
                  getEventByTypeId(category.id);
                } else {
                  getEventTypesWithFirstEvents();
                }
              }}
              className={`h-9 sm:h-10 px-4 sm:px-5 rounded-full whitespace-nowrap text-xs sm:text-sm font-medium transition-all duration-300 relative overflow-hidden flex items-center justify-center min-w-[80px] ${
                selectedCategory === category.name
                  ? "text-white shadow-lg"
                  : "text-gray-700 bg-white shadow-sm hover:shadow-md"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">{category.name}</span>
              {selectedCategory === category.name && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end opacity-0 hover:opacity-100 transition-opacity"
                style={{ opacity: selectedCategory === category.name ? 1 : 0 }}
              />
            </motion.button>
          ))}
        </div>

        {/* Events Grid ==> Liste des événements par catégori */}
        {isLoading ? (
          //CENTER ISLAODING
          <div className="w-full flex items-center justify-center">
            <Loader color="#FF8A00" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-8">
            {events.length > 0 ? (
              events.map((event) => (
                <EventCard key={event.id} {...event} className="w-full" />
              ))
            ) : (
              <p className="col-span-2 text-center text-gray-600">
                Aucun événement trouvé
              </p>
            )}
          </div>
        )}

        {/* Trending Events Section ==> Evènement tendances */}
        {trendingEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Événements tendances
              </h2>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex items-center gap-1 text-brand-red"
              >
                <Sparkles className="h-4 w-4" />
              </motion.div>
            </div>

            <div className="space-y-3">
              {trendingEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <EventCard {...event} className="w-full" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Promoter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6 text-center mb-8"
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Vous organisez des événements ?
            </h2>
            <p className="text-sm text-gray-600">
              Rejoignez PassPro Business et bénéficiez d'une solution complète
              pour la gestion de vos événements
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-brand-red mb-2 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <Link
            to="/devenir-promoteur"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-button text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Devenir promoteur
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Advantages Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-8">
            Pourquoi choisir PassPro ?
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {advantages.map((advantage, index) => (
              <motion.div
                key={advantage.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="mx-auto w-12 h-12 rounded-full bg-brand-yellow/10 flex items-center justify-center text-brand-red mb-3">
                  {advantage.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {advantage.title}
                </h3>
                <p className="text-sm text-gray-600">{advantage.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
