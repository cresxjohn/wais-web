"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { PaymentItem } from "@/components/dashboard/payment-item";
import { GoalCard } from "@/components/dashboard/goal-card";
import { GradientActionCard } from "@/components/dashboard/action-card";
import { AiInsightsCard } from "@/components/dashboard/ai-insights-card";
import { AccountCarousel } from "@/components/dashboard/account-carousel";
import { BudgetOverview } from "@/components/dashboard/budget-overview";
import { Button } from "@/components/ui/button";
import { useToastActions } from "@/components/ui/toast";
import {
  ArrowUpRight,
  BarChart3,
  CreditCard,
  LineChart,
  PiggyBank,
  Star,
  Target,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const toast = useToastActions();

  return (
    <MainLayout>
      {/* Net Worth Section */}
      <div className="mb-6">
        <h1 className="text-lg text-gray-600 mb-1">Net Worth</h1>
        <div className="flex items-center gap-2">
          <span className="text-5xl text-gray-900">₱125,847.50</span>
          <div
            className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center cursor-help"
            title="↑ ₱8,340.25 (+7.1%) from last month"
          >
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-8">
        <Button
          icon={<CreditCard className="w-4 h-4" />}
          onClick={() =>
            toast.success("Payment Ready", "Ready to make a payment!")
          }
        >
          Make a Payment
        </Button>
        <Button
          variant="secondary"
          icon={<Target className="w-4 h-4" />}
          onClick={() =>
            toast.info("Budget Setup", "Let's help you set up a budget.")
          }
        >
          Set Budget
        </Button>
        <Button
          variant="secondary"
          icon={<PiggyBank className="w-4 h-4" />}
          onClick={() =>
            toast.success("Goal Setting", "Time to set a savings goal!")
          }
        >
          Set a Goal
        </Button>
      </div>

      {/* Account Cards */}
      <div className="mb-8">
        <AccountCarousel />
      </div>

      {/* Payments Section */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Payments</h2>
          <button className="text-blue-600 font-medium text-sm hover:text-blue-700">
            See all
          </button>
        </div>
        <div className="space-y-3">
          <PaymentItem
            icon={<ArrowUpRight className="w-4 h-4 text-red-500" />}
            title="Credit Card Bill"
            subtitle="BPI • Due Nov 10 (Overdue)"
            amount="₱5,240.00"
            overdue
          />
          <PaymentItem
            icon={<ArrowUpRight className="w-4 h-4 text-red-500" />}
            title="Internet Bill"
            subtitle="PLDT • Due Nov 8 (Overdue)"
            amount="₱1,699.00"
            overdue
          />
          <PaymentItem
            icon={<ArrowUpRight className="w-4 h-4 text-blue-500" />}
            title="Electric Bill"
            subtitle="MERALCO • Due Nov 20"
            amount="₱4,200.00"
          />
        </div>
      </div>

      {/* AI Insights */}
      <div className="mb-8">
        <AiInsightsCard />
      </div>

      {/* Goals Section */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Your Goals</h2>
          <button className="text-blue-600 font-medium text-sm hover:text-blue-700">
            See all
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            title="Car Fund"
            current={12000}
            target={45000}
            icon={<Target className="w-5 h-5 text-purple-600" />}
            color="bg-purple-50"
          />
        </div>
      </div>

      {/* Budget Overview */}
      <div className="mb-8">
        <BudgetOverview />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Do more with walz
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GradientActionCard
            title="Set Savings Goal"
            icon={<Target className="w-5 h-5" />}
            gradient="from-blue-500 to-blue-600"
          />
          <GradientActionCard
            title="Track Expenses"
            icon={<BarChart3 className="w-5 h-5" />}
            gradient="from-green-500 to-green-600"
          />
          <GradientActionCard
            title="Investment Portfolio"
            icon={<LineChart className="w-5 h-5" />}
            gradient="from-purple-500 to-purple-600"
          />
          <GradientActionCard
            title="Credit Score"
            icon={<Star className="w-5 h-5" />}
            gradient="from-indigo-500 to-indigo-600"
          />
        </div>
      </div>
    </MainLayout>
  );
}
