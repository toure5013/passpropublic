import React from 'react';

interface TicketCoverProps {
  imageUrl: string;
  title: string;
}

export default function TicketCover({ imageUrl, title }: TicketCoverProps) {
  return (
    <div className="relative h-48 sm:h-64 rounded-lg overflow-hidden mb-4">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover"
        crossOrigin="anonymous" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <h1 className="absolute bottom-3 left-3 right-3 text-white text-lg sm:text-xl font-bold">
        {title}
      </h1>
    </div>
  );
}