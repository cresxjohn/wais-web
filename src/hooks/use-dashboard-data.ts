import { useQuery, useQueries } from "@tanstack/react-query";
import {
  graphqlClient,
  QUERIES,
  type DashboardData,
  type Account,
  type Payment,
  type MeResponse,
  decodeJWT,
  isTokenExpired,
} from "@/lib/graphql-client";

/**
 * Hook to fetch user profile data
 */
export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      // Debug JWT token before making request
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("wais_access_token");
        if (token) {
          const decoded = decodeJWT(token);
          console.log("JWT payload:", decoded);
          console.log("Is token expired?", isTokenExpired(token));
        } else {
          console.log("No JWT token found in localStorage");
        }
      }

      const result = await graphqlClient.request<{ me: MeResponse }>(
        QUERIES.ME
      );
      console.log("ME query result:", result);
      return result;
    },
    select: (data) => data.me,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    retry: (failureCount, error) => {
      console.error("ME query error:", error);
      // Don't retry auth failures
      if (
        error.message.includes("401") ||
        error.message.includes("unauthorized") ||
        error.message.includes("Unauthorized")
      ) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

/**
 * Hook to fetch user accounts
 */
export function useAccounts() {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: () =>
      graphqlClient.request<{ accounts: Account[] }>(QUERIES.ACCOUNTS),
    select: (data) => data.accounts,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
  });
}

/**
 * Hook to fetch upcoming payments
 */
export function useUpcomingPayments() {
  return useQuery({
    queryKey: ["payments", "upcoming"],
    queryFn: () =>
      graphqlClient.request<{ findUpcomingPayments: Payment[] }>(
        QUERIES.UPCOMING_PAYMENTS
      ),
    select: (data) => data.findUpcomingPayments,
    staleTime: 1000 * 60 * 3, // 3 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Hook to fetch all payments
 */
export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: () =>
      graphqlClient.request<{ findPayments: Payment[] }>(QUERIES.PAYMENTS),
    select: (data) => data.findPayments,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
  });
}

/**
 * Optimized hook to fetch all dashboard data in parallel
 * This reduces the number of requests and improves load time
 */
export function useDashboardData() {
  const queries = useQueries({
    queries: [
      {
        queryKey: ["me"],
        queryFn: () => graphqlClient.request<{ me: MeResponse }>(QUERIES.ME),
        select: (data: any) => data.me,
        staleTime: 1000 * 60 * 10, // 10 minutes
      },
      {
        queryKey: ["accounts"],
        queryFn: () =>
          graphqlClient.request<{ accounts: Account[] }>(QUERIES.ACCOUNTS),
        select: (data: any) => data.accounts,
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
      {
        queryKey: ["payments", "upcoming"],
        queryFn: () =>
          graphqlClient.request<{ findUpcomingPayments: Payment[] }>(
            QUERIES.UPCOMING_PAYMENTS
          ),
        select: (data: any) => data.findUpcomingPayments,
        staleTime: 1000 * 60 * 3, // 3 minutes
      },
    ],
  });

  const [meQuery, accountsQuery, paymentsQuery] = queries;

  return {
    me: {
      data: meQuery.data,
      isLoading: meQuery.isLoading,
      error: meQuery.error,
    },
    accounts: {
      data: accountsQuery.data || [],
      isLoading: accountsQuery.isLoading,
      error: accountsQuery.error,
    },
    payments: {
      data: paymentsQuery.data || [],
      isLoading: paymentsQuery.isLoading,
      error: paymentsQuery.error,
    },
    // Combined loading state
    isLoading: queries.some((query) => query.isLoading),
    // Any error from any query
    error: queries.find((query) => query.error)?.error,
    // All queries successful
    isSuccess: queries.every((query) => query.isSuccess),
  };
}

/**
 * Hook for optimized single dashboard data fetch (alternative approach)
 * Uses a single GraphQL query to fetch all dashboard data at once
 */
export function useDashboardDataSingle() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => graphqlClient.request<DashboardData>(QUERIES.DASHBOARD_DATA),
    staleTime: 1000 * 60 * 3, // 3 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    // Transform data to match component expectations
    select: (data) => ({
      me: data.me,
      accounts: data.accounts || [],
      payments: data.findUpcomingPayments || [],
    }),
  });
}

/**
 * Calculate net worth from accounts
 * Note: Current Account schema doesn't include balance, so this returns a placeholder
 */
export function useNetWorth(accounts: Account[] = []) {
  // TODO: Update when balance field is added to Account schema
  const netWorth = 0; // Placeholder since Account doesn't have balance field yet

  return {
    total: netWorth,
    formatted: new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(netWorth),
    accountCount: accounts.length,
  };
}

/**
 * Get accounts by type for better organization
 */
export function useAccountsByType(accounts: Account[] = []) {
  const accountsByType = accounts.reduce((acc, account) => {
    const type = account.type.toLowerCase();
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(account);
    return acc;
  }, {} as Record<string, Account[]>);

  return {
    cash: accountsByType.cash || [],
    savings: accountsByType.savings || [],
    checking: accountsByType.checking || [],
    credit_card: accountsByType.credit_card || [],
    loan: accountsByType.loan || [],
    insurance: accountsByType.insurance || [],
  };
}

/**
 * Format currency values consistently
 */
export function formatCurrency(amount: number, currency = "PHP") {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format account balance with proper styling for negative values
 * Note: Current Account schema doesn't include balance/currency, so this returns a placeholder
 */
export function formatAccountBalance(account: Account) {
  // TODO: Update when balance and currency fields are added to Account schema
  const balance = 0; // Placeholder since Account doesn't have balance field yet
  const currency = "PHP"; // Default currency
  const isNegative = false;

  return {
    value: balance,
    formatted: formatCurrency(Math.abs(balance), currency),
    isNegative,
    className: isNegative ? "text-red-600" : "text-gray-900",
    accountName: account.name,
    accountType: account.type,
  };
}
