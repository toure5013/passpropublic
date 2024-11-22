import React from 'react';
import { Heart, MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeaturedEventProps {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  price: string;
  description: string;
}

export default function FeaturedEvent({ 
  id, title, date, location, image, price, description 
}: FeaturedEventProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6 sm:mb-8 group">
      <div className="flex flex-col lg:flex-row">
        <div className="relative lg:w-2/3">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-48 sm:h-64 lg:h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button 
            className="absolute top-2 sm:top-4 right-2 sm:right-4 p-1.5 sm:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
            aria-label="Ajouter aux favoris"
          >
            <Heart className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-gray-600 hover:text-brand-red" />
          </button>
        </div>
        
        <div className="p-4 sm:p-6 lg:w-1/3 flex flex-col justify-between">
          <div>
            <div className="mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900">{title}</h2>
              <p className="text-base sm:text-xl font-semibold text-brand-red mt-1 sm:mt-2">{price}</p>
            </div>
            
            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                <span className="text-xs sm:text-sm">{date}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" />
                <span className="text-xs sm:text-sm">{location}</span>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">{description}</p>
          </div>
          
          <Link
            to={`/event/${id}`}
            className="block w-full text-center bg-gradient-to-r from-brand-gradient-start to-brand-gradient-end text-white py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Réserver maintenant
          </Link>
        </div>
      </div>
    </div>
  );
}