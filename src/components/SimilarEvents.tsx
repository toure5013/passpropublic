import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp } from 'lucide-react';
import EventCard from './EventCard';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  price: string;
  availableTickets: number;
  totalTickets: number;
  category: string;
  trending?: boolean;
}

interface SimilarEventsProps {
  currentEventId: string;
  category: string;
}

export default function SimilarEvents({ currentEventId, category }: SimilarEventsProps) {
  // Simuler des événements similaires basés sur la catégorie et les tendances
  const similarEvents: Event[] = [
    {
      id: '5',
      title: 'Magic System Live',
      date: '5 Septembre 2024',
      location: 'Palais des Sports',
      image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec',
      price: '8000 F CFA',
      availableTickets: 800,
      totalTickets: 1000,
      category: 'Concert',
      trending: true
    },
    {
      id: '6',
      title: 'Festival Anoumabo',
      date: '12 Septembre 2024',
      location: 'Marcory',
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea',
      price: '5000 F CFA',
      availableTickets: 50,
      totalTickets: 1000,
      category: 'Festival'
    },
    {
      id: '7',
      title: 'Concert Alpha Blondy',
      date: '20 Septembre 2024',
      location: 'Sofitel Hôtel Ivoire',
      image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a',
      price: '15000 F CFA',
      availableTickets: 200,
      totalTickets: 500,
      category: 'Concert',
      trending: true
    }
  ].filter(event => event.id !== currentEventId);

  // Séparer les événements par catégorie et tendance
  const categoryEvents = similarEvents.filter(event => event.category === category);
  const trendingEvents = similarEvents.filter(event => event.trending);
  const otherEvents = similarEvents.filter(event => 
    event.category !== category && !event.trending
  );

  // Combiner les événements dans l'ordre de priorité
  const orderedEvents = [
    ...categoryEvents,
    ...trendingEvents.filter(event => !categoryEvents.includes(event)),
    ...otherEvents
  ].slice(0, 4); // Limiter à 4 événements maximum

  if (orderedEvents.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Événements similaires
        </h2>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex items-center gap-1 text-brand-red"
        >
          <Sparkles className="h-4 w-4" />
        </motion.div>
      </div>

      <div className="space-y-4">
        {orderedEvents.map(event => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              {event.trending && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -left-2 -top-2 z-10 bg-brand-red text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 shadow-lg"
                >
                  <TrendingUp className="h-3 w-3" />
                  <span>Tendance</span>
                </motion.div>
              )}
              <EventCard
                {...event}
                availableTickets={event.availableTickets}
                totalTickets={event.totalTickets}
                className="w-full"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}