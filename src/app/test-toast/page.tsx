"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { useToastActions } from "@/components/ui/toast";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

export default function TestToastPage() {
  const toast = useToastActions();

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
        </div>
      </div>
    </MainLayout>
  );
}
