import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import BackButton from '../components/BackButton';
import EventCard from '../components/PromoterDashboard/EventCard';
import DashboardMenu from '../components/PromoterDashboard/DashboardMenu';
import SalesStats from '../components/PromoterDashboard/SalesStats';
import CategorySales from '../components/PromoterDashboard/CategorySales';
import SellerDetails from '../components/PromoterDashboard/SellerDetails';
import SalesHistory from '../components/PromoterDashboard/SalesHistory';

// Mock data
const mockEvents = [
  {
    id: '1',
    title: 'DJ Arafat en concert',
    date: '31 Juillet 2024',
    location: 'Palais de la culture d\'Abidjan',
    image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14',
    totalTickets: 1000,
    soldTickets: 450,
    sellers: [
      { sold: 150 },
      { sold: 200 },
      { sold: 100 }
    ]
  },
  {
    id: '2',
    title: 'Festival des Musiques Urbaines',
    date: '15 - 16 Août 2024',
    location: 'Stade FHB, Abidjan',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
    totalTickets: 2000,
    soldTickets: 1200,
    sellers: [
      { sold: 400 },
      { sold: 500 },
      { sold: 300 }
    ]
  }
];

export default function PromoterDashboard() {
  const [selectedEvent, setSelectedEvent] = useState<typeof mockEvents[0] | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAddSellerForm, setShowAddSellerForm] = useState(false);
  const [newSeller, setNewSeller] = useState({ name: '', quota: '' });

  const handleEventSelect = (event: typeof mockEvents[0]) => {
    setSelectedEvent(event);
    setSelectedOption(null);
  };

  const handleBackToEvents = () => {
    setSelectedEvent(null);
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
    setNewSeller({ name: '', quota: '' });
  };

  const handleSubmitAddSeller = () => {
    // Logique d'ajout du vendeur
    console.log('Nouveau vendeur:', newSeller);
    setShowAddSellerForm(false);
    setNewSeller({ name: '', quota: '' });
  };

  const handleNewSellerChange = (field: 'name' | 'quota', value: string) => {
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
        {mockEvents.map((event) => (
          <EventCard
            key={event.id}
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
      'Standard': { sold: 300, price: 5000 },
      'VIP': { sold: 100, price: 15000 },
      'Premium': { sold: 50, price: 25000 }
    };

    const mockSellers = [
      { id: '1', name: 'John Doe', quota: 200, sold: 150 },
      { id: '2', name: 'Jane Smith', quota: 300, sold: 200 },
      { id: '3', name: 'Bob Johnson', quota: 150, sold: 100 }
    ];

    const mockSales = [
      {
        id: '1',
        date: '2024-01-15',
        seller: 'John Doe',
        category: 'Standard',
        quantity: 2,
        unitPrice: 5000,
        total: 10000
      }
    ];

    if (selectedOption === 'stats') {
      return (
        <div className="space-y-6">
          <SalesStats
            entrances={350}
            totalSold={selectedEvent.soldTickets}
            totalRevenue={7500000}
          />
          <CategorySales
            categories={mockCategories}
            totalTickets={selectedEvent.totalTickets}
          />
          <SalesHistory
            sales={mockSales}
            categories={mockCategories}
            sellers={mockSellers}
          />
        </div>
      );
    }

    if (selectedOption === 'sellers') {
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

    if (selectedOption === 'sales') {
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
        selectedOption={selectedOption || ''}
      />
    );
  };

  return (
    <div className="pt-4 sm:pt-6 pb-6">
      {selectedEvent && (
        <BackButton onClick={handleBackToEvents} />
      )}
      
      <div className="max-w-lg mx-auto px-3 sm:px-4">
        {selectedEvent ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                {selectedEvent.title}
              </h1>
              <p className="text-sm text-gray-600">
                {selectedEvent.date} • {selectedEvent.location}
              </p>
            </div>

            {renderEventContent()}
          </motion.div>
        ) : (
          renderEventList()
        )}
      </div>
    </div>
  );
}