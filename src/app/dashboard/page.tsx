"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { PaymentItem } from "@/components/dashboard/payment-item";
import { Button } from "@/components/ui/button";
import { useToastActions } from "@/components/ui/toast";
import { useDashboardData, useNetWorth } from "@/hooks/use-dashboard-data";
import {
  ArrowUpRight,
  BarChart3,
  CreditCard,
  LineChart,
  PiggyBank,
  Star,
  Target,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { lazy, Suspense } from "react";

// Lazy load non-critical components for better performance
const GoalCard = lazy(() =>
  import("@/components/dashboard/goal-card").then((module) => ({
    default: module.GoalCard,
  }))
);
const GradientActionCard = lazy(() =>
  import("@/components/dashboard/action-card").then((module) => ({
    default: module.GradientActionCard,
  }))
);
const AiInsightsCard = lazy(() =>
  import("@/components/dashboard/ai-insights-card").then((module) => ({
    default: module.AiInsightsCard,
  }))
);
const AccountCarousel = lazy(() =>
  import("@/components/dashboard/account-carousel").then((module) => ({
    default: module.AccountCarousel,
  }))
);
const BudgetOverview = lazy(() =>
  import("@/components/dashboard/budget-overview").then((module) => ({
    default: module.BudgetOverview,
  }))
);

// Component loading fallbacks
const ComponentSkeleton = ({ height = "h-32" }: { height?: string }) => (
  <div
    className={`animate-pulse bg-gray-200 rounded-xl ${height} w-full`}
  ></div>
);

const CarouselSkeleton = () => (
  <div className="flex gap-4">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="animate-pulse bg-gray-200 rounded-xl h-48 min-w-80"
      ></div>
    ))}
  </div>
);

const GoalsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-32"></div>
    ))}
  </div>
);

const QuickActionsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="animate-pulse bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl h-24"
      ></div>
    ))}
  </div>
);

// Loading skeleton component
function DashboardSkeleton() {
  return (
    <MainLayout>
      <div className="animate-pulse space-y-6">
        {/* Net Worth Skeleton */}
        <div className="mb-6">
          <div className="h-6 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-12 bg-gray-200 rounded w-48"></div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex gap-3 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-gray-200 rounded w-32"></div>
          ))}
        </div>

        {/* Account Cards Skeleton */}
        <div className="mb-8">
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="min-w-80 h-48 bg-gray-200 rounded-xl"
              ></div>
            ))}
          </div>
        </div>

        {/* Payments Section Skeleton */}
        <div className="mb-8">
          <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded mb-3"></div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

// Error component
function DashboardError({
  error,
  onRetry,
}: {
  error: Error;
  onRetry: () => void;
}) {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-64">
        <div className="text-red-500 mb-4">
          <h2 className="text-xl font-semibold mb-2">
            Failed to load dashboard
          </h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
        <Button onClick={onRetry}>Try Again</Button>
      </div>
    </MainLayout>
  );
}

export default function DashboardPage() {
  const toast = useToastActions();
  const dashboardQuery = useDashboardData();

  // Handle loading state
  if (dashboardQuery.isLoading) {
    return <DashboardSkeleton />;
  }

  // Handle error state
  if (dashboardQuery.error) {
    return (
      <DashboardError
        error={dashboardQuery.error as Error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const { me, accounts, payments } = dashboardQuery;
  const netWorth = useNetWorth(accounts.data);

  return (
    <MainLayout>
      {/* Net Worth Section */}
      <div className="mb-6">
        <h1 className="text-lg text-gray-600 mb-1">Net Worth</h1>
        <div className="flex items-center gap-2">
          <span className="text-5xl text-gray-900">{netWorth.formatted}</span>
          <div
            className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center cursor-help"
            title="Based on your current accounts"
          >
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
        </div>
        {me.data?.name && (
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, {me.data.name}!
          </p>
        )}
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
        <Suspense fallback={<CarouselSkeleton />}>
          <AccountCarousel accounts={accounts.data} />
        </Suspense>
      </div>

      {/* Payments Section */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Upcoming Payments
          </h2>
          <button
            onClick={() =>
              toast.info("Navigation", "Payments page will be available soon.")
            }
            className="text-blue-600 font-medium text-sm hover:text-blue-700"
          >
            See all
          </button>
        </div>
        <div className="space-y-3">
          {payments.data && payments.data.length > 0 ? (
            payments.data.slice(0, 5).map((payment) => (
              <PaymentItem
                key={payment.id}
                icon={<ArrowUpRight className="w-4 h-4 text-blue-500" />}
                title={payment.name}
                subtitle={payment.category || "Uncategorized"}
                amount={new Intl.NumberFormat("en-PH", {
                  style: "currency",
                  currency: "PHP",
                }).format(payment.amount)}
                overdue={false} // We'd need more logic to determine if overdue
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <PiggyBank className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-lg mb-2">No upcoming payments</p>
              <p className="text-sm">You're all caught up!</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Insights */}
      <div className="mb-8">
        <Suspense fallback={<ComponentSkeleton height="h-40" />}>
          <AiInsightsCard />
        </Suspense>
      </div>

      {/* Goals Section */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Your Goals</h2>
          <button className="text-blue-600 font-medium text-sm hover:text-blue-700">
            See all
          </button>
        </div>
        <Suspense fallback={<GoalsSkeleton />}>
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
        </Suspense>
      </div>

      {/* Budget Overview */}
      <div className="mb-8">
        <Suspense fallback={<ComponentSkeleton height="h-48" />}>
          <BudgetOverview />
        </Suspense>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Do more with walz
        </h2>
        <Suspense fallback={<QuickActionsSkeleton />}>
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
        </Suspense>
      </div>
    </MainLayout>
  );
}
