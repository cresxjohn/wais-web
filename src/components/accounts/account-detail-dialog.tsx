"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { type Account } from "@/stores/account-store";
import {
  AlertTriangle,
  Building2,
  CreditCard,
  DollarSign,
  Percent,
  Shield,
  Users,
  Wallet,
} from "lucide-react";

interface AccountDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: Account | null;
}

const accountTypeIcons: Record<string, any> = {
  CASH: Wallet,
  SAVINGS: Building2,
  CHECKING: DollarSign,
  CREDIT_CARD: CreditCard,
  LINE_OF_CREDIT: CreditCard,
  INSURANCE: Shield,
  LOAN: AlertTriangle,
};

const accountTypeColors: Record<string, string> = {
  CASH: "text-green-600",
  SAVINGS: "text-blue-600",
  CHECKING: "text-purple-600",
  CREDIT_CARD: "text-orange-600",
  LINE_OF_CREDIT: "text-red-600",
  INSURANCE: "text-indigo-600",
  LOAN: "text-yellow-600",
};

const accountTypeLabels: Record<string, string> = {
  CASH: "Cash Account",
  SAVINGS: "Savings Account",
  CHECKING: "Checking Account",
  CREDIT_CARD: "Credit Card",
  LINE_OF_CREDIT: "Line of Credit",
  INSURANCE: "Insurance Policy",
  LOAN: "Loan Account",
};

export function AccountDetailDialog({
  open,
  onOpenChange,
  account,
}: AccountDetailDialogProps) {
  if (!account) return null;

  const formatCurrency = (amount: string, currency = "PHP") => {
    const num = parseFloat(amount);
    const symbol = currency === "PHP" ? "₱" : "$";
    return `${symbol}${Math.abs(num).toLocaleString()}`;
  };

  const getBalanceColor = (balance: string, type: string) => {
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

  const getAccountIcon = (type: string) => {
    const IconComponent = accountTypeIcons[type];
    return <IconComponent className={`h-6 w-6 ${accountTypeColors[type]}`} />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {getAccountIcon(account.type)}
            <div>
              <DialogTitle className="text-xl">{account.name}</DialogTitle>
              <DialogDescription>
                {account.institution || accountTypeLabels[account.type]}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Account Overview */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wide mb-2">
                Current Balance
              </h4>
              <p
                className={`text-3xl font-bold ${getBalanceColor(
                  account.balance,
                  account.type
                )}`}
              >
                {(account.type === "CREDIT_CARD" || account.type === "LOAN") &&
                parseFloat(account.balance) < 0
                  ? "-"
                  : ""}
                {formatCurrency(account.balance, account.currency)}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wide mb-2">
                Status
              </h4>
              <div className="space-y-2">
                <Badge
                  variant={
                    account.status === "ACTIVE" ? "default" : "secondary"
                  }
                >
                  {account.status}
                </Badge>
                {account.excludeFromStats && (
                  <Badge variant="outline">Excluded from stats</Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Basic Information */}
          <div>
            <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wide mb-4">
              Account Information
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Account Type:</span>
                <p className="text-gray-600">
                  {accountTypeLabels[account.type]}
                </p>
              </div>
              {account.accountNumberLast4 && (
                <div>
                  <span className="font-medium">Account Number:</span>
                  <p className="text-gray-600 font-mono">
                    ****-{account.accountNumberLast4}
                  </p>
                </div>
              )}
              <div>
                <span className="font-medium">Date Opened:</span>
                <p className="text-gray-600">
                  {new Date(account.openedDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="font-medium">Currency:</span>
                <p className="text-gray-600">{account.currency}</p>
              </div>
              {account.notes && (
                <div className="col-span-2">
                  <span className="font-medium">Notes:</span>
                  <p className="text-gray-600">{account.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Type-specific Details */}
          {account.type === "SAVINGS" && account.savingsDetails && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  Savings Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {account.savingsDetails.interestRatePerAnnum && (
                    <div>
                      <span className="font-medium">Interest Rate:</span>
                      <p className="text-gray-600">
                        {account.savingsDetails.interestRatePerAnnum}% per annum
                      </p>
                    </div>
                  )}
                  {account.savingsDetails.requiredMonthlyAdb && (
                    <div>
                      <span className="font-medium">Required Monthly ADB:</span>
                      <p className="text-gray-600">
                        {formatCurrency(
                          account.savingsDetails.requiredMonthlyAdb,
                          account.currency
                        )}
                      </p>
                    </div>
                  )}
                  {account.savingsDetails.requiredBalanceToEarnInterest && (
                    <div>
                      <span className="font-medium">
                        Min. Balance for Interest:
                      </span>
                      <p className="text-gray-600">
                        {formatCurrency(
                          account.savingsDetails.requiredBalanceToEarnInterest,
                          account.currency
                        )}
                      </p>
                    </div>
                  )}
                  {account.savingsDetails.totalInterestEarned && (
                    <div>
                      <span className="font-medium">
                        Total Interest Earned:
                      </span>
                      <p className="text-green-600 font-medium">
                        {formatCurrency(
                          account.savingsDetails.totalInterestEarned,
                          account.currency
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {account.type === "CREDIT_CARD" && account.creditDetails && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Credit Details
                </h4>

                {/* Credit Utilization */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm">
                      Credit Utilization
                    </span>
                    <span className="text-sm text-gray-600">
                      {formatCurrency(account.creditDetails.availableCredit)}{" "}
                      available of{" "}
                      {formatCurrency(account.creditDetails.creditLimit)}
                    </span>
                  </div>
                  <Progress
                    value={
                      ((parseFloat(account.creditDetails.creditLimit) -
                        parseFloat(account.creditDetails.availableCredit)) /
                        parseFloat(account.creditDetails.creditLimit)) *
                      100
                    }
                    className="h-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {(
                      ((parseFloat(account.creditDetails.creditLimit) -
                        parseFloat(account.creditDetails.availableCredit)) /
                        parseFloat(account.creditDetails.creditLimit)) *
                      100
                    ).toFixed(1)}
                    % utilized
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Statement Date:</span>
                    <p className="text-gray-600">
                      {account.creditDetails.statementDate} of each month
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Payment Due:</span>
                    <p className="text-gray-600">
                      {account.creditDetails.dueDateDaysAfterStatement} days
                      after statement
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Interest Rate:</span>
                    <p className="text-gray-600">
                      {account.creditDetails.financeChargeInterestRate}% per
                      month
                    </p>
                  </div>
                  {account.creditDetails.annualFeeAmount && (
                    <div>
                      <span className="font-medium">Annual Fee:</span>
                      <p className="text-gray-600">
                        {formatCurrency(
                          account.creditDetails.annualFeeAmount,
                          account.currency
                        )}
                      </p>
                    </div>
                  )}
                  {account.creditDetails.rewardsType &&
                    account.creditDetails.rewardsType !== "NONE" && (
                      <>
                        <div>
                          <span className="font-medium">Rewards Type:</span>
                          <p className="text-gray-600">
                            {account.creditDetails.rewardsType.replace(
                              "_",
                              " "
                            )}
                          </p>
                        </div>
                        {account.creditDetails.rewardsBalance && (
                          <div>
                            <span className="font-medium">
                              Rewards Balance:
                            </span>
                            <p className="text-gray-600">
                              {account.creditDetails.rewardsBalance}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                </div>
              </div>
            </>
          )}

          {account.type === "LOAN" && account.loanDetails && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Loan Details
                </h4>

                {/* Loan Progress */}
                {account.loanDetails.remainingTermMonths && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">Loan Progress</span>
                      <span className="text-sm text-gray-600">
                        {account.loanDetails.termMonths -
                          account.loanDetails.remainingTermMonths}{" "}
                        of {account.loanDetails.termMonths} months paid
                      </span>
                    </div>
                    <Progress
                      value={
                        ((account.loanDetails.termMonths -
                          account.loanDetails.remainingTermMonths) /
                          account.loanDetails.termMonths) *
                        100
                      }
                      className="h-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {account.loanDetails.remainingTermMonths} months remaining
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Loan Type:</span>
                    <p className="text-gray-600">
                      {account.loanDetails.loanType.replace("_", " ")}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Original Principal:</span>
                    <p className="text-gray-600">
                      {formatCurrency(
                        account.loanDetails.originalPrincipal,
                        account.currency
                      )}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Interest Rate:</span>
                    <p className="text-gray-600">
                      {account.loanDetails.interestRate}% per annum
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Term:</span>
                    <p className="text-gray-600">
                      {account.loanDetails.termMonths} months
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Maturity Date:</span>
                    <p className="text-gray-600">
                      {new Date(
                        account.loanDetails.maturityDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Next Payment:</span>
                    <div>
                      <p className="text-gray-600 font-medium">
                        {formatCurrency(
                          account.loanDetails.nextPaymentAmount,
                          account.currency
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        Due:{" "}
                        {new Date(
                          account.loanDetails.nextPaymentDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {account.type === "INSURANCE" && account.insuranceDetails && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Insurance Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Policy Type:</span>
                    <p className="text-gray-600">
                      {account.insuranceDetails.policyType} Insurance
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Policy Number:</span>
                    <p className="text-gray-600 font-mono">
                      {account.insuranceDetails.policyNumber}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Coverage Amount:</span>
                    <p className="text-gray-600 font-medium">
                      {formatCurrency(
                        account.insuranceDetails.coverageAmount,
                        account.currency
                      )}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Premium Amount:</span>
                    <p className="text-gray-600">
                      {formatCurrency(
                        account.insuranceDetails.premiumAmount,
                        account.currency
                      )}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Premium Due Date:</span>
                    <p className="text-gray-600">
                      {new Date(
                        account.insuranceDetails.premiumDueDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  {account.insuranceDetails.deductible && (
                    <div>
                      <span className="font-medium">Deductible:</span>
                      <p className="text-gray-600">
                        {formatCurrency(
                          account.insuranceDetails.deductible,
                          account.currency
                        )}
                      </p>
                    </div>
                  )}
                  {account.insuranceDetails.beneficiaries.length > 0 && (
                    <div className="col-span-2">
                      <span className="font-medium flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Beneficiaries:
                      </span>
                      <p className="text-gray-600">
                        {account.insuranceDetails.beneficiaries.join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Account History */}
          <div>
            <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wide mb-2">
              Account History
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Created:</span>
                <p>{new Date(account.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <span className="font-medium">Last Updated:</span>
                <p>{new Date(account.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
