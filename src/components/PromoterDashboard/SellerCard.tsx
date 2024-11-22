import React from 'react';
import { motion } from 'framer-motion';

interface SellerCardProps {
  name: string;
  sold: number;
  quota: number;
}

export default function SellerCard({ name, sold, quota }: SellerCardProps) {
  const percentage = Math.round((sold / quota) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="border rounded-lg p-3"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">{name}</h3>
        <span className="text-sm text-brand-red font-medium">
          {sold}/{quota}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-brand-red"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-xs text-gray-600">{percentage}%</span>
      </div>
    </motion.div>
  );
}