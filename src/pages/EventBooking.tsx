import React from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, Share2 } from 'lucide-react';
import TicketSelector from '../components/Booking/TicketSelector';

interface TicketCategory {
  id: string;
  name: string;
  price: number;
  description: string;
  available: number;
}

export default function EventBooking() {
  const { id } = useParams();
  
  const event = {
    id: '1',
    title: 'DJ Arafat en concert',
    date: '31 Juillet 2024',
    time: '19:00',
    location: 'Palais de la culture d\'Abidjan',
    image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14',
    description: 'Ne manquez pas le concert événement de l\'année ! Une soirée exceptionnelle remplie d\'énergie et de tubes incontournables.',
    categories: [
      {
        id: 'standard',
        name: 'Standard',
        price: 5000,
        description: 'Accès à la zone standard',
        available: 1000
      },
      {
        id: 'vip',
        name: 'VIP',
        price: 15000,
        description: 'Accès zone VIP + Cocktail',
        available: 200
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 25000,
        description: 'Accès zone Premium + Cocktail + Meet & Greet',
        available: 50
      }
    ] as TicketCategory[]
  };

  const handleAddToCart = (selections: Record<string, number>) => {
    // Ajouter au panier
    console.log('Sélections:', selections);
  };

  return (
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
        <TicketSelector 
          categories={event.categories}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
}