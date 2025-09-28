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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAccountStore } from "@/stores/account-store";
import { useTransactionStore } from "@/stores/transaction-store";
import {
  eachMonthOfInterval,
  endOfMonth,
  format,
  isWithinInterval,
  parseISO,
  startOfMonth,
  subMonths,
  subYears,
} from "date-fns";
import {
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  Calendar,
  DollarSign,
  Download,
  PieChart as PieChartIcon,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

// Color schemes for charts
const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#EC4899",
  "#6366F1",
];

const EXPENSE_COLORS = ["#EF4444", "#F97316", "#F59E0B", "#84CC16", "#06B6D4"];
const INCOME_COLORS = ["#10B981", "#059669", "#047857", "#065F46", "#064E3B"];

export default function ReportsPage() {
  const { transactions, getTotalByType } = useTransactionStore();
  const { accounts } = useAccountStore();

  const [dateRange, setDateRange] = useState<"3m" | "6m" | "1y" | "2y">("6m");
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate date ranges
  const getDateRange = () => {
    const now = new Date();
    switch (dateRange) {
      case "3m":
        return { start: subMonths(now, 3), end: now };
      case "6m":
        return { start: subMonths(now, 6), end: now };
      case "1y":
        return { start: subYears(now, 1), end: now };
      case "2y":
        return { start: subYears(now, 2), end: now };
      default:
        return { start: subMonths(now, 6), end: now };
    }
  };

  const { start: dateStart, end: dateEnd } = getDateRange();

  // Filter transactions by date range
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionDate = parseISO(transaction.date);
      return isWithinInterval(transactionDate, {
        start: dateStart,
        end: dateEnd,
      });
    });
  }, [transactions, dateStart, dateEnd]);

  // Calculate totals
  const totalIncome = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  }, [filteredTransactions]);

  const totalExpenses = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  }, [filteredTransactions]);

  const netIncome = totalIncome - totalExpenses;

  // Generate monthly data for trends
  const monthlyData = useMemo(() => {
    const months = eachMonthOfInterval({ start: dateStart, end: dateEnd });

    return months.map((month) => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);

      const monthTransactions = filteredTransactions.filter((t) =>
        isWithinInterval(parseISO(t.date), { start: monthStart, end: monthEnd })
      );

      const income = monthTransactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const expenses = monthTransactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      return {
        month: format(month, "MMM yyyy"),
        income,
        expenses,
        net: income - expenses,
      };
    });
  }, [filteredTransactions, dateStart, dateEnd]);

  // Category breakdown for expenses
  const expensesByCategory = useMemo(() => {
    const categoryTotals: Record<string, number> = {};

    filteredTransactions
      .filter((t) => t.type === "EXPENSE")
      .forEach((transaction) => {
        const category = transaction.category;
        categoryTotals[category] =
          (categoryTotals[category] || 0) + parseFloat(transaction.amount);
      });

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8); // Top 8 categories
  }, [filteredTransactions]);

  // Income breakdown by category
  const incomeByCategory = useMemo(() => {
    const categoryTotals: Record<string, number> = {};

    filteredTransactions
      .filter((t) => t.type === "INCOME")
      .forEach((transaction) => {
        const category = transaction.category;
        categoryTotals[category] =
          (categoryTotals[category] || 0) + parseFloat(transaction.amount);
      });

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredTransactions]);

  // Account balances (mock data since we don't have real balances in transactions)
  const accountBalances = useMemo(() => {
    return accounts
      .filter((account) => account.status === "ACTIVE")
      .map((account) => ({
        name: account.name,
        balance: parseFloat(account.balance),
        type: account.type,
      }))
      .sort((a, b) => b.balance - a.balance);
  }, [accounts]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCompactCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `₱${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `₱${(amount / 1000).toFixed(1)}K`;
    }
    return formatCurrency(amount);
  };

  const exportData = (type: "csv" | "excel") => {
    let csvContent: string;
    let filename: string;

    if (activeTab === "overview") {
      csvContent = [
        "Month,Income,Expenses,Net",
        ...monthlyData.map(
          (d) => `${d.month},${d.income},${d.expenses},${d.net}`
        ),
      ].join("\n");
      filename = `financial-overview-${format(new Date(), "yyyy-MM-dd")}`;
    } else if (activeTab === "expenses") {
      csvContent = [
        "Category,Amount",
        ...expensesByCategory.map((d) => `${d.category},${d.amount}`),
      ].join("\n");
      filename = `expense-breakdown-${format(new Date(), "yyyy-MM-dd")}`;
    } else {
      csvContent = [
        "Category,Amount",
        ...incomeByCategory.map((d) => `${d.category},${d.amount}`),
      ].join("\n");
      filename = `income-breakdown-${format(new Date(), "yyyy-MM-dd")}`;
    }

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success(`${activeTab} data exported successfully!`);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex justify-center gap-6 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <AppLayout title="Reports & Analytics">
      <div className="space-y-6">
        {/* Header with filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Financial Reports & Analytics
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Analyze your spending patterns and financial trends
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={dateRange}
              onValueChange={(value) => setDateRange(value as any)}
            >
              <SelectTrigger className="w-32">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3m">Last 3 months</SelectItem>
                <SelectItem value="6m">Last 6 months</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
                <SelectItem value="2y">Last 2 years</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => exportData("csv")}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Income
              </CardTitle>
              <ArrowDownLeft className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totalIncome)}
              </div>
              <p className="text-xs text-muted-foreground">
                {dateRange === "3m"
                  ? "Last 3 months"
                  : dateRange === "6m"
                  ? "Last 6 months"
                  : dateRange === "1y"
                  ? "Last year"
                  : "Last 2 years"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Expenses
              </CardTitle>
              <ArrowUpRight className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(totalExpenses)}
              </div>
              <p className="text-xs text-muted-foreground">
                {dateRange === "3m"
                  ? "Last 3 months"
                  : dateRange === "6m"
                  ? "Last 6 months"
                  : dateRange === "1y"
                  ? "Last year"
                  : "Last 2 years"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Income</CardTitle>
              {netIncome >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  netIncome >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(netIncome)}
              </div>
              <p className="text-xs text-muted-foreground">
                {netIncome >= 0 ? "Saving money" : "Spending more than earning"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Monthly
              </CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(netIncome / monthlyData.length)}
              </div>
              <p className="text-xs text-muted-foreground">
                Average net per month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Income vs Expenses Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Income vs Expenses Trend
                  </CardTitle>
                  <CardDescription>
                    Monthly comparison of income and expenses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={formatCompactCurrency} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend content={<CustomLegend />} />
                      <Bar dataKey="income" fill="#10B981" name="Income" />
                      <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Net Income Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Net Income Trend
                  </CardTitle>
                  <CardDescription>
                    Monthly net income (income - expenses)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={formatCompactCurrency} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="net"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.3}
                        name="Net Income"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Expense Categories Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Expenses by Category
                  </CardTitle>
                  <CardDescription>
                    Breakdown of expenses by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={expensesByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(props: any) => {
                          const { category, percent } = props;
                          return `${category} ${(percent * 100).toFixed(0)}%`;
                        }}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {expensesByCategory.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatCurrency(value as number)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Top Expense Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Expense Categories</CardTitle>
                  <CardDescription>
                    Your highest spending categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {expensesByCategory.slice(0, 6).map((item, index) => {
                      const percentage = (item.amount / totalExpenses) * 100;
                      return (
                        <div
                          key={item.category}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor:
                                  EXPENSE_COLORS[index % EXPENSE_COLORS.length],
                              }}
                            />
                            <span className="font-medium">{item.category}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-red-600">
                              {formatCurrency(item.amount)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {percentage.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="income" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Income Categories Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Income by Category
                  </CardTitle>
                  <CardDescription>Breakdown of income sources</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={incomeByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(props: any) => {
                          const { category, percent } = props;
                          return `${category} ${(percent * 100).toFixed(0)}%`;
                        }}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {incomeByCategory.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={INCOME_COLORS[index % INCOME_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatCurrency(value as number)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Income Sources */}
              <Card>
                <CardHeader>
                  <CardTitle>Income Sources</CardTitle>
                  <CardDescription>
                    Your income breakdown by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {incomeByCategory.map((item, index) => {
                      const percentage = (item.amount / totalIncome) * 100;
                      return (
                        <div
                          key={item.category}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor:
                                  INCOME_COLORS[index % INCOME_COLORS.length],
                              }}
                            />
                            <span className="font-medium">{item.category}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-green-600">
                              {formatCurrency(item.amount)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {percentage.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="accounts" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Account Balances */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Account Balances
                  </CardTitle>
                  <CardDescription>
                    Current balance across all accounts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={accountBalances} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        type="number"
                        tickFormatter={formatCompactCurrency}
                      />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip
                        formatter={(value) => formatCurrency(value as number)}
                      />
                      <Bar dataKey="balance" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Account Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Summary</CardTitle>
                  <CardDescription>
                    Overview of all your accounts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {accountBalances.map((account, index) => (
                      <div
                        key={account.name}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                      >
                        <div>
                          <div className="font-medium">{account.name}</div>
                          <div className="text-sm text-gray-500 capitalize">
                            {account.type.toLowerCase().replace("_", " ")}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            {formatCurrency(account.balance)}
                          </div>
                          <Badge
                            variant={
                              account.balance >= 0 ? "default" : "destructive"
                            }
                            className="text-xs"
                          >
                            {account.balance >= 0 ? "Positive" : "Negative"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
