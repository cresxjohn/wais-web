import { GraphQLClient } from "graphql-request";
import { config } from "./config";

class GraphQLClientManager {
  private client: GraphQLClient;

  constructor() {
    this.client = new GraphQLClient(config.graphqlEndpoint, {
      headers: {
        // Add CSRF protection header to prevent Apollo Server blocking
        "x-apollo-operation-name": "GraphQLRequest",
      },
      // Enable request/response interceptors for better error handling
      requestMiddleware: (request: any) => {
        // Add auth token if available
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("wais_access_token");

          if (token) {
            // Check if token is expired
            if (isTokenExpired(token)) {
              console.warn("JWT token is expired, clearing from localStorage");
              localStorage.removeItem("wais_access_token");
              localStorage.removeItem("wais_refresh_token");
              // Don't add expired token to request
            } else {
              request.headers = {
                ...request.headers,
                authorization: `Bearer ${token}`,
                // Ensure CSRF protection header is always present
                "x-apollo-operation-name": "GraphQLRequest",
              };
            }
          }

          // Always include CSRF protection header
          if (!request.headers["x-apollo-operation-name"]) {
            request.headers = {
              ...request.headers,
              "x-apollo-operation-name": "GraphQLRequest",
            };
          }
        }

        return request;
      },
      responseMiddleware: (response: any) => {
        // Handle auth errors globally
        if (response instanceof Error && response.message.includes("401")) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("wais_access_token");
            localStorage.removeItem("wais_refresh_token");
            window.location.href = "/auth/login";
          }
        }
      },
    });
  }

  /**
   * Execute a GraphQL query/mutation
   */
  async request<T = any>(query: string, variables?: any): Promise<T> {
    try {
      return await this.client.request<T>(query, variables);
    } catch (error: any) {
      // Enhanced error handling
      if (error.response?.errors) {
        const graphQLError = error.response.errors[0];
        throw new Error(graphQLError.message || "GraphQL error occurred");
      }

      if (error.response?.status === 401) {
        // Handle unauthorized access
        if (typeof window !== "undefined") {
          localStorage.removeItem("wais_access_token");
          localStorage.removeItem("wais_refresh_token");
          window.location.href = "/auth/login";
        }
        throw new Error("Session expired. Please login again.");
      }

      if (error.response?.status >= 500) {
        throw new Error("Server error. Please try again later.");
      }

      throw new Error(error.message || "Network error occurred");
    }
  }

  /**
   * Set authorization header manually (useful for SSR)
   */
  setAuthToken(token: string) {
    this.client.setHeader("authorization", `Bearer ${token}`);
    this.client.setHeader("x-apollo-operation-name", "GraphQLRequest");
  }

  /**
   * Clear authorization header
   */
  clearAuthToken() {
    this.client.setHeader("authorization", "");
    // Keep CSRF protection header even when clearing auth
    this.client.setHeader("x-apollo-operation-name", "GraphQLRequest");
  }

  /**
   * Get the underlying GraphQL client for advanced usage
   */
  getClient() {
    return this.client;
  }
}

// Create a singleton instance
export const graphqlClient = new GraphQLClientManager();

/**
 * Utility function to decode JWT token payload (for debugging)
 */
export function decodeJWT(token: string): any {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

/**
 * Check if JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return decoded.exp < now;
}

// GraphQL queries and mutations
export const QUERIES = {
  ME: `
    query Me {
      me {
        id
        name
        email
      }
    }
  `,

  ACCOUNTS: `
    query Accounts {
      accounts {
        id
        name
        type
        notes
        createdAt
        updatedAt
      }
    }
  `,

  DASHBOARD_DATA: `
    query DashboardData {
      me {
        id
        name
        email
      }
      accounts {
        id
        name
        type
        notes
        createdAt
        updatedAt
      }
      findUpcomingPayments {
        id
        name
        amount
        type
        category
        notes
        createdAt
        updatedAt
      }
    }
  `,

  PAYMENTS: `
    query Payments {
      findPayments {
        id
        name
        amount
        type
        category
        tags
        notes
        accountId
        fromAccountId
        toAccountId
        createdAt
        updatedAt
      }
    }
  `,

  UPCOMING_PAYMENTS: `
    query UpcomingPayments {
      findUpcomingPayments {
        id
        name
        amount
        type
        category
        tags
        notes
        accountId
        createdAt
        updatedAt
      }
    }
  `,
} as const;

export const MUTATIONS = {
  SIGN_UP: `
    mutation SignUp($signUpInput: SignUpInput!) {
      signUp(signUpInput: $signUpInput) {
        accessToken
        refreshToken
      }
    }
  `,

  SIGN_IN: `
    mutation SignIn($signInInput: SignInInput!) {
      signIn(signInInput: $signInInput) {
        accessToken
        refreshToken
      }
    }
  `,

  REFRESH_TOKEN: `
    mutation RefreshToken($token: String!) {
      refreshToken(token: $token) {
        accessToken
        refreshToken
      }
    }
  `,

  LOGOUT: `
    mutation Logout {
      logout
    }
  `,

  CREATE_ACCOUNT: `
    mutation CreateAccount($createAccountInput: CreateAccountInput!) {
      createAccount(createAccountInput: $createAccountInput) {
        id
        name
        type
        notes
        createdAt
        updatedAt
      }
    }
  `,

  UPDATE_ACCOUNT: `
    mutation UpdateAccount($updateAccountInput: UpdateAccountInput!) {
      updateAccount(updateAccountInput: $updateAccountInput) {
        id
        name
        type
        notes
        updatedAt
      }
    }
  `,
} as const;

// Import and re-export codegen types
import type {
  Account as GQLAccount,
  Payment as GQLPayment,
  MeResponse as GQLMeResponse,
  SignUpInput as GQLSignUpInput,
  SignInInput as GQLSignInInput,
  AuthTokenResponse as GQLAuthTokenResponse,
} from "@/gql/graphql";

export type Account = GQLAccount;
export type Payment = GQLPayment;
export type MeResponse = GQLMeResponse;
export type SignUpInput = GQLSignUpInput;
export type SignInInput = GQLSignInInput;
export type AuthResponse = GQLAuthTokenResponse;

export type DashboardData = {
  me: MeResponse;
  accounts: Account[];
  findUpcomingPayments: Payment[];
};
