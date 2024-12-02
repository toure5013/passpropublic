import React from 'react';
import { Calendar, MapPin, Clock, Ticket } from 'lucide-react';

interface TicketInfoProps {
  date: string;
  time: string;
  location: string;
  ticketType: string;
  ticketId: number;
  price?: string;
}

export default function TicketInfo({ 
  date, 
  time, 
  location, 
  ticketType, 
  ticketId,
  price = "5000 F CFA"
}: TicketInfoProps) {
  return (
    <div className="space-y-6 mb-8">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex items-center text-gray-800">
            <Calendar className="h-5 w-5 mr-3" />
            <div>
              <span className="text-xs text-gray-500 block">Date</span>
              <span className="text-sm font-medium">{date}</span>
            </div>
          </div>
          <div className="flex items-center text-gray-800">
            <Clock className="h-5 w-5 mr-3" />
            <div>
              <span className="text-xs text-gray-500 block">Heure</span>
              <span className="text-sm font-medium">{time}</span>
            </div>
          </div>
          <div className="flex items-center text-gray-800">
            <MapPin className="h-5 w-5 mr-3" />
            <div>
              <span className="text-xs text-gray-500 block">Lieu</span>
              <span className="text-sm font-medium">{location}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end justify-between">
          <div className="text-right">
            <div className="px-4 py-2 bg-brand-yellow/10 text-brand-red rounded-lg text-sm font-semibold mb-2">
              {ticketType}
            </div>
            <div className="text-lg font-bold text-brand-red">
              {price}
            </div>
          </div>
          <div className="flex items-center text-gray-500 text-xs">
            <Ticket className="h-4 w-4 mr-1" />
            <span>{ticketId}</span>
          </div>
        </div>
      </div>
    </div>
  );
}