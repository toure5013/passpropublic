import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Upload, Info, MapPin, Calendar, Clock, Users, Tag, AlertCircle } from 'lucide-react';
import BackButton from '../components/BackButton';

interface TicketCategory {
  id: string;
  name: string;
  price: string;
  description: string;
  quantity: string;
}

export default function BecomePromoterPage() {
  const [categories, setCategories] = useState<TicketCategory[]>([
    { id: '1', name: '', price: '', description: '', quantity: '' }
  ]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const addCategory = () => {
    setCategories([
      ...categories,
      { id: Date.now().toString(), name: '', price: '', description: '', quantity: '' }
    ]);
  };

  const removeCategory = (id: string) => {
    if (categories.length > 1) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  const updateCategory = (id: string, field: keyof TicketCategory, value: string) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, [field]: value } : cat
    ));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Traitement du formulaire
    console.log('Categories:', categories);
    console.log('File:', selectedFile);
  };

  return (
    <div className="pt-4 sm:pt-6 pb-20">
      <BackButton />
      <div className="max-w-lg mx-auto px-3 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">
                Publiez votre événement
              </h2>
              <p className="text-sm text-gray-600">
                Remplissez les informations ci-dessous pour créer votre événement
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-brand-yellow/10 flex items-center justify-center">
              <span className="text-sm font-medium text-brand-red">1/2</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section Organisateur */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Users className="h-4 w-4 text-brand-red" />
                Informations de l'organisateur
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de l'organisateur
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Infoline
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                    required
                    placeholder="Ex: 0759949494"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email de contact
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                  required
                  placeholder="contact@example.com"
                />
              </div>
            </div>

            {/* Section Événement */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Info className="h-4 w-4 text-brand-red" />
                Informations de l'événement
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'événement
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type d'événement
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                  required
                >
                  <option value="">Sélectionnez un type</option>
                  <option value="concert">Concert</option>
                  <option value="festival">Festival</option>
                  <option value="theatre">Théâtre</option>
                  <option value="sport">Sport</option>
                  <option value="conference">Conférence</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    Heure
                  </label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  Lieu
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red mb-2"
                  required
                  placeholder="Nom du lieu"
                />
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                  required
                  placeholder="Adresse complète"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red resize-none"
                  required
                  placeholder="Décrivez votre événement en détail..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Artistes / Intervenants
                </label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red resize-none"
                  placeholder="Liste des artistes ou intervenants..."
                />
              </div>
            </div>

            {/* Section Image */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Upload className="h-4 w-4 text-brand-red" />
                Image de couverture
              </h3>

              <div className="relative">
                <label className="block">
                  <div className={`relative ${previewUrl ? 'hidden' : ''}`}>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                    />
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-brand-red/50 transition-colors cursor-pointer">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="text-sm text-brand-red">
                          Cliquez pour télécharger
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG jusqu'à 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                </label>

                {previewUrl && (
                  <div className="relative mt-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl('');
                      }}
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                    >
                      <X className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Section Billets */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-brand-red" />
                  Catégories de billets
                </h3>
                <motion.button
                  type="button"
                  onClick={addCategory}
                  className="text-sm text-brand-red hover:text-brand-red/80 flex items-center gap-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="h-4 w-4" />
                  Ajouter une catégorie
                </motion.button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {categories.map((category) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-sm font-medium text-gray-900">
                          Catégorie {categories.indexOf(category) + 1}
                        </h4>
                        {categories.length > 1 && (
                          <motion.button
                            type="button"
                            onClick={() => removeCategory(category.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X className="h-4 w-4" />
                          </motion.button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nom de la catégorie
                          </label>
                          <input
                            type="text"
                            value={category.name}
                            onChange={(e) => updateCategory(category.id, 'name', e.target.value)}
                            placeholder="Ex: VIP, Standard..."
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Prix unitaire
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={category.price}
                                onChange={(e) => updateCategory(category.id, 'price', e.target.value)}
                                placeholder="0"
                                className="w-full pl-3 pr-16 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                                required
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                                F CFA
                              </span>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nombre de billets
                            </label>
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={category.quantity}
                              onChange={(e) => updateCategory(category.id, 'quantity', e.target.value)}
                              placeholder="0"
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={category.description}
                            onChange={(e) => updateCategory(category.id, 'description', e.target.value)}
                            placeholder="Avantages inclus dans cette catégorie..."
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red resize-none"
                            rows={2}
                            required
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Section Conditions */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-brand-red" />
                Conditions générales
              </h3>

              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 text-brand-red border-gray-300 rounded focus:ring-brand-red"
                    required
                  />
                  <span className="text-sm text-gray-600">
                    J'accepte les conditions générales de vente et certifie être autorisé à organiser cet événement. Je m'engage à respecter les règles de sécurité et les réglementations en vigueur.
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand-button text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Soumettre l'événement
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}