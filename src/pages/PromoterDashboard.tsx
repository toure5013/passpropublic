import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader } from "lucide-react";
import BackButton from "../components/BackButton";
import EventCardPromoter from "../components/PromoterDashboard/EventCardPromoter";
import DashboardMenu from "../components/PromoterDashboard/DashboardMenu";
import SalesStats from "../components/PromoterDashboard/SalesStats";
import SellerDetails from "../components/PromoterDashboard/SellerDetails";
import SalesHistory from "../components/PromoterDashboard/SalesHistory";
import { useEventStore } from "../store/eventStore";
import EventService from "../providers/eventService";
import { PromoterStatsType } from "../utils/promotertypes";
import useAuthStore from "../store/loginStore";
import { useNavigate } from "react-router-dom";
import PromoterEventService from "../providers/promoters/promoterEventService";
import { toast } from "react-toastify";

// Mock data

export default function PromoterDashboard() {
  const [selectedEvent, setSelectedEvent] = useState<PromoterStatsType>(
    {} as PromoterStatsType
  );
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAddSellerForm, setShowAddSellerForm] = useState(false);
  const [newSeller, setNewSeller] = useState({ name: "", quota: "" });
  const [events, setEvents] = useState<any[]>([]);
  const [eventStats, setEventStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { updateEvent } = useEventStore();
  const navigate = useNavigate();

  const { login, updateUserInfo, logout, userInfo, isLoggedIn } =
  useAuthStore();
  
  const getEventsStats = async () => {
    setIsLoading(true); // Show loading state

    const userUuid = userInfo.user_uuid || localStorage.getItem("user_uuid");
    try {
      const response = await PromoterEventService.getStatEvents(userUuid);

      if (response.status === 200) {
        const data = response.data.data;

        if (data) {
          localStorage.setItem(
            "eventStats",
            JSON.stringify(response.data.data || [])
          );
          setEventStats(response.data.data || []);
        }
      } else {
        toast.error("Failed to load event types");
      }
    } catch (error) {
      toast.error("An error occurred while fetching event types");
      console.error(error);
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };

  const getAllEventsAsync = async () => {
    setIsLoading(true); // Show loading state

    try {
      const response = await EventService.getAllEvents();

      if (response.status === 200) {
        localStorage.setItem("allEvents", JSON.stringify(response.data || []));
        updateEvent(response.data || []);
        setEvents(response.data || []);
      } else {
        toast.error("Failed to load event types");
      }
    } catch (error) {
      toast.error("An error occurred while fetching event types");
      console.error(error);
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };

  const handleEventSelect = (event: PromoterStatsType) => {
    setSelectedEvent(event);
    setSelectedOption(null);
  };

  const handleBackToEvents = () => {
    setSelectedEvent({} as PromoterStatsType);
    setSelectedOption(null);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleAddSeller = () => {
    setShowAddSellerForm(true);
  };

  const handleCancelAddSeller = () => {
    setShowAddSellerForm(false);
    setNewSeller({ name: "", quota: "" });
  };

  const handleSubmitAddSeller = () => {
    // Logique d'ajout du vendeur
    console.log("Nouveau vendeur:", newSeller);
    setShowAddSellerForm(false);
    setNewSeller({ name: "", quota: "" });
  };

  const handleNewSellerChange = (field: "name" | "quota", value: string) => {
    setNewSeller({ ...newSeller, [field]: value });
  };

  const renderEventList = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-900">Mes événements</h1>
        <motion.a
          href="/devenir-promoteur"
          className="px-4 py-2 bg-brand-button rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Nouvel événement
          <ArrowRight className="h-4 w-4" />
        </motion.a>
      </div>

      <div className="space-y-4">
        {eventStats.map((event, index) => (
          <EventCardPromoter
            key={event.id + "index" + index}
            event={event}
            onClick={() => handleEventSelect(event)}
          />
        ))}
      </div>
    </motion.div>
  );

  const renderEventContent = () => {
    if (!selectedEvent) return null;

    const mockCategories = {
      Standard: { sold: 300, price: 5000 },
      VIP: { sold: 100, price: 15000 },
      Premium: { sold: 50, price: 25000 },
    };

    const mockSellers = [
      { id: "1", name: "John Doe", quota: 200, sold: 150 },
      { id: "2", name: "Jane Smith", quota: 300, sold: 200 },
      { id: "3", name: "Bob Johnson", quota: 150, sold: 100 },
    ];

    const mockSales = [
      {
        id: "1",
        date: "2024-01-15",
        seller: "John Doe",
        category: "Standard",
        quantity: 2,
        unitPrice: 5000,
        total: 10000,
      },
    ];

    if (selectedOption === "stats") {
      return (
        <div className="space-y-6">
          <SalesStats
            entrances={350}
            totalSold={selectedEvent.total_amount}
            totalRevenue={7500000}
          />
          {/* <CategorySales
            categories={selectedEvent.ticket_price_info}
            totalTickets={selectedEvent.totalTickets}
          /> */}
        </div>
      );
    }

    if (selectedOption === "sellers") {
      return (
        <SellerDetails
          sellers={mockSellers}
          onAddSeller={handleAddSeller}
          showAddForm={showAddSellerForm}
          onCancelAdd={handleCancelAddSeller}
          onSubmitAdd={handleSubmitAddSeller}
          newSeller={newSeller}
          onNewSellerChange={handleNewSellerChange}
        />
      );
    }

    if (selectedOption === "sales") {
      return (
        <SalesHistory
          sales={mockSales}
          categories={mockCategories}
          sellers={mockSellers}
        />
      );
    }

    return (
      <DashboardMenu
        onSelect={handleOptionSelect}
        selectedOption={selectedOption || ""}
      />
    );
  };

  useEffect(() => {
    if(!isLoggedIn){
      navigate("/home")
    }else {
      getEventsStats();
    }
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="max-w-lg mx-auto px-3 sm:px-4">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 text-center">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                Chargement des stats
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
      ) : (
        <div className="pt-4 sm:pt-6 pb-6">
          <div className="max-w-lg mx-auto px-3 sm:px-4">
            {selectedEvent && selectedEvent.event ? (
              <div>
                {selectedEvent && <BackButton onClick={handleBackToEvents} />}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <h1 className="text-xl font-bold text-gray-900 mb-2">
                      {selectedEvent.event.event_name +
                        "--------" +
                        selectedEvent.event.id}
                    </h1>
                    <p className="text-sm text-gray-600">
                      {selectedEvent.event.event_date} •{" "}
                      {selectedEvent.event.event_localization}
                    </p>
                  </div>
                  {renderEventContent()}
                </motion.div>
              </div>
            ) : (
              renderEventList()
            )}
          </div>
        </div>
      )}
    </>
  );
}
