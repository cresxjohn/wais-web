"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SavingsGoal {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category:
    | "emergency"
    | "vacation"
    | "house"
    | "car"
    | "education"
    | "retirement"
    | "other";
  priority: "high" | "medium" | "low";
  autoSave: boolean;
  autoSaveAmount: number;
  autoSaveFrequency: "daily" | "weekly" | "monthly";
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  color: string;
  icon: string;
}

export interface SavingsTransaction {
  id: string;
  goalId: string;
  amount: number;
  type: "deposit" | "withdrawal";
  description: string;
  date: string;
  isAutomatic: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  goalId?: string;
}

export interface SavingsChallenge {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  duration: number; // days
  participants: number;
  reward: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

interface SavingsGoalsStore {
  goals: SavingsGoal[];
  transactions: SavingsTransaction[];
  achievements: Achievement[];
  challenges: SavingsChallenge[];
  selectedGoal: SavingsGoal | null;
  isLoading: boolean;

  // Actions
  setGoals: (goals: SavingsGoal[]) => void;
  addGoal: (goal: Omit<SavingsGoal, "id" | "createdAt" | "updatedAt">) => void;
  updateGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  deleteGoal: (id: string) => void;
  setSelectedGoal: (goal: SavingsGoal | null) => void;

  addTransaction: (transaction: Omit<SavingsTransaction, "id">) => void;
  addToGoal: (
    goalId: string,
    amount: number,
    description: string,
    isAutomatic?: boolean
  ) => void;
  withdrawFromGoal: (
    goalId: string,
    amount: number,
    description: string
  ) => void;

  unlockAchievement: (
    achievement: Omit<Achievement, "id" | "unlockedAt">
  ) => void;
  setLoading: (loading: boolean) => void;

  // Computed
  getTotalSaved: () => number;
  getTotalTargetAmount: () => number;
  getOverallProgress: () => number;
  getGoalProgress: (goalId: string) => number;
  getGoalTransactions: (goalId: string) => SavingsTransaction[];
  getCompletedGoals: () => SavingsGoal[];
  getActiveGoals: () => SavingsGoal[];
  getMonthlyAutoSaveTotal: () => number;
}

// Mock data
const mockGoals: SavingsGoal[] = [
  {
    id: "1",
    name: "Emergency Fund",
    description: "6 months of living expenses for financial security",
    targetAmount: 180000,
    currentAmount: 125000,
    targetDate: "2025-08-01",
    category: "emergency",
    priority: "high",
    autoSave: true,
    autoSaveAmount: 5000,
    autoSaveFrequency: "monthly",
    isCompleted: false,
    createdAt: "2024-06-01T10:00:00Z",
    updatedAt: "2025-01-05T14:30:00Z",
    color: "from-red-500 to-orange-500",
    icon: "🚨",
  },
  {
    id: "2",
    name: "Japan Vacation 2025",
    description: "Dream trip to Tokyo, Osaka, and Kyoto with family",
    targetAmount: 85000,
    currentAmount: 62500,
    targetDate: "2025-11-01",
    category: "vacation",
    priority: "medium",
    autoSave: true,
    autoSaveAmount: 3000,
    autoSaveFrequency: "monthly",
    isCompleted: false,
    createdAt: "2024-08-15T09:00:00Z",
    updatedAt: "2025-01-04T11:20:00Z",
    color: "from-pink-500 to-rose-500",
    icon: "🗾",
  },
  {
    id: "3",
    name: "House Down Payment",
    description: "20% down payment for our first home in BGC",
    targetAmount: 600000,
    currentAmount: 315000,
    targetDate: "2026-06-01",
    category: "house",
    priority: "high",
    autoSave: true,
    autoSaveAmount: 12000,
    autoSaveFrequency: "monthly",
    isCompleted: false,
    createdAt: "2024-03-20T16:45:00Z",
    updatedAt: "2025-01-02T08:15:00Z",
    color: "from-blue-500 to-indigo-500",
    icon: "🏠",
  },
  {
    id: "4",
    name: "New MacBook Pro",
    description: "M3 MacBook Pro for work and development",
    targetAmount: 120000,
    currentAmount: 120000,
    targetDate: "2024-12-25",
    category: "other",
    priority: "low",
    autoSave: false,
    autoSaveAmount: 0,
    autoSaveFrequency: "monthly",
    isCompleted: true,
    completedAt: "2024-12-20T12:00:00Z",
    createdAt: "2024-09-10T14:30:00Z",
    updatedAt: "2024-12-20T12:00:00Z",
    color: "from-gray-500 to-gray-600",
    icon: "💻",
  },
  {
    id: "5",
    name: "Wedding Fund",
    description: "Dream wedding celebration with 150 guests",
    targetAmount: 350000,
    currentAmount: 95000,
    targetDate: "2025-12-01",
    category: "other",
    priority: "high",
    autoSave: true,
    autoSaveAmount: 8000,
    autoSaveFrequency: "monthly",
    isCompleted: false,
    createdAt: "2024-04-12T18:20:00Z",
    updatedAt: "2025-01-01T10:00:00Z",
    color: "from-purple-500 to-violet-500",
    icon: "💍",
  },
];

const mockTransactions: SavingsTransaction[] = [
  {
    id: "1",
    goalId: "1",
    amount: 5000,
    type: "deposit",
    description: "Monthly auto-save",
    date: "2025-01-01T00:00:00Z",
    isAutomatic: true,
  },
  {
    id: "2",
    goalId: "2",
    amount: 10000,
    type: "deposit",
    description: "Holiday bonus allocation",
    date: "2024-12-30T15:30:00Z",
    isAutomatic: false,
  },
  {
    id: "3",
    goalId: "3",
    amount: 15000,
    type: "deposit",
    description: "Year-end savings boost",
    date: "2024-12-28T20:45:00Z",
    isAutomatic: false,
  },
  {
    id: "4",
    goalId: "1",
    amount: 2000,
    type: "withdrawal",
    description: "Emergency car repair",
    date: "2024-12-15T11:20:00Z",
    isAutomatic: false,
  },
  {
    id: "5",
    goalId: "5",
    amount: 8000,
    type: "deposit",
    description: "Monthly auto-save",
    date: "2024-12-01T00:00:00Z",
    isAutomatic: true,
  },
];

const mockAchievements: Achievement[] = [
  {
    id: "1",
    name: "First Goal",
    description: "Created your first savings goal",
    icon: "🎯",
    unlockedAt: "2024-03-20T16:45:00Z",
    goalId: "3",
  },
  {
    id: "2",
    name: "Goal Crusher",
    description: "Completed your first savings goal",
    icon: "💪",
    unlockedAt: "2024-12-20T12:00:00Z",
    goalId: "4",
  },
  {
    id: "3",
    name: "Consistency King",
    description: "Made 10 consecutive auto-saves",
    icon: "👑",
    unlockedAt: "2024-11-01T08:30:00Z",
  },
  {
    id: "4",
    name: "Emergency Ready",
    description: "Built an emergency fund worth 3+ months expenses",
    icon: "🛡️",
    unlockedAt: "2024-10-15T14:20:00Z",
    goalId: "1",
  },
  {
    id: "5",
    name: "Big Dreamer",
    description: "Set a savings goal over ₱500,000",
    icon: "🌟",
    unlockedAt: "2024-06-01T10:00:00Z",
    goalId: "3",
  },
];

const mockChallenges: SavingsChallenge[] = [
  {
    id: "1",
    name: "52-Week Challenge",
    description: "Save an increasing amount each week for a year",
    targetAmount: 68900,
    duration: 365,
    participants: 2847,
    reward: "Exclusive badge and ₱500 bonus",
    isActive: true,
    startDate: "2025-01-01T00:00:00Z",
    endDate: "2025-12-31T23:59:59Z",
  },
  {
    id: "2",
    name: "No-Spend January",
    description: "Avoid unnecessary purchases for the entire month",
    targetAmount: 15000,
    duration: 31,
    participants: 1205,
    reward: "Mindful spender badge",
    isActive: true,
    startDate: "2025-01-01T00:00:00Z",
    endDate: "2025-01-31T23:59:59Z",
  },
  {
    id: "3",
    name: "Emergency Fund Sprint",
    description: "Build ₱50,000 emergency fund in 6 months",
    targetAmount: 50000,
    duration: 180,
    participants: 892,
    reward: "Emergency Hero badge",
    isActive: true,
    startDate: "2025-01-01T00:00:00Z",
    endDate: "2025-06-30T23:59:59Z",
  },
];

export const useSavingsGoalsStore = create<SavingsGoalsStore>()(
  persist(
    (set, get) => ({
      goals: mockGoals,
      transactions: mockTransactions,
      achievements: mockAchievements,
      challenges: mockChallenges,
      selectedGoal: null,
      isLoading: false,

      setGoals: (goals) => set({ goals }),
      addGoal: (goal) => {
        const newGoal: SavingsGoal = {
          ...goal,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ goals: [...state.goals, newGoal] }));
      },
      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id
              ? { ...goal, ...updates, updatedAt: new Date().toISOString() }
              : goal
          ),
        })),
      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        })),
      setSelectedGoal: (goal) => set({ selectedGoal: goal }),

      addTransaction: (transaction) => {
        const newTransaction: SavingsTransaction = {
          ...transaction,
          id: Math.random().toString(36).substr(2, 9),
        };
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }));
      },
      addToGoal: (goalId, amount, description, isAutomatic = false) => {
        const transaction: Omit<SavingsTransaction, "id"> = {
          goalId,
          amount,
          type: "deposit",
          description,
          date: new Date().toISOString(),
          isAutomatic,
        };
        get().addTransaction(transaction);
        get().updateGoal(goalId, {
          currentAmount:
            get().goals.find((g) => g.id === goalId)!.currentAmount + amount,
        });
      },
      withdrawFromGoal: (goalId, amount, description) => {
        const transaction: Omit<SavingsTransaction, "id"> = {
          goalId,
          amount,
          type: "withdrawal",
          description,
          date: new Date().toISOString(),
          isAutomatic: false,
        };
        get().addTransaction(transaction);
        get().updateGoal(goalId, {
          currentAmount: Math.max(
            0,
            get().goals.find((g) => g.id === goalId)!.currentAmount - amount
          ),
        });
      },

      unlockAchievement: (achievement) => {
        const newAchievement: Achievement = {
          ...achievement,
          id: Math.random().toString(36).substr(2, 9),
          unlockedAt: new Date().toISOString(),
        };
        set((state) => ({
          achievements: [...state.achievements, newAchievement],
        }));
      },
      setLoading: (isLoading) => set({ isLoading }),

      // Computed
      getTotalSaved: () => {
        const { goals } = get();
        return goals.reduce((total, goal) => total + goal.currentAmount, 0);
      },
      getTotalTargetAmount: () => {
        const { goals } = get();
        return goals
          .filter((g) => !g.isCompleted)
          .reduce((total, goal) => total + goal.targetAmount, 0);
      },
      getOverallProgress: () => {
        const { goals } = get();
        const activeGoals = goals.filter((g) => !g.isCompleted);
        if (activeGoals.length === 0) return 100;
        const totalSaved = activeGoals.reduce(
          (total, goal) => total + goal.currentAmount,
          0
        );
        const totalTarget = activeGoals.reduce(
          (total, goal) => total + goal.targetAmount,
          0
        );
        return totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
      },
      getGoalProgress: (goalId) => {
        const { goals } = get();
        const goal = goals.find((g) => g.id === goalId);
        if (!goal) return 0;
        return goal.targetAmount > 0
          ? (goal.currentAmount / goal.targetAmount) * 100
          : 0;
      },
      getGoalTransactions: (goalId) => {
        const { transactions } = get();
        return transactions
          .filter((t) => t.goalId === goalId)
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
      },
      getCompletedGoals: () => {
        const { goals } = get();
        return goals.filter((goal) => goal.isCompleted);
      },
      getActiveGoals: () => {
        const { goals } = get();
        return goals.filter((goal) => !goal.isCompleted);
      },
      getMonthlyAutoSaveTotal: () => {
        const { goals } = get();
        return goals
          .filter(
            (goal) => goal.autoSave && goal.autoSaveFrequency === "monthly"
          )
          .reduce((total, goal) => total + goal.autoSaveAmount, 0);
      },
    }),
    {
      name: "wais-savings-goals",
      partialize: (state) => ({
        goals: state.goals,
        transactions: state.transactions,
        achievements: state.achievements,
      }),
    }
  )
);
