import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Timer, TrendingUp, Users } from 'lucide-react';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    date: string;
    location: string;
    totalTickets: number;
    soldTickets: number;
    sellers: Array<{ sold: number }>;
  };
  onClick: () => void;
}

export default function EventCard({ event, onClick }: EventCardProps) {
  const salesPercentage = Math.round((event.soldTickets / event.totalTickets) * 100);

  return (
    <motion.button
      onClick={onClick}
      className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-1">
              {event.title}
            </h2>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-gray-600">
                <Calendar className="h-3.5 w-3.5" />
                <span className="text-xs">{event.date}</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600">
                <MapPin className="h-3.5 w-3.5" />
                <span className="text-xs">{event.location}</span>
              </div>
            </div>
          </div>
          <motion.div
            className="h-8 w-8 rounded-full bg-brand-yellow/10 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <TrendingUp className="h-4 w-4 text-brand-red" />
          </motion.div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-3">
          {/* Entrées en temps réel */}
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="flex items-center gap-1 text-brand-red mb-1">
              <Timer className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Entrées</span>
            </div>
            <motion.p 
              className="text-lg font-bold"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              {Math.floor(event.soldTickets * 0.7)}
            </motion.p>
          </div>

          {/* Ventes */}
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="flex items-center gap-1 text-brand-red mb-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Ventes</span>
            </div>
            <p className="text-lg font-bold">{event.soldTickets}</p>
          </div>

          {/* Vendeurs */}
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="flex items-center gap-1 text-brand-red mb-1">
              <Users className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Vendeurs</span>
            </div>
            <p className="text-lg font-bold">{event.sellers.length}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">Progression</span>
            <span className="font-medium text-brand-red">{salesPercentage}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end"
              initial={{ width: 0 }}
              animate={{ width: `${salesPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-gray-500 mt-1">
            <span>{event.soldTickets} vendus</span>
            <span>{event.totalTickets} total</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}