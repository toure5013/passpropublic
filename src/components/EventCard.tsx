import React, { useEffect } from 'react';
import { Heart, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWishlistStore } from '../store/wishlistStore';
import { useSessionStore } from '../store/sessionStore';
import ImageLoader from './ImageLoader';
import { configService } from '../providers/config';
import { useEventStore } from '../store/eventStore';

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  location: string;
  event_ticket_img : string,
  price: string;
  className?: string;
  availableTickets?: number;
  totalTickets?: number;
}

export default function EventCard({ 
  id, title, date, location, event_ticket_img, price, className = '',
  availableTickets = 100, totalTickets = 100
}: EventCardProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { addViewedEvent } = useSessionStore();
  const isWishlisted = isInWishlist(id);
  const { currentEvent } = useEventStore();
  const navigate = useNavigate();
  
  let image = configService.baseUrlImage + event_ticket_img

  console.log(image)

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlisted) {
      removeFromWishlist(id);
    } else {
      addToWishlist({ id, title, date, location, image, price });
    }
  };

  const handleCardClick = () => {
    addViewedEvent(id);
    navigate(`/event/${id}/booking`);
  };

  const getAvailabilityStatus = () => {
    const remaining = availableTickets;
    const percentage = (remaining / totalTickets) * 100;

    if (percentage <= 5) {
      return {
        text: `Derniers billets ! Plus que ${remaining} places`,
        color: 'text-red-500',
        bgColor: 'bg-red-50'
      };
    } else if (percentage <= 20) {
      return {
        text: `${remaining} places disponibles`,
        color: 'text-orange-500',
        bgColor: 'bg-orange-50'
      };
    }
    return null;
  };

  const availabilityStatus = getAvailabilityStatus();



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div 
        // to={`/event/${id}/booking`}
        onClick={(e) => handleCardClick()}
        className={`block bg-white rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md ${className}`}
      >
        <div className="relative">
          <ImageLoader 
            src={image} 
            alt={title} 
            className="w-full aspect-[4/3] object-cover"
          />
          <motion.button 
            className={`absolute top-1.5 sm:top-2 right-1.5 sm:right-2 p-1 sm:p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors ${
              isWishlisted ? 'text-brand-red' : 'text-gray-600'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleWishlistClick}
            aria-label={isWishlisted ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart className="h-3 w-3 sm:h-4 sm:w-4" fill={isWishlisted ? "currentColor" : "none"} />
          </motion.button>

          {availabilityStatus && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`absolute bottom-2 left-2 right-2 px-2 py-1 ${availabilityStatus.bgColor} rounded-md backdrop-blur-sm`}
            >
              <div className="flex items-center gap-1">
                <AlertCircle className={`h-3 w-3 ${availabilityStatus.color}`} />
                <p className={`text-[10px] font-medium ${availabilityStatus.color}`}>
                  {availabilityStatus.text}
                </p>
              </div>
            </motion.div>
          )}
        </div>
        
        <div className="p-2 sm:p-3">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-1 mb-1">
            {title}
          </h3>
          
          <div className="space-y-0.5 sm:space-y-1 mb-1.5 sm:mb-2">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 flex-shrink-0" />
              <span className="text-[10px] sm:text-xs truncate">{date}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 flex-shrink-0" />
              <span className="text-[10px] sm:text-xs truncate">{location}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-brand-red">{price}</span>
            <motion.button 
              className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-brand-button rounded-brand text-[10px] sm:text-xs font-medium text-white hover:opacity-90 transition-opacity"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Réserver
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}