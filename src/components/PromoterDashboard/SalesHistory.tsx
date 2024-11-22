import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, DollarSign, Tag, User } from 'lucide-react';

interface Sale {
  id: string;
  date: string;
  seller: string;
  category: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface SalesHistoryProps {
  sales: Sale[];
  categories: {
    [key: string]: {
      sold: number;
      price: number;
    };
  };
  sellers: Array<{
    id: string;
    name: string;
    quota: number;
    sold: number;
  }>;
}

export default function SalesHistory({ sales, categories, sellers }: SalesHistoryProps) {
  // Calculer les totaux par vendeur
  const sellerTotals = sellers.map(seller => {
    const sellerSales = sales.filter(sale => sale.seller === seller.name);
    const totalAmount = sellerSales.reduce((sum, sale) => sum + sale.total, 0);
    const salesByCategory = Object.entries(categories).reduce((acc, [category, _]) => {
      const categorySales = sellerSales.filter(sale => sale.category === category);
      const quantity = categorySales.reduce((sum, sale) => sum + sale.quantity, 0);
      const amount = categorySales.reduce((sum, sale) => sum + sale.total, 0);
      return {
        ...acc,
        [category]: { quantity, amount }
      };
    }, {});

    return {
      ...seller,
      totalAmount,
      salesByCategory
    };
  });

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-4"
      >
        <h2 className="text-lg font-semibold mb-4">Vue d'ensemble des ventes</h2>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(categories).map(([category, data]) => (
            <div key={category} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-brand-red mb-2">
                <Tag className="h-4 w-4" />
                <span className="text-sm font-medium">{category}</span>
              </div>
              <p className="text-lg font-bold">
                {(data.sold * data.price).toLocaleString()} F
              </p>
              <p className="text-xs text-gray-500">
                {data.sold} billets • {data.price.toLocaleString()} F/unité
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Ventes par vendeur */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-4"
      >
        <h2 className="text-lg font-semibold mb-4">Ventes par vendeur</h2>
        <div className="space-y-4">
          {sellerTotals.map((seller) => (
            <motion.div
              key={seller.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="border rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-brand-red" />
                  <span className="font-medium">{seller.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-brand-red">
                    {seller.totalAmount.toLocaleString()} F
                  </p>
                  <p className="text-xs text-gray-500">
                    {seller.sold}/{seller.quota} billets
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {Object.entries(seller.salesByCategory).map(([category, stats]) => (
                  <div key={category} className="bg-gray-50 rounded p-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{category}</span>
                      <span className="font-medium">
                        {stats.amount.toLocaleString()} F
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {stats.quantity} billets vendus
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Historique détaillé */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-4"
      >
        <h2 className="text-lg font-semibold mb-4">Historique détaillé</h2>
        <div className="space-y-3">
          {sales.map((sale) => (
            <motion.div
              key={sale.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{sale.date}</span>
                </div>
                <p className="text-sm font-medium">{sale.seller}</p>
                <div className="flex items-center gap-1">
                  <Tag className="h-3 w-3 text-brand-red" />
                  <span className="text-xs text-gray-600">{sale.category}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end text-brand-red">
                  <DollarSign className="h-3 w-3" />
                  <span className="font-medium">
                    {sale.total.toLocaleString()} F
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {sale.quantity} × {sale.unitPrice.toLocaleString()} F
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}