import { create } from 'zustand';

interface TransactionAllInfo {
  phone: string;
  amount: number;
  currency: string;
  amountXof: number;
  amountInCurrency: string;
  codeService: string;
  transactionId: string;
  status: 'PENDING' | 'SUCCESS' | 'FAIL';
  externalTransactionId: string;
  callbackUrl: string;
  notificationMessage: string;
  deepLinkUrl: string;
  [key: string]: any; // To accommodate any additional fields
}

interface TransactionState {
  transactionId: string | null;
  externalTransactionId: string | null;
  status: 'PENDING' | 'SUCCESS' | 'FAIL' | null;
  amount: number | null;
  currency: string | null;
  deepLinkUrl: string | null;
  transactionAllInfo: TransactionAllInfo | null;
  setTransaction: (data: Partial<TransactionState>) => void;
  setTransactionAllInfo: (info: TransactionAllInfo) => void;
  resetTransaction: () => void;
}

export const usePayementStore = create<TransactionState>((set) => ({
  transactionId: null,
  externalTransactionId: null,
  status: null,
  amount: null,
  currency: null,
  deepLinkUrl: null,
  transactionAllInfo: null,

  // Set transaction state
  setTransaction: (data) =>
    set((state) => ({
      ...state,
      ...data,
    })),

  // Set full transaction information
  setTransactionAllInfo: (info) =>
    set(() => ({
      transactionAllInfo: info,
    })),

  // Reset transaction state
  resetTransaction: () =>
    set(() => ({
      transactionId: null,
      externalTransactionId: null,
      status: null,
      amount: null,
      currency: null,
      deepLinkUrl: null,
      transactionAllInfo: null,
    })),
}));
