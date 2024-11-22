import React from 'react';
import { 
  BarChart2, 
  Users, 
  Home,
  Settings 
} from 'lucide-react';

interface PromoterBottomNavProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export default function PromoterBottomNav({ currentSection, onSectionChange }: PromoterBottomNavProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Accueil' },
    { id: 'stats', icon: BarChart2, label: 'Stats' },
    { id: 'sellers', icon: Users, label: 'Vendeurs' },
    { id: 'settings', icon: Settings, label: 'Options' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onSectionChange(id)}
            className={`flex flex-col items-center space-y-1 px-3 ${
              currentSection === id ? 'text-brand-red' : 'text-gray-600'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] sm:text-xs">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}