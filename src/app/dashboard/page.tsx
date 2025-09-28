"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { config } from "@/lib/config";
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CreditCard,
  DollarSign,
  Plus,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";

// Mock data - this will be replaced with real GraphQL data
const mockData = {
  financialHealth: {
    score: 78,
    trend: "up",
    insights: [
      "Your spending is 12% lower this month",
      "You're on track to meet your savings goal",
      "Consider paying off your highest interest debt first",
    ],
  },
  accounts: {
    total: 128450.75,
    accounts: [
      { name: "BPI Savings", balance: 45230.5, type: "savings" },
      { name: "UnionBank Checking", balance: 12450.25, type: "checking" },
      { name: "BDO Credit Card", balance: -8450.0, type: "credit" },
      { name: "Pag-IBIG Loan", balance: -125000.0, type: "loan" },
    ],
  },
  upcomingPayments: [
    {
      name: "Meralco Bill",
      amount: 3450.0,
      dueDate: "2024-01-15",
      category: "Utilities",
    },
    {
      name: "Internet Bill",
      amount: 1899.0,
      dueDate: "2024-01-18",
      category: "Bills",
    },
    {
      name: "Rent Payment",
      amount: 25000.0,
      dueDate: "2024-01-30",
      category: "Housing",
    },
  ],
  recentTransactions: [
    {
      id: "1",
      description: "Jollibee BGC",
      amount: -245.0,
      date: "2024-01-10",
      category: "Food",
    },
    {
      id: "2",
      description: "Salary Deposit",
      amount: 45000.0,
      date: "2024-01-09",
      category: "Income",
    },
    {
      id: "3",
      description: "Grab Ride",
      amount: -180.5,
      date: "2024-01-09",
      category: "Transport",
    },
  ],
  budgetProgress: [
    { category: "Food & Dining", spent: 8450, budget: 10000, percentage: 84.5 },
    { category: "Transportation", spent: 3200, budget: 5000, percentage: 64 },
    { category: "Entertainment", spent: 2100, budget: 3000, percentage: 70 },
  ],
};

export default function DashboardPage() {
  const handleQuickAction = (action: string) => {
    console.log(`Quick action: ${action}`);
  };

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Good morning! 👋</h2>
              <p className="text-blue-100">
                Here&apos;s your financial overview for today
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">
                ₱{mockData.accounts.total.toLocaleString()}
              </p>
              <p className="text-blue-100 text-sm">Total Net Worth</p>
            </div>
          </div>
        </div>

        {/* Financial Health Score */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Financial Health Score
                  {config.features.aiFeatures && (
                    <Badge variant="secondary">AI</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  AI-powered analysis of your financial wellness
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">
                  {mockData.financialHealth.score}
                </div>
                <div className="text-sm text-gray-500">/ 100</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={mockData.financialHealth.score} className="mb-4" />

            <div className="space-y-2">
              {mockData.financialHealth.insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                  <span>{insight}</span>
                </div>
              ))}
            </div>

            {!config.features.aiFeatures && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  💡 AI insights will be available once you enable AI features
                  in settings
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-24 flex-col"
            onClick={() => handleQuickAction("expense")}
          >
            <Plus className="h-6 w-6 mb-2" />
            Add Expense
          </Button>
          <Button
            variant="outline"
            className="h-24 flex-col"
            onClick={() => handleQuickAction("income")}
          >
            <TrendingUp className="h-6 w-6 mb-2" />
            Add Income
          </Button>
          <Button
            variant="outline"
            className="h-24 flex-col"
            onClick={() => handleQuickAction("transfer")}
          >
            <ArrowRight className="h-6 w-6 mb-2" />
            Transfer
          </Button>
          <Button
            variant="outline"
            className="h-24 flex-col"
            onClick={() => handleQuickAction("goal")}
          >
            <Target className="h-6 w-6 mb-2" />
            Set Goal
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Payments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Payments
              </CardTitle>
              <CardDescription>Bills and payments due soon</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockData.upcomingPayments.map((payment, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{payment.name}</p>
                    <p className="text-sm text-gray-500">
                      Due {payment.dueDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ₱{payment.amount.toLocaleString()}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {payment.category}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full mt-4">
                View All Payments
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Budget Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Budget This Month
              </CardTitle>
              <CardDescription>Your spending vs budget goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockData.budgetProgress.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{item.category}</span>
                    <span>
                      ₱{item.spent.toLocaleString()} / ₱
                      {item.budget.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={item.percentage}
                    className={`h-2 ${
                      item.percentage > 90
                        ? "text-red-600"
                        : item.percentage > 75
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  />
                </div>
              ))}
              <Button variant="ghost" className="w-full mt-4">
                Manage Budget
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Account Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Account Summary
            </CardTitle>
            <CardDescription>
              Overview of your financial accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockData.accounts.accounts.map((account, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm">{account.name}</p>
                    {account.type === "credit" && (
                      <CreditCard className="h-4 w-4" />
                    )}
                    {account.type === "savings" && (
                      <Wallet className="h-4 w-4" />
                    )}
                    {account.type === "checking" && (
                      <DollarSign className="h-4 w-4" />
                    )}
                    {account.type === "loan" && (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                  </div>
                  <p
                    className={`text-lg font-bold ${
                      account.balance < 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    ₱{Math.abs(account.balance).toLocaleString()}
                    {account.balance < 0 && (
                      <span className="text-sm ml-1">owed</span>
                    )}
                  </p>
                  <Badge variant="outline" className="text-xs mt-1 capitalize">
                    {account.type}
                  </Badge>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
            <CardDescription>Your latest financial activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-medium ${
                        transaction.amount < 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {transaction.amount < 0 ? "-" : "+"}₱
                      {Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {transaction.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4">
              View All Transactions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
