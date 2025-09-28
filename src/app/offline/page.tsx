"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Smartphone,
  WifiOff,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryCount((prev) => prev + 1);

    try {
      // Try to fetch from the network
      const response = await fetch("/", { method: "HEAD" });
      if (response.ok) {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.log("Still offline");
    } finally {
      setTimeout(() => setIsRetrying(false), 1000);
    }
  };

  const offlineFeatures = [
    "View cached transactions and accounts",
    "Add new transactions (will sync when online)",
    "Browse financial reports",
    "Access AI insights from cached data",
    "View account balances (last known)",
  ];

  if (isOnline) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-green-800">Back Online!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Your connection has been restored. Redirecting you to the
              dashboard...
            </p>
            <Button
              onClick={() => (window.location.href = "/dashboard")}
              className="bg-green-600 hover:bg-green-700"
            >
              Continue to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Main offline card */}
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <WifiOff className="h-8 w-8 text-gray-600" />
              </div>
            </div>
            <CardTitle className="flex items-center justify-center gap-2">
              You&apos;re Offline
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                <AlertCircle className="h-3 w-3 mr-1" />
                No Connection
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Don&apos;t worry! WAIS works offline too. You can still access
              your financial data and add new transactions.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={handleRetry}
                disabled={isRetrying}
                variant="outline"
              >
                {isRetrying ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Try Again
              </Button>

              {retryCount > 0 && (
                <span className="text-sm text-gray-500">
                  Tried {retryCount} time{retryCount > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Offline features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-blue-600" />
              What You Can Do Offline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {offlineFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-900">Auto-Sync</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Any new transactions you add will automatically sync when
                    your connection is restored.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-center space-x-4">
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
          <Button
            onClick={() => (window.location.href = "/dashboard")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Open Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
