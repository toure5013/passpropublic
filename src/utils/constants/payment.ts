import { PaymentMethod } from '../../types/payment';

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'wave',
    name: 'Wave',
    logo: '/assets/images/payments/wave.png',
    type: 'mobile_money'
  },
  {
    id: 'orange',
    name: 'Orange Money',
    logo: '/assets/images/payments/orange.png',
    type: 'mobile_money'
  },
  {
    id: 'mtn',
    name: 'MTN Money',
    logo: '/assets/images/payments/mtn.png',
    type: 'mobile_money'
  },
  {
    id: 'moov',
    name: 'Moov Money',
    logo: '/assets/images/payments/moov.png',
    type: 'mobile_money'
  },
  {
    id: 'card',
    name: 'Carte bancaire',
    logo: '/assets/images/payments/visa-mastercard.png',
    type: 'card'
  }
];