"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  budgetAmount: number;
  spentAmount: number;
  description: string;
  isActive: boolean;
  alertThreshold: number; // percentage (0-100)
  isRecurring: boolean;
  period: "weekly" | "monthly" | "yearly";
  createdAt: string;
  updatedAt: string;
}

export interface BudgetTransaction {
  id: string;
  categoryId: string;
  amount: number;
  description: string;
  merchant: string;
  date: string;
  type: "expense" | "income";
  tags: string[];
  isRecurring: boolean;
  recurringId?: string;
}

export interface BudgetAlert {
  id: string;
  categoryId: string;
  type: "warning" | "exceeded" | "approaching";
  message: string;
  percentage: number;
  date: string;
  isRead: boolean;
}

export interface BudgetTemplate {
  id: string;
  name: string;
  description: string;
  categories: Omit<BudgetCategory, "id" | "createdAt" | "updatedAt">[];
  totalBudget: number;
  isDefault: boolean;
}

interface BudgetStore {
  categories: BudgetCategory[];
  transactions: BudgetTransaction[];
  alerts: BudgetAlert[];
  templates: BudgetTemplate[];
  selectedCategory: BudgetCategory | null;
  currentPeriod: string; // YYYY-MM format
  isLoading: boolean;

  // Actions
  setCategories: (categories: BudgetCategory[]) => void;
  addCategory: (
    category: Omit<BudgetCategory, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateCategory: (id: string, updates: Partial<BudgetCategory>) => void;
  deleteCategory: (id: string) => void;
  setSelectedCategory: (category: BudgetCategory | null) => void;

  addTransaction: (transaction: Omit<BudgetTransaction, "id">) => void;
  updateTransaction: (id: string, updates: Partial<BudgetTransaction>) => void;
  deleteTransaction: (id: string) => void;

  addAlert: (alert: Omit<BudgetAlert, "id">) => void;
  markAlertAsRead: (id: string) => void;
  clearAllAlerts: () => void;

  setCurrentPeriod: (period: string) => void;
  setLoading: (loading: boolean) => void;

  // Computed
  getTotalBudget: () => number;
  getTotalSpent: () => number;
  getRemainingBudget: () => number;
  getBudgetUtilization: () => number;
  getCategoryProgress: (categoryId: string) => number;
  getCategoryTransactions: (categoryId: string) => BudgetTransaction[];
  getUnreadAlerts: () => BudgetAlert[];
  getCategoryAlerts: (categoryId: string) => BudgetAlert[];
  getSpendingTrend: () => { period: string; amount: number }[];
  getTopSpendingCategories: () => {
    category: BudgetCategory;
    amount: number;
    percentage: number;
  }[];
}

// Mock data
const mockCategories: BudgetCategory[] = [
  {
    id: "1",
    name: "Food & Dining",
    icon: "🍽️",
    color: "from-green-500 to-emerald-500",
    budgetAmount: 15000,
    spentAmount: 12450.75,
    description: "Restaurants, groceries, food delivery",
    isActive: true,
    alertThreshold: 80,
    isRecurring: true,
    period: "monthly",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2025-01-05T14:30:00Z",
  },
  {
    id: "2",
    name: "Transportation",
    icon: "🚗",
    color: "from-blue-500 to-cyan-500",
    budgetAmount: 8000,
    spentAmount: 6890.25,
    description: "Gas, parking, public transport, ride-sharing",
    isActive: true,
    alertThreshold: 75,
    isRecurring: true,
    period: "monthly",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2025-01-04T10:15:00Z",
  },
  {
    id: "3",
    name: "Entertainment",
    icon: "🎬",
    color: "from-purple-500 to-violet-500",
    budgetAmount: 5000,
    spentAmount: 5250.0,
    description: "Movies, games, concerts, streaming services",
    isActive: true,
    alertThreshold: 90,
    isRecurring: true,
    period: "monthly",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2025-01-03T16:45:00Z",
  },
  {
    id: "4",
    name: "Shopping",
    icon: "🛍️",
    color: "from-pink-500 to-rose-500",
    budgetAmount: 10000,
    spentAmount: 7825.5,
    description: "Clothing, electronics, online purchases",
    isActive: true,
    alertThreshold: 85,
    isRecurring: true,
    period: "monthly",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2025-01-02T12:20:00Z",
  },
  {
    id: "5",
    name: "Healthcare",
    icon: "🏥",
    color: "from-red-500 to-orange-500",
    budgetAmount: 3000,
    spentAmount: 1580.0,
    description: "Medical bills, medicines, health insurance",
    isActive: true,
    alertThreshold: 70,
    isRecurring: true,
    period: "monthly",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-12-28T09:00:00Z",
  },
  {
    id: "6",
    name: "Utilities",
    icon: "💡",
    color: "from-yellow-500 to-amber-500",
    budgetAmount: 4500,
    spentAmount: 4120.8,
    description: "Electricity, water, internet, phone",
    isActive: true,
    alertThreshold: 95,
    isRecurring: true,
    period: "monthly",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2025-01-01T08:30:00Z",
  },
  {
    id: "7",
    name: "Education",
    icon: "📚",
    color: "from-indigo-500 to-blue-500",
    budgetAmount: 6000,
    spentAmount: 2450.0,
    description: "Courses, books, training, certifications",
    isActive: true,
    alertThreshold: 75,
    isRecurring: true,
    period: "monthly",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-12-15T13:45:00Z",
  },
  {
    id: "8",
    name: "Miscellaneous",
    icon: "🎯",
    color: "from-gray-500 to-slate-500",
    budgetAmount: 2500,
    spentAmount: 1890.45,
    description: "Other expenses and unclassified items",
    isActive: true,
    alertThreshold: 100,
    isRecurring: true,
    period: "monthly",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-12-20T11:10:00Z",
  },
];

const mockTransactions: BudgetTransaction[] = [
  {
    id: "1",
    categoryId: "1",
    amount: 1250.0,
    description: "Jollibee family dinner",
    merchant: "Jollibee",
    date: "2025-01-05T19:30:00Z",
    type: "expense",
    tags: ["fast-food", "family"],
    isRecurring: false,
  },
  {
    id: "2",
    categoryId: "1",
    amount: 3500.75,
    description: "SM Hypermart groceries",
    merchant: "SM Hypermart",
    date: "2025-01-04T14:20:00Z",
    type: "expense",
    tags: ["groceries", "weekly-shopping"],
    isRecurring: false,
  },
  {
    id: "3",
    categoryId: "2",
    amount: 800.0,
    description: "Gas refill",
    merchant: "Shell",
    date: "2025-01-03T08:15:00Z",
    type: "expense",
    tags: ["gas", "car"],
    isRecurring: false,
  },
  {
    id: "4",
    categoryId: "3",
    amount: 549.0,
    description: "Netflix monthly subscription",
    merchant: "Netflix",
    date: "2025-01-01T00:00:00Z",
    type: "expense",
    tags: ["streaming", "subscription"],
    isRecurring: true,
    recurringId: "netflix-monthly",
  },
  {
    id: "5",
    categoryId: "4",
    amount: 2850.0,
    description: "Uniqlo winter clothes",
    merchant: "Uniqlo",
    date: "2024-12-30T16:45:00Z",
    type: "expense",
    tags: ["clothing", "winter"],
    isRecurring: false,
  },
  {
    id: "6",
    categoryId: "6",
    amount: 2890.8,
    description: "Electricity bill",
    merchant: "Meralco",
    date: "2024-12-28T10:00:00Z",
    type: "expense",
    tags: ["utilities", "electricity"],
    isRecurring: true,
    recurringId: "electricity-monthly",
  },
];

const mockAlerts: BudgetAlert[] = [
  {
    id: "1",
    categoryId: "3",
    type: "exceeded",
    message: "Entertainment budget exceeded by ₱250",
    percentage: 105,
    date: "2025-01-03T16:45:00Z",
    isRead: false,
  },
  {
    id: "2",
    categoryId: "6",
    type: "approaching",
    message: "Utilities budget is 91.6% used",
    percentage: 91.6,
    date: "2025-01-01T08:30:00Z",
    isRead: false,
  },
  {
    id: "3",
    categoryId: "1",
    type: "warning",
    message: "Food & Dining budget is 83% used",
    percentage: 83,
    date: "2024-12-30T14:20:00Z",
    isRead: true,
  },
];

const spendingTrendData = [
  { period: "Jul 2024", amount: 42500 },
  { period: "Aug 2024", amount: 38900 },
  { period: "Sep 2024", amount: 41200 },
  { period: "Oct 2024", amount: 44800 },
  { period: "Nov 2024", amount: 39600 },
  { period: "Dec 2024", amount: 46300 },
  { period: "Jan 2025", amount: 42456 },
];

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set, get) => ({
      categories: mockCategories,
      transactions: mockTransactions,
      alerts: mockAlerts,
      templates: [],
      selectedCategory: null,
      currentPeriod: "2025-01",
      isLoading: false,

      setCategories: (categories) => set({ categories }),
      addCategory: (category) => {
        const newCategory: BudgetCategory = {
          ...category,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ categories: [...state.categories, newCategory] }));
      },
      updateCategory: (id, updates) =>
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id
              ? { ...category, ...updates, updatedAt: new Date().toISOString() }
              : category
          ),
        })),
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
        })),
      setSelectedCategory: (category) => set({ selectedCategory: category }),

      addTransaction: (transaction) => {
        const newTransaction: BudgetTransaction = {
          ...transaction,
          id: Math.random().toString(36).substr(2, 9),
        };
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }));
      },
      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((transaction) =>
            transaction.id === id ? { ...transaction, ...updates } : transaction
          ),
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter(
            (transaction) => transaction.id !== id
          ),
        })),

      addAlert: (alert) => {
        const newAlert: BudgetAlert = {
          ...alert,
          id: Math.random().toString(36).substr(2, 9),
        };
        set((state) => ({ alerts: [newAlert, ...state.alerts] }));
      },
      markAlertAsRead: (id) =>
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === id ? { ...alert, isRead: true } : alert
          ),
        })),
      clearAllAlerts: () => set({ alerts: [] }),

      setCurrentPeriod: (period) => set({ currentPeriod: period }),
      setLoading: (isLoading) => set({ isLoading }),

      // Computed
      getTotalBudget: () => {
        const { categories } = get();
        return categories.reduce(
          (total, category) => total + category.budgetAmount,
          0
        );
      },
      getTotalSpent: () => {
        const { categories } = get();
        return categories.reduce(
          (total, category) => total + category.spentAmount,
          0
        );
      },
      getRemainingBudget: () => {
        return get().getTotalBudget() - get().getTotalSpent();
      },
      getBudgetUtilization: () => {
        const totalBudget = get().getTotalBudget();
        const totalSpent = get().getTotalSpent();
        return totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
      },
      getCategoryProgress: (categoryId) => {
        const { categories } = get();
        const category = categories.find((c) => c.id === categoryId);
        if (!category) return 0;
        return category.budgetAmount > 0
          ? (category.spentAmount / category.budgetAmount) * 100
          : 0;
      },
      getCategoryTransactions: (categoryId) => {
        const { transactions } = get();
        return transactions
          .filter((t) => t.categoryId === categoryId)
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
      },
      getUnreadAlerts: () => {
        const { alerts } = get();
        return alerts.filter((alert) => !alert.isRead);
      },
      getCategoryAlerts: (categoryId) => {
        const { alerts } = get();
        return alerts.filter((alert) => alert.categoryId === categoryId);
      },
      getSpendingTrend: () => spendingTrendData,
      getTopSpendingCategories: () => {
        const { categories } = get();
        const totalSpent = get().getTotalSpent();
        return categories
          .map((category) => ({
            category,
            amount: category.spentAmount,
            percentage:
              totalSpent > 0 ? (category.spentAmount / totalSpent) * 100 : 0,
          }))
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 5);
      },
    }),
    {
      name: "wais-budget",
      partialize: (state) => ({
        categories: state.categories,
        transactions: state.transactions,
        alerts: state.alerts,
        currentPeriod: state.currentPeriod,
      }),
    }
  )
);
