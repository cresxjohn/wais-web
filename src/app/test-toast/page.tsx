"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { useToastActions } from "@/components/ui/toast";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  User,
  Lock,
} from "lucide-react";
import { useMe } from "@/hooks/use-dashboard-data";
import { decodeJWT, isTokenExpired } from "@/lib/graphql-client";
import { useState } from "react";

export default function TestToastPage() {
  const toast = useToastActions();
  const [testToken, setTestToken] = useState("");
  const { data: user, isLoading: userLoading, error: userError } = useMe();

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Toast System Test
        </h1>

        <div className="walz-card p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Test Different Toast Types
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="primary"
              onClick={() =>
                toast.success(
                  "Success!",
                  "Your action was completed successfully."
                )
              }
              className="flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Success Toast
            </Button>

            <Button
              variant="secondary"
              onClick={() =>
                toast.error("Error!", "Something went wrong. Please try again.")
              }
              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700"
            >
              <XCircle className="w-4 h-4" />
              Error Toast
            </Button>

            <Button
              variant="secondary"
              onClick={() =>
                toast.warning(
                  "Warning!",
                  "Please review your action before proceeding."
                )
              }
              className="flex items-center gap-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700"
            >
              <AlertTriangle className="w-4 h-4" />
              Warning Toast
            </Button>

            <Button
              variant="secondary"
              onClick={() =>
                toast.info(
                  "Information",
                  "Here's some helpful information for you."
                )
              }
              className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700"
            >
              <Info className="w-4 h-4" />
              Info Toast
            </Button>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Test Different Durations
            </h3>

            <div className="flex flex-wrap gap-4">
              <Button
                variant="outline"
                onClick={() =>
                  toast.success(
                    "Quick Toast",
                    "This will disappear in 2 seconds",
                    2000
                  )
                }
              >
                2 Second Toast
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  toast.info(
                    "Long Toast",
                    "This will stay for 10 seconds",
                    10000
                  )
                }
              >
                10 Second Toast
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  toast.warning(
                    "Persistent Toast",
                    "This won't auto-dismiss",
                    0
                  )
                }
              >
                Persistent Toast
              </Button>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Multiple Toasts
            </h3>

            <Button
              variant="primary"
              onClick={() => {
                toast.success("First toast");
                setTimeout(() => toast.info("Second toast"), 500);
                setTimeout(() => toast.warning("Third toast"), 1000);
                setTimeout(() => toast.error("Final toast"), 1500);
              }}
            >
              Show Multiple Toasts
            </Button>
          </div>

          {/* Authentication Testing Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Authentication Testing
            </h3>

            <div className="space-y-4">
              {/* Current Auth Status */}
              <div className="walz-card p-4">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Current Auth Status
                </h4>

                {userLoading && (
                  <p className="text-blue-600">Loading user data...</p>
                )}
                {userError && (
                  <p className="text-red-600">Error: {userError.message}</p>
                )}
                {user && (
                  <div className="text-sm text-gray-600">
                    <p>
                      <strong>User ID:</strong> {user.id}
                    </p>
                    <p>
                      <strong>Name:</strong> {user.name || "N/A"}
                    </p>
                    <p>
                      <strong>Email:</strong> {user.email || "N/A"}
                    </p>
                  </div>
                )}

                {/* JWT Token Info */}
                {typeof window !== "undefined" &&
                  (() => {
                    const token = localStorage.getItem("wais_access_token");
                    if (token) {
                      const decoded = decodeJWT(token);
                      const expired = isTokenExpired(token);
                      return (
                        <div className="mt-3 text-sm">
                          <p
                            className={`font-medium ${
                              expired ? "text-red-600" : "text-green-600"
                            }`}
                          >
                            JWT Token: {expired ? "EXPIRED" : "VALID"}
                          </p>
                          {decoded && (
                            <div className="text-gray-600 mt-1">
                              <p>
                                Expires:{" "}
                                {new Date(decoded.exp * 1000).toLocaleString()}
                              </p>
                              <p>Issuer: {decoded.iss}</p>
                            </div>
                          )}
                        </div>
                      );
                    }
                    return (
                      <p className="text-gray-500 mt-3">No JWT token found</p>
                    );
                  })()}
              </div>

              {/* Manual Token Testing */}
              <div className="walz-card p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Set Test JWT Token
                </h4>
                <div className="space-y-2">
                  <textarea
                    value={testToken}
                    onChange={(e) => setTestToken(e.target.value)}
                    placeholder="Paste JWT token here for testing..."
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      onClick={() => {
                        if (testToken.trim()) {
                          localStorage.setItem(
                            "wais_access_token",
                            testToken.trim()
                          );
                          toast.success(
                            "Token Set",
                            "JWT token saved to localStorage"
                          );
                        }
                      }}
                    >
                      Set Token
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        const validToken =
                          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiZTdjNGZkMi0zYWRkLTRjMzctYjEwYy1hNGRkYjJiMGQxMGIiLCJpYXQiOjE3NTkyMDk0NDksImV4cCI6MTc1OTIxMDM0OSwiaXNzIjoid2Fpcy1hdXRoIn0.TKo4M-rIjciPJxzzIGa_PRZhLt56yjoK9nkuaPkIM94";
                        setTestToken(validToken);
                      }}
                    >
                      Use Valid Test Token
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        localStorage.removeItem("wais_access_token");
                        localStorage.removeItem("wais_refresh_token");
                        toast.info(
                          "Tokens Cleared",
                          "All JWT tokens removed from localStorage"
                        );
                      }}
                    >
                      Clear Tokens
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
