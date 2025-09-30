"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { GoalCard } from "@/components/dashboard/goal-card";
import { Button } from "@/components/ui/button";
import { PiggyBank, Plus, Target } from "lucide-react";

export default function SavingsGoalsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Savings Goals</h1>
            <p className="text-gray-600 mt-1">
              Track your savings progress and achieve your financial goals
            </p>
          </div>
          <Button icon={<Plus className="w-4 h-4" />}>Create Goal</Button>
        </div>

        {/* Goals Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="walz-card p-4">
            <div className="text-sm text-gray-600">Active Goals</div>
            <div className="text-2xl font-bold text-gray-900">3</div>
          </div>
          <div className="walz-card p-4">
            <div className="text-sm text-gray-600">Total Saved</div>
            <div className="text-2xl font-bold text-green-600">₱42,000</div>
          </div>
          <div className="walz-card p-4">
            <div className="text-sm text-gray-600">Target Amount</div>
            <div className="text-2xl font-bold text-gray-900">₱110,000</div>
          </div>
        </div>

        {/* Active Goals */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Goals</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <GoalCard
              title="Emergency Fund"
              current={25000}
              target={50000}
              icon={<PiggyBank className="w-5 h-5 text-blue-600" />}
              color="bg-blue-50"
            />
            <GoalCard
              title="Vacation Fund"
              current={8500}
              target={30000}
              icon={<Target className="w-5 h-5 text-green-600" />}
              color="bg-green-50"
            />
            <GoalCard
              title="New Car"
              current={8500}
              target={30000}
              icon={<Target className="w-5 h-5 text-purple-600" />}
              color="bg-purple-50"
            />
          </div>
        </div>

        {/* Create New Goal */}
        <div className="walz-card p-6 border-2 border-dashed border-gray-200">
          <div className="flex flex-col items-center text-center py-8">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Create a new savings goal
            </h3>
            <p className="text-gray-600 mb-4">
              Set a target and track your progress
            </p>
            <Button size="sm">Create Goal</Button>
          </div>
        </div>

        {/* Tips Section */}
        <div className="walz-card p-6">
          <h3 className="font-semibold text-gray-900 mb-4">💡 Savings Tips</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-600">
                Set up automatic transfers to reach your goals faster
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-600">
                Break large goals into smaller monthly targets
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-600">
                Review and adjust your goals regularly
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
