"use client";

import React from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { config } from "@/lib/config";

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
  };
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

// GraphQL mutation strings
const SIGN_UP_MUTATION = `
  mutation SignUp($signUpInput: SignUpInput!) {
    signUp(signUpInput: $signUpInput) {
      accessToken
      refreshToken
    }
  }
`;

const SIGN_IN_MUTATION = `
  mutation SignIn($signInInput: SignInInput!) {
    signIn(signInInput: $signInInput) {
      accessToken
      refreshToken
    }
  }
`;

const ME_QUERY = `
  query Me {
    me {
      id
      name
      email
    }
  }
`;

const REFRESH_TOKEN_MUTATION = `
  mutation RefreshToken($token: String!) {
    refreshToken(token: $token) {
      accessToken
      refreshToken
    }
  }
`;

const LOGOUT_MUTATION = `
  mutation Logout {
    logout
  }
`;

// GraphQL request helper
async function graphqlRequest(
  query: string,
  variables?: Record<string, any>,
  accessToken?: string
): Promise<any> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(config.graphqlEndpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0]?.message || "GraphQL error");
  }

  return result.data;
}

export function useAuth() {
  const router = useRouter();
  const {
    user,
    accessToken,
    refreshToken,
    isLoading,
    setUser,
    setTokens,
    setLoading,
    clearAuth,
  } = useAuthStore();

  const hasInitialized = React.useRef(false);

  // Initialize user profile when we have a token but no user (only run once per token)
  React.useEffect(() => {
    const fetchUserProfile = async () => {
      console.log("Auth Effect - State:", {
        accessToken: !!accessToken,
        user: !!user,
        isLoading,
        hasInitialized: hasInitialized.current,
      });

      if (accessToken && !user && !isLoading && !hasInitialized.current) {
        console.log("Auth Effect - Fetching user profile...");
        hasInitialized.current = true;
        setLoading(true);

        try {
          const data = await graphqlRequest(ME_QUERY, {}, accessToken);
          console.log("Auth Effect - ME_QUERY response:", data);

          if (data?.me) {
            setUser({
              id: data.me.id,
              name: data.me.name,
              email: data.me.email,
            });
            console.log("Auth Effect - User profile set successfully");
          } else {
            console.log(
              "Auth Effect - No user found in response, clearing auth"
            );
            clearAuth();
          }
        } catch (error) {
          console.error("Auth Effect - Failed to fetch user profile:", error);
          clearAuth();
        } finally {
          setLoading(false);
          console.log("Auth Effect - Loading set to false");
        }
      }
    };

    // Reset initialization flag when token changes
    if (!accessToken && hasInitialized.current) {
      console.log("Auth Effect - Resetting initialization flag");
      hasInitialized.current = false;
    }

    fetchUserProfile();
  }, [accessToken, user]); // Only depend on accessToken and user to avoid infinite loops

  // Safety timeout to prevent infinite loading
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn("Auth Effect - Safety timeout: forcing loading to false");
        setLoading(false);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [isLoading]);

  const signUp = async (data: SignUpData): Promise<AuthResult> => {
    setLoading(true);
    try {
      const variables = {
        signUpInput: {
          name: data.name,
          email: data.email,
          password: data.password,
        },
      };

      const result = await graphqlRequest(SIGN_UP_MUTATION, variables);

      if (result?.signUp) {
        const { accessToken, refreshToken } = result.signUp;
        setTokens(accessToken, refreshToken);

        // Fetch user profile after successful signup
        try {
          const userData = await graphqlRequest(ME_QUERY, {}, accessToken);
          if (userData?.me) {
            setUser({
              id: userData.me.id,
              name: userData.me.name,
              email: userData.me.email,
            });
          }
        } catch (error) {
          console.error("Failed to fetch user profile after signup:", error);
        }

        return { success: true };
      } else {
        return { success: false, error: "Failed to create account" };
      }
    } catch (error: any) {
      console.error("SignUp error:", error);
      return {
        success: false,
        error: error.message || "An unexpected error occurred",
      };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (data: SignInData): Promise<AuthResult> => {
    setLoading(true);
    try {
      const variables = {
        signInInput: {
          email: data.email,
          password: data.password,
        },
      };

      const result = await graphqlRequest(SIGN_IN_MUTATION, variables);

      if (result?.signIn) {
        const { accessToken, refreshToken } = result.signIn;
        setTokens(accessToken, refreshToken);

        // Fetch user profile after successful signin
        try {
          const userData = await graphqlRequest(ME_QUERY, {}, accessToken);
          if (userData?.me) {
            setUser({
              id: userData.me.id,
              name: userData.me.name,
              email: userData.me.email,
            });
          }
        } catch (error) {
          console.error("Failed to fetch user profile after signin:", error);
        }

        return { success: true };
      } else {
        return { success: false, error: "Invalid credentials" };
      }
    } catch (error: any) {
      console.error("SignIn error:", error);
      return {
        success: false,
        error: error.message || "Invalid credentials",
      };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<AuthResult> => {
    setLoading(true);
    try {
      // In a real implementation, you would use Google Sign-In SDK
      // For now, return a mock success to maintain the interface
      toast.info("Google Sign-In", {
        description: "Google authentication will be implemented soon.",
      });

      return { success: false, error: "Google Sign-In not yet implemented" };
    } catch (error: any) {
      console.error("Google SignIn error:", error);
      return {
        success: false,
        error: error.message || "Google sign-in failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const refreshTokens = async (): Promise<AuthResult> => {
    if (!refreshToken) {
      return { success: false, error: "No refresh token available" };
    }

    try {
      const variables = { token: refreshToken };
      const result = await graphqlRequest(REFRESH_TOKEN_MUTATION, variables);

      if (result?.refreshToken) {
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          result.refreshToken;
        setTokens(newAccessToken, newRefreshToken);
        return { success: true };
      } else {
        clearAuth();
        router.push("/auth/login");
        return { success: false, error: "Failed to refresh tokens" };
      }
    } catch (error: any) {
      console.error("Refresh token error:", error);
      clearAuth();
      router.push("/auth/login");
      return {
        success: false,
        error: error.message || "Session expired",
      };
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      // Call logout mutation if we have an access token
      if (accessToken) {
        await graphqlRequest(LOGOUT_MUTATION, {}, accessToken);
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Continue with local logout even if server logout fails
    } finally {
      clearAuth();
      setLoading(false);
      router.push("/");
    }
  };

  const refetchMe = async () => {
    if (accessToken) {
      try {
        const data = await graphqlRequest(ME_QUERY, {}, accessToken);
        if (data?.me) {
          setUser({
            id: data.me.id,
            name: data.me.name,
            email: data.me.email,
          });
        }
      } catch (error) {
        console.error("Failed to refetch user profile:", error);
      }
    }
  };

  const isAuthenticated = !!accessToken && !!user;

  return {
    user,
    accessToken,
    refreshToken,
    isLoading,
    isAuthenticated,
    signUp,
    signIn,
    signInWithGoogle,
    refreshTokens,
    logout,
    refetchMe,
  };
}
