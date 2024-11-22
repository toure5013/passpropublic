import React from 'react';
import EventCard from '../components/EventCard';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  price: string;
}

export default function Wishlist() {
  const [events, setEvents] = React.useState<Event[]>([
    {
      id: '1',
      title: 'DJ Arafat en concert',
      date: '31 Juillet 2024',
      location: 'Palais de la culture d\'Abidjan',
      image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14',
      price: '5000 F CFA'
    }
  ]);

  if (events.length === 0) {
    return (
      <div className="pt-4 sm:pt-6">
        <div className="max-w-lg mx-auto px-3 sm:px-4">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 text-center">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
              Votre liste d'envie est vide
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm mb-4">
              Ajoutez des événements à votre liste d'envie pour les retrouver facilement.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 sm:pt-6">
      <div className="max-w-lg mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {events.map((event) => (
            <EventCard 
              key={event.id}
              {...event}
            />
          ))}
        </div>
      </div>
    </div>
  );
}