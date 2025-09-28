import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Transaction {
  id: string;
  userId: string;
  description: string;
  amount: string;
  type: TransactionType;
  category: string;
  date: string;
  status: TransactionStatus;
  notes?: string;
  tags: string[];
  isRecurring: boolean;
  paymentId?: string; // If this transaction is part of a recurring payment

  // For expenses and income
  accountId?: string;

  // For transfers
  fromAccountId?: string;
  toAccountId?: string;
  transferFee?: string;
  transferGroupId?: string; // Groups related transfer transactions

  // Recurrence information
  recurrenceRule?: RecurrenceRule;

  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  name: string;
  description?: string;
  amount: string;
  type: TransactionType;
  category: string;
  accountId?: string;
  fromAccountId?: string;
  toAccountId?: string;
  startDate: string;
  endDate?: string;
  status: "ACTIVE" | "PAUSED" | "COMPLETED";
  isManual: boolean;
  recurrenceRuleId?: string;
  recurrenceRule?: RecurrenceRule;
  createdAt: string;
  updatedAt: string;
}

export interface RecurrenceRule {
  id: string;
  frequency: RecurrenceFrequency;
  interval: number;
  endDate?: string;
  endAfterOccurrences?: number;
  // Weekly specific
  weeklyDaysOfWeek?: number[];
  // Monthly specific
  monthlyDayOfMonth?: number;
  monthlyWeekOfMonth?: number;
  monthlyDayOfWeek?: number;
}

export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER";
export type TransactionStatus = "PENDING" | "COMPLETED" | "CANCELLED";
export type RecurrenceFrequency =
  | "DAILY"
  | "WEEKLY"
  | "BI_WEEKLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "SEMI_ANNUALLY"
  | "ANNUALLY";

interface TransactionState {
  transactions: Transaction[];
  payments: Payment[];
  selectedTransaction: Transaction | null;
  selectedPayment: Payment | null;
  loading: boolean;
  error: string | null;
  filters: {
    type?: TransactionType;
    category?: string;
    accountId?: string;
    dateRange?: { from: string; to: string };
    search?: string;
    tags?: string[];
  };
}

interface TransactionActions {
  // Transactions
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (
    transaction: Omit<Transaction, "id" | "userId" | "createdAt" | "updatedAt">
  ) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  removeTransaction: (id: string) => void;

  // Payments
  setPayments: (payments: Payment[]) => void;
  addPayment: (
    payment: Omit<Payment, "id" | "userId" | "createdAt" | "updatedAt">
  ) => void;
  updatePayment: (id: string, updates: Partial<Payment>) => void;
  removePayment: (id: string) => void;

  // Selection
  setSelectedTransaction: (transaction: Transaction | null) => void;
  setSelectedPayment: (payment: Payment | null) => void;

  // Filters
  setFilters: (filters: Partial<TransactionState["filters"]>) => void;
  clearFilters: () => void;

  // Utility
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getTransactionsByDateRange: (from: string, to: string) => Transaction[];
  getTransactionsByAccount: (accountId: string) => Transaction[];
  getTransactionsByCategory: (category: string) => Transaction[];
  getTotalByType: (
    type: TransactionType,
    dateRange?: { from: string; to: string }
  ) => number;
}

export type TransactionStore = TransactionState & TransactionActions;

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: "1",
    userId: "user-1",
    description: "Jollibee BGC",
    amount: "245.00",
    type: "EXPENSE",
    category: "Food & Dining",
    date: "2024-01-10",
    status: "COMPLETED",
    notes: "Lunch with team",
    tags: ["food", "work"],
    isRecurring: false,
    accountId: "2", // UnionBank Checking
    createdAt: "2024-01-10T12:30:00Z",
    updatedAt: "2024-01-10T12:30:00Z",
  },
  {
    id: "2",
    userId: "user-1",
    description: "Salary Deposit",
    amount: "45000.00",
    type: "INCOME",
    category: "Salary",
    date: "2024-01-09",
    status: "COMPLETED",
    tags: ["salary", "income"],
    isRecurring: true,
    accountId: "1", // BPI Savings
    paymentId: "pay-1",
    createdAt: "2024-01-09T08:00:00Z",
    updatedAt: "2024-01-09T08:00:00Z",
  },
  {
    id: "3",
    userId: "user-1",
    description: "Grab Ride",
    amount: "180.50",
    type: "EXPENSE",
    category: "Transportation",
    date: "2024-01-09",
    status: "COMPLETED",
    tags: ["transport", "work"],
    isRecurring: false,
    accountId: "2",
    createdAt: "2024-01-09T18:45:00Z",
    updatedAt: "2024-01-09T18:45:00Z",
  },
  {
    id: "4",
    userId: "user-1",
    description: "Transfer to Savings",
    amount: "5000.00",
    type: "TRANSFER",
    category: "Savings",
    date: "2024-01-08",
    status: "COMPLETED",
    notes: "Emergency fund contribution",
    tags: ["savings", "emergency"],
    isRecurring: false,
    fromAccountId: "2", // From checking
    toAccountId: "1", // To savings
    transferGroupId: "tg-1",
    createdAt: "2024-01-08T10:15:00Z",
    updatedAt: "2024-01-08T10:15:00Z",
  },
  {
    id: "5",
    userId: "user-1",
    description: "Netflix Subscription",
    amount: "549.00",
    type: "EXPENSE",
    category: "Entertainment",
    date: "2024-01-07",
    status: "COMPLETED",
    tags: ["subscription", "entertainment"],
    isRecurring: true,
    accountId: "3", // BDO Credit Card
    paymentId: "pay-2",
    createdAt: "2024-01-07T14:20:00Z",
    updatedAt: "2024-01-07T14:20:00Z",
  },
  {
    id: "6",
    userId: "user-1",
    description: "Meralco Bill Payment",
    amount: "3450.00",
    type: "EXPENSE",
    category: "Bills & Utilities",
    date: "2024-01-06",
    status: "COMPLETED",
    notes: "December electricity bill",
    tags: ["bills", "utilities"],
    isRecurring: true,
    accountId: "2",
    paymentId: "pay-3",
    createdAt: "2024-01-06T16:30:00Z",
    updatedAt: "2024-01-06T16:30:00Z",
  },
];

const mockPayments: Payment[] = [
  {
    id: "pay-1",
    userId: "user-1",
    name: "Monthly Salary",
    description: "Regular salary deposit",
    amount: "45000.00",
    type: "INCOME",
    category: "Salary",
    accountId: "1",
    startDate: "2023-01-01",
    status: "ACTIVE",
    isManual: false,
    recurrenceRule: {
      id: "rr-1",
      frequency: "MONTHLY",
      interval: 1,
      monthlyDayOfMonth: 9,
    },
    createdAt: "2023-01-01T10:00:00Z",
    updatedAt: "2024-01-09T08:00:00Z",
  },
  {
    id: "pay-2",
    userId: "user-1",
    name: "Netflix Subscription",
    amount: "549.00",
    type: "EXPENSE",
    category: "Entertainment",
    accountId: "3",
    startDate: "2023-06-01",
    status: "ACTIVE",
    isManual: false,
    recurrenceRule: {
      id: "rr-2",
      frequency: "MONTHLY",
      interval: 1,
      monthlyDayOfMonth: 7,
    },
    createdAt: "2023-06-01T10:00:00Z",
    updatedAt: "2024-01-07T14:20:00Z",
  },
  {
    id: "pay-3",
    userId: "user-1",
    name: "Meralco Bill",
    description: "Monthly electricity bill",
    amount: "3450.00",
    type: "EXPENSE",
    category: "Bills & Utilities",
    accountId: "2",
    startDate: "2022-01-01",
    status: "ACTIVE",
    isManual: true,
    recurrenceRule: {
      id: "rr-3",
      frequency: "MONTHLY",
      interval: 1,
      monthlyDayOfMonth: 6,
    },
    createdAt: "2022-01-01T10:00:00Z",
    updatedAt: "2024-01-06T16:30:00Z",
  },
];

const initialState: TransactionState = {
  transactions: mockTransactions,
  payments: mockPayments,
  selectedTransaction: null,
  selectedPayment: null,
  loading: false,
  error: null,
  filters: {},
};

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Transactions
      setTransactions: (transactions) => {
        set({ transactions, error: null });
      },

      addTransaction: (transactionData) => {
        const newTransaction: Transaction = {
          ...transactionData,
          id: Math.random().toString(36).substring(7),
          userId: "user-1",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
          error: null,
        }));
      },

      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map((transaction) =>
            transaction.id === id
              ? {
                  ...transaction,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : transaction
          ),
          selectedTransaction:
            state.selectedTransaction?.id === id
              ? {
                  ...state.selectedTransaction,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : state.selectedTransaction,
          error: null,
        }));
      },

      removeTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter(
            (transaction) => transaction.id !== id
          ),
          selectedTransaction:
            state.selectedTransaction?.id === id
              ? null
              : state.selectedTransaction,
          error: null,
        }));
      },

      // Payments
      setPayments: (payments) => {
        set({ payments, error: null });
      },

      addPayment: (paymentData) => {
        const newPayment: Payment = {
          ...paymentData,
          id: Math.random().toString(36).substring(7),
          userId: "user-1",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          payments: [...state.payments, newPayment],
          error: null,
        }));
      },

      updatePayment: (id, updates) => {
        set((state) => ({
          payments: state.payments.map((payment) =>
            payment.id === id
              ? { ...payment, ...updates, updatedAt: new Date().toISOString() }
              : payment
          ),
          selectedPayment:
            state.selectedPayment?.id === id
              ? {
                  ...state.selectedPayment,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : state.selectedPayment,
          error: null,
        }));
      },

      removePayment: (id) => {
        set((state) => ({
          payments: state.payments.filter((payment) => payment.id !== id),
          selectedPayment:
            state.selectedPayment?.id === id ? null : state.selectedPayment,
          error: null,
        }));
      },

      // Selection
      setSelectedTransaction: (transaction) => {
        set({ selectedTransaction: transaction });
      },

      setSelectedPayment: (payment) => {
        set({ selectedPayment: payment });
      },

      // Filters
      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }));
      },

      clearFilters: () => {
        set({ filters: {} });
      },

      // Utility
      setLoading: (loading) => {
        set({ loading });
      },

      setError: (error) => {
        set({ error });
      },

      getTransactionsByDateRange: (from, to) => {
        const { transactions } = get();
        return transactions.filter((transaction) => {
          const transactionDate = new Date(transaction.date);
          const fromDate = new Date(from);
          const toDate = new Date(to);
          return transactionDate >= fromDate && transactionDate <= toDate;
        });
      },

      getTransactionsByAccount: (accountId) => {
        const { transactions } = get();
        return transactions.filter(
          (transaction) =>
            transaction.accountId === accountId ||
            transaction.fromAccountId === accountId ||
            transaction.toAccountId === accountId
        );
      },

      getTransactionsByCategory: (category) => {
        const { transactions } = get();
        return transactions.filter(
          (transaction) => transaction.category === category
        );
      },

      getTotalByType: (type, dateRange) => {
        const { transactions } = get();
        let filteredTransactions = transactions.filter(
          (transaction) =>
            transaction.type === type && transaction.status === "COMPLETED"
        );

        if (dateRange) {
          filteredTransactions = filteredTransactions.filter((transaction) => {
            const transactionDate = new Date(transaction.date);
            const fromDate = new Date(dateRange.from);
            const toDate = new Date(dateRange.to);
            return transactionDate >= fromDate && transactionDate <= toDate;
          });
        }

        return filteredTransactions.reduce(
          (total, transaction) => total + parseFloat(transaction.amount),
          0
        );
      },
    }),
    {
      name: "wais-transactions",
      partialize: (state) => ({
        transactions: state.transactions,
        payments: state.payments,
      }),
    }
  )
);
