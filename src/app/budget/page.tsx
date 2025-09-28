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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useBudgetStore } from "@/stores/budget-store";
import { cn } from "@/lib/utils";
import {
  PiggyBank,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Plus,
  Settings,
  Target,
  DollarSign,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Bell,
  XCircle,
  Edit,
  Trash,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { useState } from "react";

export default function BudgetPage() {
  const {
    categories,
    transactions,
    alerts,
    selectedCategory,
    currentPeriod,
    setSelectedCategory,
    getTotalBudget,
    getTotalSpent,
    getRemainingBudget,
    getBudgetUtilization,
    getCategoryProgress,
    getCategoryTransactions,
    getUnreadAlerts,
    getCategoryAlerts,
    getSpendingTrend,
    getTopSpendingCategories,
    addTransaction,
    updateCategory,
    markAlertAsRead,
    clearAllAlerts,
  } = useBudgetStore();

  const [newCategoryOpen, setNewCategoryOpen] = useState(false);
  const [editCategoryOpen, setEditCategoryOpen] = useState(false);
  const [quickExpenseOpen, setQuickExpenseOpen] = useState(false);

  const totalBudget = getTotalBudget();
  const totalSpent = getTotalSpent();
  const remainingBudget = getRemainingBudget();
  const budgetUtilization = getBudgetUtilization();
  const unreadAlerts = getUnreadAlerts();
  const spendingTrend = getSpendingTrend();
  const topSpendingCategories = getTopSpendingCategories();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 90) return "bg-orange-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getProgressBgColor = (percentage: number) => {
    if (percentage >= 100) return "bg-red-100 dark:bg-red-900/20";
    if (percentage >= 90) return "bg-orange-100 dark:bg-orange-900/20";
    if (percentage >= 75) return "bg-yellow-100 dark:bg-yellow-900/20";
    return "bg-green-100 dark:bg-green-900/20";
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "exceeded":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case "approaching":
        return <Bell className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const BudgetCategoryCard = ({ category }: { category: any }) => {
    const progress = getCategoryProgress(category.id);
    const remaining = category.budgetAmount - category.spentAmount;
    const categoryTransactions = getCategoryTransactions(category.id);
    const categoryAlerts = getCategoryAlerts(category.id);
    const hasAlerts = categoryAlerts.length > 0;

    return (
      <Card
        className={cn(
          "overflow-hidden hover:shadow-lg transition-all cursor-pointer",
          hasAlerts && "border-orange-300 dark:border-orange-700"
        )}
      >
        <CardContent className="p-0">
          {/* Category Header */}
          <div
            className={cn(
              "relative p-4 text-white bg-gradient-to-r",
              category.color
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{category.icon}</div>
                <div>
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <p className="text-sm opacity-90">{category.description}</p>
                </div>
              </div>
              {hasAlerts && (
                <AlertTriangle className="w-5 h-5 text-orange-200" />
              )}
            </div>
          </div>

          {/* Progress Section */}
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Budget Usage
                </span>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    progress >= 100
                      ? "text-red-600"
                      : progress >= 90
                      ? "text-orange-600"
                      : progress >= 75
                      ? "text-yellow-600"
                      : "text-green-600"
                  )}
                >
                  {progress.toFixed(1)}%
                </span>
              </div>
              <Progress
                value={Math.min(progress, 100)}
                className={cn("h-2", getProgressBgColor(progress))}
              />
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-red-600">
                  {formatCurrency(category.spentAmount)}
                </span>
                <span className="text-muted-foreground">
                  of {formatCurrency(category.budgetAmount)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Remaining</span>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    remaining >= 0 ? "text-green-600" : "text-red-600"
                  )}
                >
                  {formatCurrency(Math.abs(remaining))}
                </span>
              </div>
              {remaining < 0 && (
                <p className="text-xs text-red-600">
                  Budget exceeded by {formatCurrency(Math.abs(remaining))}
                </p>
              )}
            </div>

            {/* Recent Transactions Preview */}
            {categoryTransactions.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Recent</p>
                <div className="space-y-1">
                  {categoryTransactions.slice(0, 2).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex justify-between text-xs"
                    >
                      <span className="truncate">
                        {transaction.description}
                      </span>
                      <span className="text-red-600">
                        -{formatCurrency(transaction.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setSelectedCategory(category)}
              >
                View Details
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const AlertCard = ({ alert }: { alert: any }) => {
    const category = categories.find((c) => c.id === alert.categoryId);

    return (
      <Alert
        className={cn(
          "cursor-pointer hover:shadow-md transition-shadow",
          alert.type === "exceeded" && "border-red-300 dark:border-red-700",
          alert.type === "warning" &&
            "border-orange-300 dark:border-orange-700",
          alert.type === "approaching" &&
            "border-yellow-300 dark:border-yellow-700",
          alert.isRead && "opacity-60"
        )}
      >
        <div className="flex items-start space-x-3">
          {getAlertIcon(alert.type)}
          <div className="flex-1">
            <AlertTitle className="text-sm font-medium">
              {category?.name} -{" "}
              {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
            </AlertTitle>
            <AlertDescription className="text-sm">
              {alert.message}
            </AlertDescription>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(new Date(alert.date))} ago
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markAlertAsRead(alert.id)}
          >
            {!alert.isRead && <CheckCircle className="w-4 h-4" />}
          </Button>
        </div>
      </Alert>
    );
  };

  return (
    <AppLayout title="Budget">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Budget
              </CardTitle>
              <Target className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(totalBudget)}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(totalSpent)}
              </div>
              <p className="text-xs text-muted-foreground">
                {budgetUtilization.toFixed(1)}% of budget
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Remaining</CardTitle>
              <PiggyBank
                className={cn(
                  "h-4 w-4",
                  remainingBudget >= 0 ? "text-green-500" : "text-red-500"
                )}
              />
            </CardHeader>
            <CardContent>
              <div
                className={cn(
                  "text-2xl font-bold",
                  remainingBudget >= 0 ? "text-green-600" : "text-red-600"
                )}
              >
                {formatCurrency(Math.abs(remainingBudget))}
              </div>
              <p className="text-xs text-muted-foreground">
                {remainingBudget >= 0 ? "Available to spend" : "Over budget"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Budget Health
              </CardTitle>
              <CheckCircle
                className={cn(
                  "h-4 w-4",
                  budgetUtilization <= 75
                    ? "text-green-500"
                    : budgetUtilization <= 90
                    ? "text-yellow-500"
                    : "text-red-500"
                )}
              />
            </CardHeader>
            <CardContent>
              <div
                className={cn(
                  "text-2xl font-bold",
                  budgetUtilization <= 75
                    ? "text-green-600"
                    : budgetUtilization <= 90
                    ? "text-yellow-600"
                    : "text-red-600"
                )}
              >
                {budgetUtilization <= 75
                  ? "Good"
                  : budgetUtilization <= 90
                  ? "Fair"
                  : "Poor"}
              </div>
              <p className="text-xs text-muted-foreground">
                Budget utilization
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        {unreadAlerts.length > 0 && (
          <Card className="border-orange-300 dark:border-orange-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-lg">Budget Alerts</CardTitle>
                <CardDescription>
                  {unreadAlerts.length} unread alert
                  {unreadAlerts.length !== 1 ? "s" : ""}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={clearAllAlerts}>
                Clear All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {unreadAlerts.slice(0, 3).map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Tabs defaultValue="categories" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <div className="flex space-x-2">
              <Dialog
                open={quickExpenseOpen}
                onOpenChange={setQuickExpenseOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Quick Expense
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Quick Expense</DialogTitle>
                    <DialogDescription>
                      Record a new expense to your budget
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expense-amount">Amount</Label>
                        <Input
                          id="expense-amount"
                          type="number"
                          placeholder="150.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="expense-category">Category</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.icon} {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expense-description">Description</Label>
                      <Input
                        id="expense-description"
                        placeholder="e.g., Coffee at Starbucks"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expense-merchant">Merchant</Label>
                      <Input
                        id="expense-merchant"
                        placeholder="e.g., Starbucks"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button className="flex-1">Add Expense</Button>
                      <Button
                        variant="outline"
                        onClick={() => setQuickExpenseOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Category
              </Button>
            </div>
          </div>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {categories.map((category) => (
                <BudgetCategoryCard key={category.id} category={category} />
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Spending Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Spending Trend</CardTitle>
                  <CardDescription>
                    Monthly spending over the last 7 months
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={spendingTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: any) => formatCurrency(value)}
                      />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#3B82F6"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                  <CardDescription>
                    Spending distribution by category this month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={topSpendingCategories.map((item) => ({
                          name: item.category.name,
                          value: item.amount,
                          fill: `hsl(${Math.random() * 360}, 70%, 50%)`,
                        }))}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }: any) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {topSpendingCategories.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`hsl(${index * 45}, 70%, 50%)`}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => formatCurrency(value)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Budget vs Actual */}
            <Card>
              <CardHeader>
                <CardTitle>Budget vs Actual Spending</CardTitle>
                <CardDescription>
                  Comparison of budgeted amounts vs actual spending by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={categories}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value: any) => formatCurrency(value)}
                    />
                    <Legend />
                    <Bar dataKey="budgetAmount" fill="#3B82F6" name="Budget" />
                    <Bar dataKey="spentAmount" fill="#EF4444" name="Spent" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    All budget transactions this month
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.slice(0, 15).map((transaction) => {
                    const category = categories.find(
                      (c) => c.id === transaction.categoryId
                    );
                    return (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center text-lg",
                              `bg-gradient-to-r ${category?.color}`
                            )}
                          >
                            {category?.icon}
                          </div>
                          <div>
                            <p className="font-medium">
                              {transaction.description}
                            </p>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <span>{transaction.merchant}</span>
                              <span>•</span>
                              <span>{category?.name}</span>
                              <span>•</span>
                              <span>
                                {formatDistanceToNow(
                                  new Date(transaction.date)
                                )}{" "}
                                ago
                              </span>
                            </div>
                            {transaction.tags.length > 0 && (
                              <div className="flex space-x-1 mt-1">
                                {transaction.tags.slice(0, 2).map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={cn(
                              "font-semibold",
                              transaction.type === "expense"
                                ? "text-red-600"
                                : "text-green-600"
                            )}
                          >
                            {transaction.type === "expense" ? "-" : "+"}
                            {formatCurrency(transaction.amount)}
                          </p>
                          {transaction.isRecurring && (
                            <Badge variant="outline" className="text-xs mt-1">
                              Recurring
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Budget Settings</CardTitle>
                  <CardDescription>
                    Configure your budget preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Default Budget Period</Label>
                    <Select defaultValue="monthly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select defaultValue="PHP">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PHP">
                          Philippine Peso (PHP)
                        </SelectItem>
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Alert Threshold</Label>
                    <Select defaultValue="80">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="70">70% of budget</SelectItem>
                        <SelectItem value="80">80% of budget</SelectItem>
                        <SelectItem value="90">90% of budget</SelectItem>
                        <SelectItem value="95">95% of budget</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Budget Templates</CardTitle>
                  <CardDescription>
                    Quick setup templates for common budgets
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <DollarSign className="w-4 h-4 mr-2" />
                    50/30/20 Rule Template
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <PiggyBank className="w-4 h-4 mr-2" />
                    Student Budget Template
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="w-4 h-4 mr-2" />
                    Family Budget Template
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Aggressive Savings Template
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
