"use client";

import { AccountDetailDialog } from "@/components/accounts/account-detail-dialog";
import { CreateAccountDialog } from "@/components/accounts/create-account-dialog";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAccountStore,
  type Account,
  type AccountType,
} from "@/stores/account-store";
import {
  AlertTriangle,
  Building2,
  CreditCard,
  DollarSign,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  Shield,
  Trash2,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const accountTypeIcons: Record<AccountType, any> = {
  CASH: Wallet,
  SAVINGS: Building2,
  CHECKING: DollarSign,
  CREDIT_CARD: CreditCard,
  LINE_OF_CREDIT: CreditCard,
  INSURANCE: Shield,
  LOAN: AlertTriangle,
};

const accountTypeColors: Record<AccountType, string> = {
  CASH: "text-green-600",
  SAVINGS: "text-blue-600",
  CHECKING: "text-purple-600",
  CREDIT_CARD: "text-orange-600",
  LINE_OF_CREDIT: "text-red-600",
  INSURANCE: "text-indigo-600",
  LOAN: "text-yellow-600",
};

const accountTypeLabels: Record<AccountType, string> = {
  CASH: "Cash",
  SAVINGS: "Savings",
  CHECKING: "Checking",
  CREDIT_CARD: "Credit Card",
  LINE_OF_CREDIT: "Line of Credit",
  INSURANCE: "Insurance",
  LOAN: "Loan",
};

export default function AccountsPage() {
  const {
    accounts,
    removeAccount,
    getTotalBalance,
    getAccountsByType,
    setSelectedAccount,
  } = useAccountStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<AccountType | "ALL">("ALL");
  const [filterStatus, setFilterStatus] = useState<
    "ALL" | "ACTIVE" | "INACTIVE" | "CLOSED"
  >("ALL");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccountLocal] = useState<Account | null>(
    null
  );

  // Filter accounts based on search and filters
  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.institution?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.notes?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "ALL" || account.type === filterType;
    const matchesStatus =
      filterStatus === "ALL" || account.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate summary stats
  const totalBalance = getTotalBalance();
  const activeAccounts = accounts.filter((a) => a.status === "ACTIVE").length;
  const creditUtilization =
    accounts
      .filter((a) => a.type === "CREDIT_CARD" && a.creditDetails)
      .reduce((sum, account) => {
        const used = Math.abs(parseFloat(account.balance));
        const limit = parseFloat(account.creditDetails!.creditLimit);
        return sum + (used / limit) * 100;
      }, 0) / accounts.filter((a) => a.type === "CREDIT_CARD").length || 0;

  const handleViewAccount = (account: Account) => {
    setSelectedAccountLocal(account);
    setSelectedAccount(account);
    setDetailDialogOpen(true);
  };

  const handleEditAccount = (account: Account) => {
    setSelectedAccountLocal(account);
    setSelectedAccount(account);
    setCreateDialogOpen(true);
  };

  const handleDeleteAccount = (account: Account) => {
    if (confirm(`Are you sure you want to delete "${account.name}"?`)) {
      removeAccount(account.id);
      toast.success("Account deleted successfully");
    }
  };

  const getAccountIcon = (type: AccountType) => {
    const IconComponent = accountTypeIcons[type];
    return <IconComponent className={`h-5 w-5 ${accountTypeColors[type]}`} />;
  };

  const formatCurrency = (amount: string, currency = "PHP") => {
    const num = parseFloat(amount);
    const symbol = currency === "PHP" ? "₱" : "$";
    return `${symbol}${Math.abs(num).toLocaleString()}`;
  };

  const getBalanceColor = (balance: string, type: AccountType) => {
    const num = parseFloat(balance);
    if (
      type === "CREDIT_CARD" ||
      type === "LINE_OF_CREDIT" ||
      type === "LOAN"
    ) {
      return num < 0 ? "text-red-600" : "text-green-600";
    }
    return num >= 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <AppLayout title="Accounts">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Net Worth
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(totalBalance.toString())}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5.2% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Accounts
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeAccounts}</div>
              <p className="text-xs text-muted-foreground">
                {accounts.length - activeAccounts} inactive
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Credit Utilization
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {creditUtilization.toFixed(1)}%
              </div>
              <Progress value={creditUtilization} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Keep below 30% for good credit score
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>

            <Select
              value={filterType}
              onValueChange={(value) =>
                setFilterType(value as AccountType | "ALL")
              }
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                {Object.entries(accountTypeLabels).map(([type, label]) => (
                  <SelectItem key={type} value={type}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filterStatus}
              onValueChange={(value) => setFilterStatus(value as any)}
            >
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </div>

        {/* Accounts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAccounts.map((account) => (
            <Card
              key={account.id}
              className="relative group hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getAccountIcon(account.type)}
                    <div>
                      <CardTitle className="text-base">
                        {account.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {account.institution || accountTypeLabels[account.type]}
                      </CardDescription>
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
                        onClick={() => handleViewAccount(account)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleEditAccount(account)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Account
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteAccount(account)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {/* Balance */}
                  <div>
                    <p className="text-sm text-gray-500">Current Balance</p>
                    <p
                      className={`text-xl font-bold ${getBalanceColor(
                        account.balance,
                        account.type
                      )}`}
                    >
                      {account.type === "CREDIT_CARD" || account.type === "LOAN"
                        ? parseFloat(account.balance) < 0
                          ? "-"
                          : ""
                        : ""}
                      {formatCurrency(account.balance, account.currency)}
                    </p>
                  </div>

                  {/* Account Number */}
                  {account.accountNumberLast4 && (
                    <div>
                      <p className="text-sm text-gray-500">Account Number</p>
                      <p className="text-sm font-mono">
                        ****-{account.accountNumberLast4}
                      </p>
                    </div>
                  )}

                  {/* Type-specific details */}
                  {account.type === "CREDIT_CARD" && account.creditDetails && (
                    <div>
                      <p className="text-sm text-gray-500">Available Credit</p>
                      <p className="text-sm font-medium">
                        {formatCurrency(account.creditDetails.availableCredit)}{" "}
                        / {formatCurrency(account.creditDetails.creditLimit)}
                      </p>
                      <Progress
                        value={
                          ((parseFloat(account.creditDetails.creditLimit) -
                            parseFloat(account.creditDetails.availableCredit)) /
                            parseFloat(account.creditDetails.creditLimit)) *
                          100
                        }
                        className="mt-1"
                      />
                    </div>
                  )}

                  {account.type === "SAVINGS" && account.savingsDetails && (
                    <div>
                      <p className="text-sm text-gray-500">Interest Rate</p>
                      <p className="text-sm font-medium">
                        {account.savingsDetails.interestRatePerAnnum}% p.a.
                      </p>
                    </div>
                  )}

                  {account.type === "LOAN" && account.loanDetails && (
                    <div>
                      <p className="text-sm text-gray-500">Next Payment</p>
                      <p className="text-sm font-medium">
                        {formatCurrency(account.loanDetails.nextPaymentAmount)}{" "}
                        on{" "}
                        {new Date(
                          account.loanDetails.nextPaymentDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {account.type === "INSURANCE" && account.insuranceDetails && (
                    <div>
                      <p className="text-sm text-gray-500">Coverage</p>
                      <p className="text-sm font-medium">
                        {formatCurrency(
                          account.insuranceDetails.coverageAmount
                        )}
                      </p>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        account.status === "ACTIVE" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {account.status}
                    </Badge>
                    {account.excludeFromStats && (
                      <Badge variant="outline" className="text-xs">
                        Excluded from stats
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAccounts.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No accounts found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filterType !== "ALL" || filterStatus !== "ALL"
                  ? "Try adjusting your search criteria or filters."
                  : "Get started by adding your first financial account."}
              </p>
              {!searchTerm &&
                filterType === "ALL" &&
                filterStatus === "ALL" && (
                  <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Account
                  </Button>
                )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialogs */}
      <CreateAccountDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        editAccount={selectedAccount}
        onClose={() => setSelectedAccountLocal(null)}
      />

      <AccountDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        account={selectedAccount}
      />
    </AppLayout>
  );
}
