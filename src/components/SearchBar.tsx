import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className = '' }: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder="Rechercher un événement..."
        className="w-full pl-10 pr-4 py-2 sm:py-3 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-yellow text-xs sm:text-sm bg-white"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none" />
    </div>
  );
}