import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  name?: string | null;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
}

export type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
};

// Function to get cookie value
const getCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

// Initialize state with tokens from cookies if available
const getInitialState = (): AuthState => {
  if (typeof window === "undefined") return initialState;

  const accessToken =
    getCookie("wais_access_token") || localStorage.getItem("wais_access_token");
  const refreshToken =
    getCookie("wais_refresh_token") ||
    localStorage.getItem("wais_refresh_token");

  return {
    ...initialState,
    accessToken,
    refreshToken,
    isAuthenticated: !!accessToken,
  };
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...getInitialState(),

      setAuth: (user, accessToken, refreshToken) => {
        // Store tokens in localStorage for Apollo Client
        if (typeof window !== "undefined") {
          localStorage.setItem("wais_access_token", accessToken);
          localStorage.setItem("wais_refresh_token", refreshToken);
        }

        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      clearAuth: () => {
        // Clear tokens from localStorage and cookies
        if (typeof window !== "undefined") {
          localStorage.removeItem("wais_access_token");
          localStorage.removeItem("wais_refresh_token");

          // Clear cookies by setting them to expire in the past
          document.cookie =
            "wais_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; sameSite=strict";
          document.cookie =
            "wais_refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; sameSite=strict";
        }

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setUser: (user) => {
        set({ user });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setTokens: (accessToken, refreshToken) => {
        // Update tokens in localStorage and cookies
        if (typeof window !== "undefined") {
          localStorage.setItem("wais_access_token", accessToken);
          localStorage.setItem("wais_refresh_token", refreshToken);

          // Set cookies for middleware access (7 days expiry)
          const expires = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toUTCString();
          document.cookie = `wais_access_token=${accessToken}; expires=${expires}; path=/; sameSite=strict; secure=${
            location.protocol === "https:"
          }`;
          document.cookie = `wais_refresh_token=${refreshToken}; expires=${expires}; path=/; sameSite=strict; secure=${
            location.protocol === "https:"
          }`;
        }

        set({ accessToken, refreshToken });
      },

      updateTokens: (accessToken, refreshToken) => {
        // Update tokens in localStorage and cookies
        if (typeof window !== "undefined") {
          localStorage.setItem("wais_access_token", accessToken);
          localStorage.setItem("wais_refresh_token", refreshToken);

          // Update cookies for middleware access (7 days expiry)
          const expires = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toUTCString();
          document.cookie = `wais_access_token=${accessToken}; expires=${expires}; path=/; sameSite=strict; secure=${
            location.protocol === "https:"
          }`;
          document.cookie = `wais_refresh_token=${refreshToken}; expires=${expires}; path=/; sameSite=strict; secure=${
            location.protocol === "https:"
          }`;
        }

        set({ accessToken, refreshToken });
      },
    }),
    {
      name: "wais-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
