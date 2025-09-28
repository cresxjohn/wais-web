import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  balance: string;
  currency: string;
  status: AccountStatus;
  institution?: string;
  accountNumberLast4?: string;
  openedDate: string;
  excludeFromStats: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // Type-specific details
  savingsDetails?: SavingsDetails;
  creditDetails?: CreditDetails;
  loanDetails?: LoanDetails;
  insuranceDetails?: InsuranceDetails;
}

export type AccountType =
  | "CASH"
  | "SAVINGS"
  | "CHECKING"
  | "CREDIT_CARD"
  | "LINE_OF_CREDIT"
  | "INSURANCE"
  | "LOAN";

export type AccountStatus = "ACTIVE" | "INACTIVE" | "CLOSED";

export interface SavingsDetails {
  interestRatePerAnnum?: number;
  requiredMonthlyAdb?: string;
  requiredBalanceToEarnInterest?: string;
  totalInterestEarned?: string;
}

export interface CreditDetails {
  creditLimit: string;
  availableCredit: string;
  statementDate: number;
  dueDateDaysAfterStatement: number;
  financeChargeInterestRate: number;
  annualFeeAmount?: string;
  rewardsType?: "POINTS" | "MILES" | "CASH_BACK" | "REBATE" | "NONE";
  rewardsBalance?: string;
}

export interface LoanDetails {
  loanType:
    | "PERSONAL"
    | "AUTO"
    | "MORTGAGE"
    | "BUSINESS"
    | "SALARY"
    | "PAG_IBIG"
    | "SSS";
  originalPrincipal: string;
  interestRate: number;
  termMonths: number;
  remainingTermMonths?: number;
  maturityDate: string;
  nextPaymentDate: string;
  nextPaymentAmount: string;
}

export interface InsuranceDetails {
  policyType: "LIFE" | "HEALTH" | "AUTO" | "HOME" | "TRAVEL" | "VUL";
  policyNumber: string;
  coverageAmount: string;
  premiumAmount: string;
  premiumDueDate: string;
  deductible?: string;
  beneficiaries: string[];
}

interface AccountState {
  accounts: Account[];
  selectedAccount: Account | null;
  loading: boolean;
  error: string | null;
}

interface AccountActions {
  setAccounts: (accounts: Account[]) => void;
  addAccount: (
    account: Omit<Account, "id" | "userId" | "createdAt" | "updatedAt">
  ) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  removeAccount: (id: string) => void;
  setSelectedAccount: (account: Account | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getAccountsByType: (type: AccountType) => Account[];
  getTotalBalance: () => number;
  getAccountById: (id: string) => Account | undefined;
}

export type AccountStore = AccountState & AccountActions;

const initialState: AccountState = {
  accounts: [],
  selectedAccount: null,
  loading: false,
  error: null,
};

// Mock data for demonstration
const mockAccounts: Account[] = [
  {
    id: "1",
    userId: "user-1",
    name: "BPI Savings Account",
    type: "SAVINGS",
    balance: "45230.50",
    currency: "PHP",
    status: "ACTIVE",
    institution: "Bank of the Philippine Islands",
    accountNumberLast4: "1234",
    openedDate: "2023-01-15",
    excludeFromStats: false,
    notes: "Primary savings account",
    createdAt: "2023-01-15T10:00:00Z",
    updatedAt: "2024-01-10T15:30:00Z",
    savingsDetails: {
      interestRatePerAnnum: 2.5,
      requiredMonthlyAdb: "10000.00",
      requiredBalanceToEarnInterest: "5000.00",
      totalInterestEarned: "1250.75",
    },
  },
  {
    id: "2",
    userId: "user-1",
    name: "UnionBank Checking",
    type: "CHECKING",
    balance: "12450.25",
    currency: "PHP",
    status: "ACTIVE",
    institution: "UnionBank of the Philippines",
    accountNumberLast4: "5678",
    openedDate: "2023-03-20",
    excludeFromStats: false,
    createdAt: "2023-03-20T10:00:00Z",
    updatedAt: "2024-01-10T15:30:00Z",
  },
  {
    id: "3",
    userId: "user-1",
    name: "BDO Credit Card",
    type: "CREDIT_CARD",
    balance: "-8450.00",
    currency: "PHP",
    status: "ACTIVE",
    institution: "Banco de Oro",
    accountNumberLast4: "9876",
    openedDate: "2022-11-10",
    excludeFromStats: false,
    notes: "Gold rewards card",
    createdAt: "2022-11-10T10:00:00Z",
    updatedAt: "2024-01-10T15:30:00Z",
    creditDetails: {
      creditLimit: "50000.00",
      availableCredit: "41550.00",
      statementDate: 15,
      dueDateDaysAfterStatement: 20,
      financeChargeInterestRate: 3.5,
      annualFeeAmount: "2500.00",
      rewardsType: "POINTS",
      rewardsBalance: "15420",
    },
  },
  {
    id: "4",
    userId: "user-1",
    name: "Pag-IBIG Housing Loan",
    type: "LOAN",
    balance: "-125000.00",
    currency: "PHP",
    status: "ACTIVE",
    institution: "Pag-IBIG Fund",
    openedDate: "2021-06-15",
    excludeFromStats: false,
    notes: "Home acquisition loan",
    createdAt: "2021-06-15T10:00:00Z",
    updatedAt: "2024-01-10T15:30:00Z",
    loanDetails: {
      loanType: "PAG_IBIG",
      originalPrincipal: "1500000.00",
      interestRate: 7.5,
      termMonths: 360,
      remainingTermMonths: 330,
      maturityDate: "2051-06-15",
      nextPaymentDate: "2024-02-01",
      nextPaymentAmount: "12500.00",
    },
  },
  {
    id: "5",
    userId: "user-1",
    name: "Philam Life Insurance",
    type: "INSURANCE",
    balance: "0.00",
    currency: "PHP",
    status: "ACTIVE",
    institution: "Philippine American Life",
    openedDate: "2022-08-01",
    excludeFromStats: true,
    notes: "Term life insurance",
    createdAt: "2022-08-01T10:00:00Z",
    updatedAt: "2024-01-10T15:30:00Z",
    insuranceDetails: {
      policyType: "LIFE",
      policyNumber: "PHL-2022-789456",
      coverageAmount: "1000000.00",
      premiumAmount: "8500.00",
      premiumDueDate: "2024-02-01",
      deductible: "0.00",
      beneficiaries: ["Maria Dela Cruz", "Juan Dela Cruz Jr."],
    },
  },
];

export const useAccountStore = create<AccountStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Initialize with mock data
      accounts: mockAccounts,

      setAccounts: (accounts) => {
        set({ accounts, error: null });
      },

      addAccount: (accountData) => {
        const newAccount: Account = {
          ...accountData,
          id: Math.random().toString(36).substring(7),
          userId: "user-1", // Mock user ID
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          accounts: [...state.accounts, newAccount],
          error: null,
        }));
      },

      updateAccount: (id, updates) => {
        set((state) => ({
          accounts: state.accounts.map((account) =>
            account.id === id
              ? { ...account, ...updates, updatedAt: new Date().toISOString() }
              : account
          ),
          selectedAccount:
            state.selectedAccount?.id === id
              ? {
                  ...state.selectedAccount,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : state.selectedAccount,
          error: null,
        }));
      },

      removeAccount: (id) => {
        set((state) => ({
          accounts: state.accounts.filter((account) => account.id !== id),
          selectedAccount:
            state.selectedAccount?.id === id ? null : state.selectedAccount,
          error: null,
        }));
      },

      setSelectedAccount: (account) => {
        set({ selectedAccount: account });
      },

      setLoading: (loading) => {
        set({ loading });
      },

      setError: (error) => {
        set({ error });
      },

      getAccountsByType: (type) => {
        return get().accounts.filter((account) => account.type === type);
      },

      getTotalBalance: () => {
        return get().accounts.reduce((total, account) => {
          if (account.excludeFromStats) return total;
          return total + parseFloat(account.balance);
        }, 0);
      },

      getAccountById: (id) => {
        return get().accounts.find((account) => account.id === id);
      },
    }),
    {
      name: "wais-accounts",
      partialize: (state) => ({
        accounts: state.accounts,
      }),
    }
  )
);
