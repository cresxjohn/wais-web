"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CreditCard {
  id: string;
  name: string;
  bank: string;
  cardNumber: string; // Last 4 digits
  cardType: "visa" | "mastercard" | "amex" | "discover";
  currentBalance: number;
  creditLimit: number;
  availableCredit: number;
  dueDate: string;
  minPayment: number;
  interestRate: number;
  rewardsPoints: number;
  cashback: number;
  cardColor: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreditCardTransaction {
  id: string;
  cardId: string;
  date: string;
  merchant: string;
  amount: number;
  category: string;
  status: "pending" | "posted" | "declined";
  rewardsEarned: number;
}

export interface CreditCardStatement {
  id: string;
  cardId: string;
  statementDate: string;
  dueDate: string;
  totalAmount: number;
  minPayment: number;
  previousBalance: number;
  payments: number;
  purchases: number;
  fees: number;
  interest: number;
  isPaid: boolean;
}

interface CreditCardStore {
  cards: CreditCard[];
  transactions: CreditCardTransaction[];
  statements: CreditCardStatement[];
  selectedCard: CreditCard | null;
  isLoading: boolean;

  // Actions
  setCards: (cards: CreditCard[]) => void;
  addCard: (card: Omit<CreditCard, "id" | "createdAt">) => void;
  updateCard: (id: string, updates: Partial<CreditCard>) => void;
  removeCard: (id: string) => void;
  setSelectedCard: (card: CreditCard | null) => void;
  addTransaction: (transaction: Omit<CreditCardTransaction, "id">) => void;
  addStatement: (statement: Omit<CreditCardStatement, "id">) => void;
  setLoading: (loading: boolean) => void;

  // Computed
  getTotalDebt: () => number;
  getTotalAvailableCredit: () => number;
  getCreditUtilization: () => number;
  getCardTransactions: (cardId: string) => CreditCardTransaction[];
  getCardStatements: (cardId: string) => CreditCardStatement[];
  getTotalRewards: () => number;
  getTotalCashback: () => number;
}

// Mock data
const mockCards: CreditCard[] = [
  {
    id: "1",
    name: "Travel Rewards Card",
    bank: "Chase Bank",
    cardNumber: "4569",
    cardType: "visa",
    currentBalance: 2450.75,
    creditLimit: 15000,
    availableCredit: 12549.25,
    dueDate: "2025-01-15",
    minPayment: 125.5,
    interestRate: 18.99,
    rewardsPoints: 24580,
    cashback: 0,
    cardColor: "from-blue-600 to-purple-600",
    isActive: true,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Cashback Plus",
    bank: "BDO",
    cardNumber: "8234",
    cardType: "mastercard",
    currentBalance: 1205.3,
    creditLimit: 8000,
    availableCredit: 6794.7,
    dueDate: "2025-01-20",
    minPayment: 85.25,
    interestRate: 22.99,
    rewardsPoints: 0,
    cashback: 156.75,
    cardColor: "from-emerald-600 to-teal-600",
    isActive: true,
    createdAt: "2024-03-20T14:30:00Z",
  },
  {
    id: "3",
    name: "Premium Business",
    bank: "BPI",
    cardNumber: "9876",
    cardType: "amex",
    currentBalance: 0,
    creditLimit: 25000,
    availableCredit: 25000,
    dueDate: "2025-01-25",
    minPayment: 0,
    interestRate: 16.99,
    rewardsPoints: 45200,
    cashback: 0,
    cardColor: "from-slate-600 to-gray-700",
    isActive: true,
    createdAt: "2024-06-10T09:15:00Z",
  },
];

const mockTransactions: CreditCardTransaction[] = [
  {
    id: "1",
    cardId: "1",
    date: "2025-01-05",
    merchant: "Shopee Philippines",
    amount: 1250.0,
    category: "Shopping",
    status: "posted",
    rewardsEarned: 25,
  },
  {
    id: "2",
    cardId: "1",
    date: "2025-01-04",
    merchant: "Grab Food",
    amount: 485.5,
    category: "Food & Dining",
    status: "posted",
    rewardsEarned: 10,
  },
  {
    id: "3",
    cardId: "2",
    date: "2025-01-03",
    merchant: "SM Mall",
    amount: 2850.75,
    category: "Shopping",
    status: "posted",
    rewardsEarned: 0,
  },
  {
    id: "4",
    cardId: "1",
    date: "2025-01-02",
    merchant: "Shell Gas Station",
    amount: 1800.0,
    category: "Gas & Fuel",
    status: "posted",
    rewardsEarned: 18,
  },
  {
    id: "5",
    cardId: "2",
    date: "2025-01-01",
    merchant: "Netflix",
    amount: 549.0,
    category: "Entertainment",
    status: "posted",
    rewardsEarned: 0,
  },
];

const mockStatements: CreditCardStatement[] = [
  {
    id: "1",
    cardId: "1",
    statementDate: "2024-12-15",
    dueDate: "2025-01-15",
    totalAmount: 2450.75,
    minPayment: 125.5,
    previousBalance: 1890.25,
    payments: 1500.0,
    purchases: 2060.5,
    fees: 0,
    interest: 0,
    isPaid: false,
  },
  {
    id: "2",
    cardId: "2",
    statementDate: "2024-12-20",
    dueDate: "2025-01-20",
    totalAmount: 1205.3,
    minPayment: 85.25,
    previousBalance: 856.8,
    payments: 800.0,
    purchases: 1148.5,
    fees: 0,
    interest: 0,
    isPaid: false,
  },
];

export const useCreditCardStore = create<CreditCardStore>()(
  persist(
    (set, get) => ({
      cards: mockCards,
      transactions: mockTransactions,
      statements: mockStatements,
      selectedCard: null,
      isLoading: false,

      setCards: (cards) => set({ cards }),
      addCard: (card) => {
        const newCard: CreditCard = {
          ...card,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ cards: [...state.cards, newCard] }));
      },
      updateCard: (id, updates) =>
        set((state) => ({
          cards: state.cards.map((card) =>
            card.id === id ? { ...card, ...updates } : card
          ),
        })),
      removeCard: (id) =>
        set((state) => ({
          cards: state.cards.filter((card) => card.id !== id),
        })),
      setSelectedCard: (card) => set({ selectedCard: card }),
      addTransaction: (transaction) => {
        const newTransaction: CreditCardTransaction = {
          ...transaction,
          id: Math.random().toString(36).substr(2, 9),
        };
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }));
      },
      addStatement: (statement) => {
        const newStatement: CreditCardStatement = {
          ...statement,
          id: Math.random().toString(36).substr(2, 9),
        };
        set((state) => ({
          statements: [newStatement, ...state.statements],
        }));
      },
      setLoading: (isLoading) => set({ isLoading }),

      // Computed
      getTotalDebt: () => {
        const { cards } = get();
        return cards.reduce((total, card) => total + card.currentBalance, 0);
      },
      getTotalAvailableCredit: () => {
        const { cards } = get();
        return cards.reduce((total, card) => total + card.availableCredit, 0);
      },
      getCreditUtilization: () => {
        const { cards } = get();
        const totalLimit = cards.reduce(
          (total, card) => total + card.creditLimit,
          0
        );
        const totalUsed = cards.reduce(
          (total, card) => total + card.currentBalance,
          0
        );
        return totalLimit > 0 ? (totalUsed / totalLimit) * 100 : 0;
      },
      getCardTransactions: (cardId) => {
        const { transactions } = get();
        return transactions.filter((t) => t.cardId === cardId);
      },
      getCardStatements: (cardId) => {
        const { statements } = get();
        return statements.filter((s) => s.cardId === cardId);
      },
      getTotalRewards: () => {
        const { cards } = get();
        return cards.reduce((total, card) => total + card.rewardsPoints, 0);
      },
      getTotalCashback: () => {
        const { cards } = get();
        return cards.reduce((total, card) => total + card.cashback, 0);
      },
    }),
    {
      name: "wais-credit-cards",
      partialize: (state) => ({
        cards: state.cards,
        transactions: state.transactions,
        statements: state.statements,
      }),
    }
  )
);
