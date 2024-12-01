// Types pour les configurations de paiement
export interface PaymentStatus {
  processing: PaymentStatusConfig;
  success: PaymentStatusConfig;
  error: PaymentStatusConfig;
}

interface PaymentStatusConfig {
  icon: string;
  text: string;
  bgColor: string;
  textColor: string;
  instruction: string;
}

// Configuration des statuts de paiement
export const PAYMENT_STATUS_CONFIG: PaymentStatus = {
  processing: {
    icon: 'loader',
    text: 'Traitement du paiement en cours...',
    bgColor: 'bg-brand-yellow/10',
    textColor: 'text-brand-red',
    instruction: 'Ne fermez pas cette fenêtre pendant le traitement du paiement.'
  },
  success: {
    icon: 'check',
    text: 'Paiement effectué avec succès !',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    instruction: 'Vos tickets seront disponibles dans quelques instants.'
  },
  error: {
    icon: 'x',
    text: 'Une erreur est survenue',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
    instruction: 'Veuillez réessayer ou contacter le support.'
  }
};

// Types pour les détails de commande
export interface OrderDetails {
  amount: number;
  paymentMethod: string;
  phone: string;
  items: OrderItem[];
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

// Formater le prix en FCFA
export const formatPrice = (price: number): string => {
  return `${price.toLocaleString()} F CFA`;
};

// Calculer le total de la commande
export const calculateOrderTotal = (items: OrderItem[]): number => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};