import React from 'react';
import Logo from '../Logo';

export default function TicketHeader() {
  return (
    <div className="flex items-center justify-between mb-6 border-b pb-4">
      <Logo className="h-12" />
      <div className="text-right">
        <h3 className="text-lg font-semibold text-gray-900">E-Ticket</h3>
        <p className="text-sm text-gray-500">Ticket électronique officiel</p>
      </div>
    </div>
  );
}