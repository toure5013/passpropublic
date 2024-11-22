import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Share2, Heart, ChevronDown, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageLoader from '../components/ImageLoader';
import SimilarEvents from '../components/SimilarEvents';
import BackButton from '../components/BackButton';

export default function EventDetails() {
  const { id } = useParams();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const event = {
    id: '1',
    title: 'DJ Arafat en concert',
    date: '31 Juillet 2024',
    time: '19:00',
    location: 'Palais de la culture d\'Abidjan',
    image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14',
    description: 'Ne manquez pas le concert événement de l\'année ! Une soirée exceptionnelle remplie d\'énergie et de tubes incontournables. DJ Arafat, l\'artiste le plus populaire de la musique urbaine ivoirienne, vous donne rendez-vous pour un show unique et mémorable. Au programme : ses plus grands tubes, des invités surprises, et une ambiance électrique garantie. Préparez-vous à vivre des moments inoubliables lors de cet événement qui s\'annonce déjà comme l\'un des temps forts de l\'année musicale.',
    category: 'Concert',
    availableTickets: 50,
    totalTickets: 1000
  };

  const availabilityPercentage = (event.availableTickets / event.totalTickets) * 100;
  const isLowAvailability = availabilityPercentage <= 20;

  return (
    <div className="pt-4 sm:pt-6 pb-20">
      <div className="max-w-lg mx-auto px-3 sm:px-4">
        <BackButton />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <div className="relative h-48 sm:h-64">
            <ImageLoader
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <div className="bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end rounded-lg px-4 py-3 backdrop-blur-sm">
                <h1 className="text-lg sm:text-xl font-bold text-white text-center">
                  {event.title}
                </h1>
              </div>
            </div>
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-2">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
              >
                <Heart className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-gray-600" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
              >
                <Share2 className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-gray-600" />
              </motion.button>
            </div>
          </div>

          <div className="p-4">
            {isLowAvailability && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 px-3 py-2 bg-red-50 rounded-lg flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4 text-red-500" />
                <p className="text-sm text-red-500 font-medium">
                  Plus que {event.availableTickets} places disponibles !
                </p>
              </motion.div>
            )}

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

            <div className="mb-6">
              <div 
                className={`relative ${!isDescriptionExpanded ? 'max-h-[3em] overflow-hidden' : ''}`}
              >
                <p className="text-sm text-gray-600 leading-relaxed">
                  {event.description}
                </p>
                {!isDescriptionExpanded && (
                  <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent" />
                )}
              </div>
              <AnimatePresence>
                {event.description.length > 100 && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="flex items-center gap-1 text-xs text-brand-red mt-2 hover:opacity-80 transition-opacity"
                  >
                    <span>{isDescriptionExpanded ? 'Voir moins' : 'Voir plus'}</span>
                    <motion.div
                      animate={{ rotate: isDescriptionExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <Link
              to={`/event/${event.id}/booking`}
              className="block w-full text-center bg-brand-button text-white py-3 rounded-brand text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Réserver maintenant
            </Link>
          </div>
        </motion.div>

        <SimilarEvents currentEventId={event.id} category={event.category} />
      </div>
    </div>
  );
}