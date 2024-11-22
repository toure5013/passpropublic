import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus } from 'lucide-react';
import SellerCard from './SellerCard';

interface Seller {
  id: string;
  name: string;
  quota: number;
  sold: number;
}

interface SellerDetailsProps {
  sellers: Seller[];
  onAddSeller: () => void;
  showAddForm: boolean;
  onCancelAdd: () => void;
  onSubmitAdd: () => void;
  newSeller: {
    name: string;
    quota: string;
  };
  onNewSellerChange: (field: 'name' | 'quota', value: string) => void;
}

export default function SellerDetails({
  sellers,
  onAddSeller,
  showAddForm,
  onCancelAdd,
  onSubmitAdd,
  newSeller,
  onNewSellerChange
}: SellerDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Gestion des vendeurs</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddSeller}
          className="text-sm text-brand-red hover:text-brand-red/80 flex items-center gap-1"
        >
          <UserPlus className="h-4 w-4" />
          Ajouter un vendeur
        </motion.button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 border rounded-lg"
          >
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                placeholder="Nom du vendeur"
                value={newSeller.name}
                onChange={(e) => onNewSellerChange('name', e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg text-sm"
              />
              <input
                type="number"
                placeholder="Quota"
                value={newSeller.quota}
                onChange={(e) => onNewSellerChange('quota', e.target.value)}
                className="w-24 px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={onCancelAdd}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
              <button
                onClick={onSubmitAdd}
                className="px-3 py-1.5 bg-brand-button text-white rounded-lg text-sm"
              >
                Ajouter
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {sellers.map((seller) => (
          <SellerCard
            key={seller.id}
            name={seller.name}
            sold={seller.sold}
            quota={seller.quota}
          />
        ))}
      </div>
    </motion.div>
  );
}