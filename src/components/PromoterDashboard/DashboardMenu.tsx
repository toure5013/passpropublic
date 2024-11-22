import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart2, 
  Users, 
  Settings, 
  DollarSign
} from 'lucide-react';

interface MenuOption {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const menuOptions: MenuOption[] = [
  {
    id: 'stats',
    icon: <BarChart2 className="h-6 w-6" />,
    title: 'Statistiques',
    description: 'Suivez vos ventes et entrées en temps réel'
  },
  {
    id: 'sellers',
    icon: <Users className="h-6 w-6" />,
    title: 'Vendeurs',
    description: 'Gérez vos vendeurs et leurs quotas'
  },
  {
    id: 'sales',
    icon: <DollarSign className="h-6 w-6" />,
    title: 'Ventes',
    description: 'Historique détaillé des ventes'
  },
  {
    id: 'settings',
    icon: <Settings className="h-6 w-6" />,
    title: 'Paramètres',
    description: 'Configuration de l\'événement'
  }
];

interface DashboardMenuProps {
  onSelect: (option: string) => void;
  selectedOption: string;
}

export default function DashboardMenu({ onSelect, selectedOption }: DashboardMenuProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {menuOptions.map((option) => (
        <motion.button
          key={option.id}
          onClick={() => onSelect(option.id)}
          className={`p-4 rounded-lg text-left transition-all ${
            selectedOption === option.id
              ? 'bg-brand-red text-white'
              : 'bg-white hover:bg-brand-red/5'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className={`${
            selectedOption === option.id
              ? 'text-white'
              : 'text-brand-red'
          } mb-2`}>
            {option.icon}
          </div>
          <h3 className="font-semibold mb-1">{option.title}</h3>
          <p className={`text-xs ${
            selectedOption === option.id
              ? 'text-white/80'
              : 'text-gray-600'
          }`}>
            {option.description}
          </p>
        </motion.button>
      ))}
    </div>
  );
}