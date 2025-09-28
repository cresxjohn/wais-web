"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { CreatePaymentDialog } from "@/components/transactions/create-payment-dialog";
import { CreateTransactionDialog } from "@/components/transactions/create-transaction-dialog";
import { TransactionDetailDialog } from "@/components/transactions/transaction-detail-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAccountStore } from "@/stores/account-store";
import {
  useTransactionStore,
  type Payment,
  type Transaction,
  type TransactionType,
} from "@/stores/transaction-store";
import {
  endOfMonth,
  endOfWeek,
  format,
  isToday,
  isYesterday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import {
  ArrowDownLeft,
  ArrowUpDown,
  ArrowUpRight,
  Clock,
  Download,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Tag,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const transactionTypeIcons: Record<TransactionType, any> = {
  INCOME: ArrowDownLeft,
  EXPENSE: ArrowUpRight,
  TRANSFER: RefreshCw,
};

const transactionTypeColors: Record<TransactionType, string> = {
  INCOME: "text-green-600",
  EXPENSE: "text-red-600",
  TRANSFER: "text-blue-600",
};

const transactionStatusColors: Record<string, string> = {
  COMPLETED: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function TransactionsPage() {
  const {
    transactions,
    payments,
    filters,
    setFilters,
    clearFilters,
    removeTransaction,
    removePayment,
    setSelectedTransaction,
    setSelectedPayment,
    getTotalByType,
  } = useTransactionStore();

  const { accounts, getAccountById } = useAccountStore();

  const [activeTab, setActiveTab] = useState("transactions");
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [createTransactionOpen, setCreateTransactionOpen] = useState(false);
  const [createPaymentOpen, setCreatePaymentOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransactionLocal] =
    useState<Transaction | null>(null);
  const [selectedPayment, setSelectedPaymentLocal] = useState<Payment | null>(
    null
  );
  const [dateRange, setDateRange] = useState<
    "all" | "today" | "week" | "month"
  >("month");

  // Calculate date range
  const getDateRangeValues = () => {
    const now = new Date();
    switch (dateRange) {
      case "today":
        return {
          from: format(now, "yyyy-MM-dd"),
          to: format(now, "yyyy-MM-dd"),
        };
      case "week":
        return {
          from: format(startOfWeek(now), "yyyy-MM-dd"),
          to: format(endOfWeek(now), "yyyy-MM-dd"),
        };
      case "month":
        return {
          from: format(startOfMonth(now), "yyyy-MM-dd"),
          to: format(endOfMonth(now), "yyyy-MM-dd"),
        };
      default:
        return null;
    }
  };

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transaction.category
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transaction.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Type filter
    if (filters.type) {
      filtered = filtered.filter(
        (transaction) => transaction.type === filters.type
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(
        (transaction) => transaction.category === filters.category
      );
    }

    // Account filter
    if (filters.accountId) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.accountId === filters.accountId ||
          transaction.fromAccountId === filters.accountId ||
          transaction.toAccountId === filters.accountId
      );
    }

    // Date range filter
    const dateRangeValues = getDateRangeValues();
    if (dateRangeValues) {
      filtered = filtered.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        const fromDate = new Date(dateRangeValues.from);
        const toDate = new Date(dateRangeValues.to);
        return transactionDate >= fromDate && transactionDate <= toDate;
      });
    }

    // Sort by date (newest first)
    return filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [transactions, searchTerm, filters, dateRange]);

  // Filter payments
  const filteredPayments = useMemo(() => {
    let filtered = [...payments];

    if (searchTerm) {
      filtered = filtered.filter(
        (payment) =>
          payment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          payment.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.type) {
      filtered = filtered.filter((payment) => payment.type === filters.type);
    }

    if (filters.category) {
      filtered = filtered.filter(
        (payment) => payment.category === filters.category
      );
    }

    return filtered.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [payments, searchTerm, filters]);

  // Calculate summary stats
  const totalIncome = getTotalByType(
    "INCOME",
    getDateRangeValues() ?? undefined
  );
  const totalExpenses = getTotalByType(
    "EXPENSE",
    getDateRangeValues() ?? undefined
  );
  const netIncome = totalIncome - totalExpenses;

  const formatCurrency = (amount: string | number, showSign = false) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    const formatted = `₱${Math.abs(num).toLocaleString()}`;
    if (showSign && num !== 0) {
      return num > 0 ? `+${formatted}` : `-${formatted}`;
    }
    return formatted;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMM d, yyyy");
  };

  const getTransactionIcon = (type: TransactionType) => {
    const IconComponent = transactionTypeIcons[type];
    return (
      <IconComponent className={`h-4 w-4 ${transactionTypeColors[type]}`} />
    );
  };

  const getAccountName = (accountId?: string) => {
    if (!accountId) return "Unknown Account";
    const account = getAccountById(accountId);
    return account?.name || "Unknown Account";
  };

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransactionLocal(transaction);
    setSelectedTransaction(transaction);
    setDetailDialogOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransactionLocal(transaction);
    setSelectedTransaction(transaction);
    setCreateTransactionOpen(true);
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    if (
      confirm(`Are you sure you want to delete "${transaction.description}"?`)
    ) {
      removeTransaction(transaction.id);
      toast.success("Transaction deleted successfully");
    }
  };

  const handleViewPayment = (payment: Payment) => {
    setSelectedPaymentLocal(payment);
    setSelectedPayment(payment);
    // You could create a PaymentDetailDialog similar to TransactionDetailDialog
  };

  const handleEditPayment = (payment: Payment) => {
    setSelectedPaymentLocal(payment);
    setSelectedPayment(payment);
    setCreatePaymentOpen(true);
  };

  const handleDeletePayment = (payment: Payment) => {
    if (confirm(`Are you sure you want to delete "${payment.name}"?`)) {
      removePayment(payment.id);
      toast.success("Payment deleted successfully");
    }
  };

  const exportTransactions = () => {
    // Simple CSV export functionality
    const csvContent = [
      "Date,Description,Type,Category,Amount,Account,Status,Notes",
      ...filteredTransactions.map(
        (t) =>
          `${t.date},"${t.description}",${t.type},${t.category},${
            t.amount
          },"${getAccountName(t.accountId)}",${t.status},"${t.notes || ""}"`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout title="Transactions">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6">
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
                {dateRange === "all" ? "All time" : `This ${dateRange}`}
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
                {dateRange === "all" ? "All time" : `This ${dateRange}`}
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
                {formatCurrency(netIncome, true)}
              </div>
              <p className="text-xs text-muted-foreground">
                {dateRange === "all" ? "All time" : `This ${dateRange}`}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>

            <Select
              value={filters.type || "all"}
              onValueChange={(value) =>
                setFilters({
                  type:
                    value === "all" ? undefined : (value as TransactionType),
                })
              }
            >
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="INCOME">Income</SelectItem>
                <SelectItem value="EXPENSE">Expense</SelectItem>
                <SelectItem value="TRANSFER">Transfer</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.accountId || "all"}
              onValueChange={(value) =>
                setFilters({ accountId: value === "all" ? undefined : value })
              }
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={dateRange}
              onValueChange={(value) => setDateRange(value as any)}
            >
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>

            {(filters.type ||
              filters.category ||
              filters.accountId ||
              searchTerm) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  clearFilters();
                  setSearchTerm("");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={exportTransactions}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setCreateTransactionOpen(true)}
                >
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  One-time Transaction
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCreatePaymentOpen(true)}>
                  <Clock className="h-4 w-4 mr-2" />
                  Recurring Payment
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="transactions">
              Transactions ({filteredTransactions.length})
            </TabsTrigger>
            <TabsTrigger value="payments">
              Recurring Payments ({filteredPayments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4">
            {filteredTransactions.length > 0 ? (
              <div className="space-y-2">
                {filteredTransactions.map((transaction) => (
                  <Card
                    key={transaction.id}
                    className="group hover:shadow-md transition-shadow"
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800">
                          {getTransactionIcon(transaction.type)}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">
                              {transaction.description}
                            </h4>
                            {transaction.isRecurring && (
                              <Badge variant="secondary" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                Recurring
                              </Badge>
                            )}
                            <Badge
                              className={`text-xs ${
                                transactionStatusColors[transaction.status]
                              }`}
                            >
                              {transaction.status}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span>{transaction.category}</span>
                            <span>•</span>
                            <span>{formatDate(transaction.date)}</span>
                            {transaction.type === "TRANSFER" ? (
                              <span>
                                {getAccountName(transaction.fromAccountId)} →{" "}
                                {getAccountName(transaction.toAccountId)}
                              </span>
                            ) : (
                              <span>
                                {getAccountName(transaction.accountId)}
                              </span>
                            )}
                            {transaction.tags.length > 0 && (
                              <>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <Tag className="h-3 w-3" />
                                  <span>{transaction.tags.join(", ")}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div
                          className={`text-right font-medium ${
                            transactionTypeColors[transaction.type]
                          }`}
                        >
                          <div className="text-lg">
                            {transaction.type === "EXPENSE"
                              ? "-"
                              : transaction.type === "INCOME"
                              ? "+"
                              : ""}
                            {formatCurrency(transaction.amount)}
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleViewTransaction(transaction)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditTransaction(transaction)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Transaction
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                handleDeleteTransaction(transaction)
                              }
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Transaction
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <ArrowUpDown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No transactions found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm || Object.keys(filters).length > 0
                      ? "Try adjusting your search criteria or filters."
                      : "Get started by adding your first transaction."}
                  </p>
                  {!searchTerm && Object.keys(filters).length === 0 && (
                    <Button onClick={() => setCreateTransactionOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Transaction
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            {filteredPayments.length > 0 ? (
              <div className="space-y-2">
                {filteredPayments.map((payment) => (
                  <Card
                    key={payment.id}
                    className="group hover:shadow-md transition-shadow"
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800">
                          {getTransactionIcon(payment.type)}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{payment.name}</h4>
                            <Badge
                              variant={
                                payment.status === "ACTIVE"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {payment.status}
                            </Badge>
                            {payment.isManual && (
                              <Badge variant="outline" className="text-xs">
                                Manual
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span>{payment.category}</span>
                            <span>•</span>
                            <span>
                              {getAccountName(
                                payment.accountId || payment.fromAccountId
                              )}
                            </span>
                            {payment.description && (
                              <>
                                <span>•</span>
                                <span>{payment.description}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div
                          className={`text-right font-medium ${
                            transactionTypeColors[payment.type]
                          }`}
                        >
                          <div className="text-lg">
                            {payment.type === "EXPENSE"
                              ? "-"
                              : payment.type === "INCOME"
                              ? "+"
                              : ""}
                            {formatCurrency(payment.amount)}
                          </div>
                          {payment.recurrenceRule && (
                            <div className="text-xs text-gray-500">
                              {payment.recurrenceRule.frequency.toLowerCase()}
                            </div>
                          )}
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleViewPayment(payment)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditPayment(payment)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Payment
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeletePayment(payment)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Payment
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No recurring payments found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Set up recurring payments to automate your financial
                    routine.
                  </p>
                  <Button onClick={() => setCreatePaymentOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Recurring Payment
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <CreateTransactionDialog
        open={createTransactionOpen}
        onOpenChange={setCreateTransactionOpen}
        editTransaction={selectedTransaction}
        onClose={() => setSelectedTransactionLocal(null)}
      />

      <CreatePaymentDialog
        open={createPaymentOpen}
        onOpenChange={setCreatePaymentOpen}
        editPayment={selectedPayment}
        onClose={() => setSelectedPaymentLocal(null)}
      />

      <TransactionDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        transaction={selectedTransaction}
      />
    </AppLayout>
  );
}
