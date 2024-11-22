import React from 'react';
import { motion } from 'framer-motion';

interface CategorySalesProps {
  categories: {
    [key: string]: {
      sold: number;
      price: number;
    };
  };
  totalTickets: number;
}

export default function CategorySales({ categories, totalTickets }: CategorySalesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm p-4"
    >
      <h2 className="text-lg font-semibold mb-4">Ventes par catégorie</h2>
      <div className="space-y-3">
        {Object.entries(categories).map(([category, data]) => (
          <div key={category} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{category}</span>
              <span className="text-brand-red font-medium">
                {(data.sold * data.price).toLocaleString()} F
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-brand-red"
                  initial={{ width: 0 }}
                  animate={{ width: `${(data.sold / totalTickets) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-600">
                {data.sold} vendus
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}