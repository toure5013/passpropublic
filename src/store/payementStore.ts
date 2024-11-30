import { create } from "zustand";

interface TransactionAllInfo {
  phone: string;
  amount: number;
  currency: string;
  amountXof: number;
  amountInCurrency: string;
  codeService: string;
  transactionId: string;
  status: "PENDING" | "SUCCESS" | "FAIL";
  externalTransactionId: string;
  callbackUrl: string;
  notificationMessage: string;
  deepLinkUrl: string;
  [key: string]: any; // To accommodate any additional fields
}

interface TransactionState {
  transactionId: string | null;
  externalTransactionId: string | null;
  status: "PENDING" | "SUCCESS" | "FAIL" | null;
  amount: number | null;
  currency: string | null;
  deepLinkUrl: string | null;
  transactionAllInfo: TransactionAllInfo | null;
  _be_removed_deepLinkUrl_: string | null;
  codeService: string | null;
  plateform: string | null;
  setTransaction: (data: Partial<TransactionState>) => void;
  setTransactionAllInfo: (info: TransactionAllInfo) => void;
  resetTransaction: () => void;
}

export const usePayementStore = create<TransactionState>((set) => ({
  transactionId: sessionStorage.getItem("transactionId") || null,
  externalTransactionId:
    sessionStorage.getItem("externalTransactionId") || null,
  status: null,
  amount: sessionStorage.getItem("amount")
    ? JSON.parse(sessionStorage.getItem("amount") as string)
    : null,
  currency: null,
  deepLinkUrl: sessionStorage.getItem("deepLinkUrl") || null,
  transactionAllInfo: sessionStorage.getItem("transactionAllInfo")
    ? JSON.parse(sessionStorage.getItem("transactionAllInfo") as string)
    : null,
  _be_removed_deepLinkUrl_:
    sessionStorage.getItem("_be_removed_deepLinkUrl_") || null,
  codeService: sessionStorage.getItem("codeService") || null,
  plateform: sessionStorage.getItem("plateform") || null,

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
      transactionId: sessionStorage.getItem("transactionId") || null,
      externalTransactionId:
        sessionStorage.getItem("externalTransactionId") || null,
      status: null,
      amount: null,
      currency: null,
      deepLinkUrl: sessionStorage.getItem("deepLinkUrl") || null,
      transactionAllInfo: null,
    })),
}));
