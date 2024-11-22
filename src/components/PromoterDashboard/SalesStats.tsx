import React from 'react';
import { motion } from 'framer-motion';
import { Timer, TrendingUp } from 'lucide-react';

interface SalesStatsProps {
  entrances: number;
  totalSold: number;
  totalRevenue: number;
}

export default function SalesStats({ entrances, totalSold, totalRevenue }: SalesStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 gap-3"
    >
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-2 text-brand-red mb-2">
          <Timer className="h-5 w-5" />
          <span className="text-sm font-medium">Entrées</span>
        </div>
        <motion.p 
          className="text-2xl font-bold"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
        >
          {entrances}
        </motion.p>
        <p className="text-xs text-gray-500 mt-1">sur {totalSold} billets vendus</p>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-2 text-brand-red mb-2">
          <TrendingUp className="h-5 w-5" />
          <span className="text-sm font-medium">Ventes</span>
        </div>
        <p className="text-2xl font-bold">{totalRevenue.toLocaleString()} F</p>
        <p className="text-xs text-gray-500 mt-1">{totalSold} billets vendus</p>
      </div>
    </motion.div>
  );
}