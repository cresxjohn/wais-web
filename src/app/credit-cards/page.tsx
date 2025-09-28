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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useCreditCardStore } from "@/stores/credit-card-store";
import { formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  CreditCard,
  Download,
  Eye,
  Gift,
  MoreHorizontal,
  Percent,
  Plus,
  TrendingDown,
  Wallet,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const cardTypeIcons = {
  visa: "/images/visa-logo.svg",
  mastercard: "/images/mastercard-logo.svg",
  amex: "/images/amex-logo.svg",
  discover: "/images/discover-logo.svg",
};

const categoryColors = {
  Shopping: "#3B82F6",
  "Food & Dining": "#10B981",
  "Gas & Fuel": "#F59E0B",
  Entertainment: "#8B5CF6",
  Travel: "#EF4444",
  Groceries: "#06B6D4",
  Other: "#6B7280",
};

const spendingData = [
  { name: "Shopping", value: 4100.75, color: "#3B82F6" },
  { name: "Food & Dining", value: 1850.5, color: "#10B981" },
  { name: "Gas & Fuel", value: 1200.0, color: "#F59E0B" },
  { name: "Entertainment", value: 549.0, color: "#8B5CF6" },
];

const utilizationTrend = [
  { month: "Jul", utilization: 45 },
  { month: "Aug", utilization: 52 },
  { month: "Sep", utilization: 38 },
  { month: "Oct", utilization: 61 },
  { month: "Nov", utilization: 44 },
  { month: "Dec", utilization: 35 },
];

export default function CreditCardsPage() {
  const {
    cards,
    transactions,
    statements,
    selectedCard,
    setSelectedCard,
    getTotalDebt,
    getTotalAvailableCredit,
    getCreditUtilization,
    getCardTransactions,
    getTotalRewards,
    getTotalCashback,
  } = useCreditCardStore();

  const totalDebt = getTotalDebt();
  const totalAvailable = getTotalAvailableCredit();
  const creditUtilization = getCreditUtilization();
  const totalRewards = getTotalRewards();
  const totalCashback = getTotalCashback();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  const formatCardNumber = (lastFour: string) => {
    return `•••• •••• •••• ${lastFour}`;
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return "text-red-600";
    if (utilization >= 70) return "text-orange-600";
    if (utilization >= 30) return "text-yellow-600";
    return "text-green-600";
  };

  const getUtilizationBg = (utilization: number) => {
    if (utilization >= 90) return "bg-red-100 dark:bg-red-900/20";
    if (utilization >= 70) return "bg-orange-100 dark:bg-orange-900/20";
    if (utilization >= 30) return "bg-yellow-100 dark:bg-yellow-900/20";
    return "bg-green-100 dark:bg-green-900/20";
  };

  const CreditCardComponent = ({ card }: { card: any }) => {
    const utilization = (card.currentBalance / card.creditLimit) * 100;
    const isOverdue = new Date(card.dueDate) < new Date();

    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        <CardContent className="p-0">
          {/* Credit Card Visual */}
          <div
            className={cn(
              "relative p-6 text-white bg-gradient-to-br",
              card.cardColor,
              "min-h-[200px] flex flex-col justify-between"
            )}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm opacity-90">{card.bank}</p>
                <p className="text-lg font-semibold mt-1">{card.name}</p>
              </div>
              <div className="w-12 h-8 bg-white/20 rounded flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-2xl font-mono tracking-widest">
                {formatCardNumber(card.cardNumber)}
              </p>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs opacity-75">Available Credit</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(card.availableCredit)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-75">Due Date</p>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isOverdue && "text-red-200"
                    )}
                  >
                    {new Date(card.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {isOverdue && (
              <div className="absolute top-4 right-4">
                <AlertCircle className="w-5 h-5 text-red-200" />
              </div>
            )}
          </div>

          {/* Card Details */}
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-xl font-semibold">
                  {formatCurrency(card.currentBalance)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Min Payment</p>
                <p className="text-lg font-semibold text-orange-600">
                  {formatCurrency(card.minPayment)}
                </p>
              </div>
            </div>

            {/* Utilization Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Credit Utilization</span>
                <span className={getUtilizationColor(utilization)}>
                  {utilization.toFixed(1)}%
                </span>
              </div>
              <Progress
                value={utilization}
                className={cn("h-2", getUtilizationBg(utilization))}
              />
            </div>

            {/* Rewards & Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex space-x-4">
                {card.rewardsPoints > 0 && (
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Rewards</p>
                    <p className="text-sm font-semibold text-blue-600">
                      {card.rewardsPoints.toLocaleString()}
                    </p>
                  </div>
                )}
                {card.cashback > 0 && (
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Cashback</p>
                    <p className="text-sm font-semibold text-green-600">
                      {formatCurrency(card.cashback)}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <AppLayout title="Credit Cards">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(totalDebt)}
              </div>
              <p className="text-xs text-muted-foreground">
                Across {cards.length} cards
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Available Credit
              </CardTitle>
              <Wallet className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totalAvailable)}
              </div>
              <p className="text-xs text-muted-foreground">Ready to use</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Credit Utilization
              </CardTitle>
              <Percent className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div
                className={cn(
                  "text-2xl font-bold",
                  getUtilizationColor(creditUtilization)
                )}
              >
                {creditUtilization.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">Keep under 30%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Rewards
              </CardTitle>
              <Gift className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {totalRewards.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                + ₱{totalCashback.toFixed(2)} cashback
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="cards" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="cards">My Cards</TabsTrigger>
              <TabsTrigger value="transactions">
                Recent Transactions
              </TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="statements">Statements</TabsTrigger>
            </TabsList>

            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Card
            </Button>
          </div>

          {/* Cards Tab */}
          <TabsContent value="cards" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {cards.map((card) => (
                <CreditCardComponent key={card.id} card={card} />
              ))}
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Your latest credit card transactions across all cards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.slice(0, 10).map((transaction) => {
                    const card = cards.find((c) => c.id === transaction.cardId);
                    return (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center",
                              `bg-gradient-to-r ${card?.cardColor}`
                            )}
                          >
                            <CreditCard className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {transaction.merchant}
                            </p>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <span>{card?.name}</span>
                              <span>•</span>
                              <span>{transaction.category}</span>
                              <span>•</span>
                              <span>
                                {formatDistanceToNow(
                                  new Date(transaction.date)
                                )}{" "}
                                ago
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-red-600">
                            -{formatCurrency(transaction.amount)}
                          </p>
                          {transaction.rewardsEarned > 0 && (
                            <p className="text-xs text-green-600">
                              +{transaction.rewardsEarned} rewards
                            </p>
                          )}
                          <Badge
                            variant={
                              transaction.status === "posted"
                                ? "default"
                                : transaction.status === "pending"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Spending by Category */}
              <Card>
                <CardHeader>
                  <CardTitle>Spending by Category</CardTitle>
                  <CardDescription>
                    This month&apos;s credit card spending breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={spendingData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }: any) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {spendingData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => formatCurrency(value)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Credit Utilization Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Credit Utilization Trend</CardTitle>
                  <CardDescription>
                    Your credit utilization over the past 6 months
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={utilizationTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: any) => [`${value}%`, "Utilization"]}
                      />
                      <Bar dataKey="utilization" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Summary</CardTitle>
                <CardDescription>
                  Key metrics for this billing cycle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-red-600">₱7,700</p>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-xs text-green-600 mt-1">
                      ↓ 12% vs last month
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">53</p>
                    <p className="text-sm text-muted-foreground">
                      Total Rewards
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      ↑ 8% vs last month
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">8</p>
                    <p className="text-sm text-muted-foreground">
                      Transactions
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Average: ₱962</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statements Tab */}
          <TabsContent value="statements" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Credit Card Statements</CardTitle>
                  <CardDescription>
                    Download and view your monthly statements
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statements.map((statement) => {
                    const card = cards.find((c) => c.id === statement.cardId);
                    return (
                      <div
                        key={statement.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center",
                              `bg-gradient-to-r ${card?.cardColor}`
                            )}
                          >
                            <CreditCard className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">{card?.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Statement:{" "}
                              {new Date(
                                statement.statementDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-semibold">
                              {formatCurrency(statement.totalAmount)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Min: {formatCurrency(statement.minPayment)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                statement.isPaid ? "default" : "destructive"
                              }
                            >
                              {statement.isPaid ? "Paid" : "Due"}
                            </Badge>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
