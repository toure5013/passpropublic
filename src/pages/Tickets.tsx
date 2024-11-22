import React from 'react';
import { Calendar, MapPin, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Ticket {
  id: string;
  eventTitle: string;
  date: string;
  time: string;
  location: string;
  ticketType: string;
  qrCode: string;
}

export default function Tickets() {
  const [tickets, setTickets] = React.useState<Ticket[]>([
    {
      id: '1',
      eventTitle: 'DJ Arafat en concert',
      date: '31 Juillet 2024',
      time: '19:00',
      location: 'Palais de la culture d\'Abidjan',
      ticketType: 'VIP',
      qrCode: 'TICKET-001-2024'
    }
  ]);

  if (tickets.length === 0) {
    return (
      <div className="pt-4 sm:pt-6">
        <div className="max-w-lg mx-auto px-3 sm:px-4">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 text-center">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
              Vous n'avez pas encore de tickets
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm mb-4">
              Vos tickets achetés apparaîtront ici.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 sm:pt-6">
      <div className="max-w-lg mx-auto px-3 sm:px-4">
        <div className="space-y-3 sm:space-y-4">
          {tickets.map((ticket) => (
            <div 
              key={ticket.id}
              className="bg-white rounded-lg shadow-sm p-3 sm:p-4"
            >
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900">
                  {ticket.eventTitle}
                </h2>
                <span className="px-2 py-1 bg-brand-yellow/10 text-brand-red rounded text-[10px] sm:text-xs font-medium">
                  {ticket.ticketType}
                </span>
              </div>
              
              <div className="space-y-2 mb-3 sm:mb-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
                  <span className="text-xs sm:text-sm">{ticket.date} - {ticket.time}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
                  <span className="text-xs sm:text-sm">{ticket.location}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
                <div className="flex items-center text-gray-500">
                  <QrCode className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
                  <span className="text-[10px] sm:text-xs font-medium">{ticket.qrCode}</span>
                </div>
                <Link 
                  to={`/tickets/${ticket.id}`}
                  className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-brand-button text-white rounded-brand text-[10px] sm:text-xs font-medium hover:opacity-90 transition-opacity"
                >
                  Voir le ticket
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}