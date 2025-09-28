"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  accountStatuses,
  accountTypes,
  createAccountSchema,
  type CreateAccountFormData,
} from "@/lib/validations/account";
import { useAccountStore, type Account } from "@/stores/account-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CreateAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editAccount?: Account | null;
  onClose: () => void;
}

const accountTypeLabels: Record<string, string> = {
  CASH: "Cash",
  SAVINGS: "Savings Account",
  CHECKING: "Checking Account",
  CREDIT_CARD: "Credit Card",
  LINE_OF_CREDIT: "Line of Credit",
  INSURANCE: "Insurance Policy",
  LOAN: "Loan Account",
};

const loanTypes = [
  { value: "PERSONAL", label: "Personal Loan" },
  { value: "AUTO", label: "Auto Loan" },
  { value: "MORTGAGE", label: "Mortgage" },
  { value: "BUSINESS", label: "Business Loan" },
  { value: "SALARY", label: "Salary Loan" },
  { value: "PAG_IBIG", label: "Pag-IBIG Loan" },
  { value: "SSS", label: "SSS Loan" },
];

const policyTypes = [
  { value: "LIFE", label: "Life Insurance" },
  { value: "HEALTH", label: "Health Insurance" },
  { value: "AUTO", label: "Auto Insurance" },
  { value: "HOME", label: "Home Insurance" },
  { value: "TRAVEL", label: "Travel Insurance" },
  { value: "VUL", label: "Variable Universal Life" },
];

export function CreateAccountDialog({
  open,
  onOpenChange,
  editAccount,
  onClose,
}: CreateAccountDialogProps) {
  const { addAccount, updateAccount } = useAccountStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("CASH");

  const form = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      name: "",
      type: "CASH",
      balance: "0.00",
      currency: "PHP",
      status: "ACTIVE",
      institution: "",
      accountNumberLast4: "",
      openedDate: new Date().toISOString().split("T")[0],
      excludeFromStats: false,
      notes: "",
    },
  });

  const watchedType = form.watch("type");

  useEffect(() => {
    setSelectedType(watchedType);
  }, [watchedType]);

  // Populate form when editing
  useEffect(() => {
    if (editAccount && open) {
      form.reset({
        name: editAccount.name,
        type: editAccount.type,
        balance: editAccount.balance,
        currency: editAccount.currency,
        status: editAccount.status,
        institution: editAccount.institution || "",
        accountNumberLast4: editAccount.accountNumberLast4 || "",
        openedDate: editAccount.openedDate,
        excludeFromStats: editAccount.excludeFromStats,
        notes: editAccount.notes || "",
        // Type-specific details
        ...(editAccount.savingsDetails && {
          savingsDetails: {
            interestRatePerAnnum:
              editAccount.savingsDetails.interestRatePerAnnum?.toString() || "",
            requiredMonthlyAdb:
              editAccount.savingsDetails.requiredMonthlyAdb || "",
            requiredBalanceToEarnInterest:
              editAccount.savingsDetails.requiredBalanceToEarnInterest || "",
          },
        }),
        ...(editAccount.creditDetails && {
          creditDetails: {
            creditLimit: editAccount.creditDetails.creditLimit,
            availableCredit: editAccount.creditDetails.availableCredit,
            statementDate: editAccount.creditDetails.statementDate.toString(),
            dueDateDaysAfterStatement:
              editAccount.creditDetails.dueDateDaysAfterStatement.toString(),
            financeChargeInterestRate:
              editAccount.creditDetails.financeChargeInterestRate.toString(),
            annualFeeAmount: editAccount.creditDetails.annualFeeAmount || "",
          },
        }),
        ...(editAccount.loanDetails && {
          loanDetails: {
            loanType: editAccount.loanDetails.loanType,
            originalPrincipal: editAccount.loanDetails.originalPrincipal,
            interestRate: editAccount.loanDetails.interestRate.toString(),
            termMonths: editAccount.loanDetails.termMonths.toString(),
            maturityDate: editAccount.loanDetails.maturityDate,
            nextPaymentDate: editAccount.loanDetails.nextPaymentDate,
            nextPaymentAmount: editAccount.loanDetails.nextPaymentAmount,
          },
        }),
        ...(editAccount.insuranceDetails && {
          insuranceDetails: {
            policyType: editAccount.insuranceDetails.policyType,
            policyNumber: editAccount.insuranceDetails.policyNumber,
            coverageAmount: editAccount.insuranceDetails.coverageAmount,
            premiumAmount: editAccount.insuranceDetails.premiumAmount,
            premiumDueDate: editAccount.insuranceDetails.premiumDueDate,
            deductible: editAccount.insuranceDetails.deductible || "",
            beneficiaries:
              editAccount.insuranceDetails.beneficiaries.join(", "),
          },
        }),
      });
      setSelectedType(editAccount.type);
    }
  }, [editAccount, open, form]);

  const onSubmit = async (data: CreateAccountFormData) => {
    try {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (editAccount) {
        // Update existing account
        updateAccount(editAccount.id, {
          name: data.name,
          type: data.type,
          balance: data.balance,
          currency: data.currency,
          status: data.status,
          institution: data.institution,
          accountNumberLast4: data.accountNumberLast4,
          openedDate: data.openedDate,
          excludeFromStats: data.excludeFromStats,
          notes: data.notes,
          // Type-specific details would be included here
          ...(data.type === "SAVINGS" &&
            data.savingsDetails && {
              savingsDetails: {
                interestRatePerAnnum: data.savingsDetails.interestRatePerAnnum
                  ? parseFloat(data.savingsDetails.interestRatePerAnnum)
                  : undefined,
                requiredMonthlyAdb: data.savingsDetails.requiredMonthlyAdb,
                requiredBalanceToEarnInterest:
                  data.savingsDetails.requiredBalanceToEarnInterest,
                totalInterestEarned:
                  editAccount.savingsDetails?.totalInterestEarned || "0.00",
              },
            }),
          ...(data.type === "CREDIT_CARD" &&
            data.creditDetails && {
              creditDetails: {
                creditLimit: data.creditDetails.creditLimit,
                availableCredit: data.creditDetails.availableCredit,
                statementDate: parseInt(data.creditDetails.statementDate),
                dueDateDaysAfterStatement: parseInt(
                  data.creditDetails.dueDateDaysAfterStatement
                ),
                financeChargeInterestRate: parseFloat(
                  data.creditDetails.financeChargeInterestRate
                ),
                annualFeeAmount: data.creditDetails.annualFeeAmount,
                rewardsType: editAccount.creditDetails?.rewardsType || "NONE",
                rewardsBalance:
                  editAccount.creditDetails?.rewardsBalance || "0",
              },
            }),
          ...(data.type === "LOAN" &&
            data.loanDetails && {
              loanDetails: {
                loanType: data.loanDetails.loanType,
                originalPrincipal: data.loanDetails.originalPrincipal,
                interestRate: parseFloat(data.loanDetails.interestRate),
                termMonths: parseInt(data.loanDetails.termMonths),
                remainingTermMonths:
                  editAccount.loanDetails?.remainingTermMonths,
                maturityDate: data.loanDetails.maturityDate,
                nextPaymentDate: data.loanDetails.nextPaymentDate,
                nextPaymentAmount: data.loanDetails.nextPaymentAmount,
              },
            }),
          ...(data.type === "INSURANCE" &&
            data.insuranceDetails && {
              insuranceDetails: {
                policyType: data.insuranceDetails.policyType,
                policyNumber: data.insuranceDetails.policyNumber,
                coverageAmount: data.insuranceDetails.coverageAmount,
                premiumAmount: data.insuranceDetails.premiumAmount,
                premiumDueDate: data.insuranceDetails.premiumDueDate,
                deductible: data.insuranceDetails.deductible,
                beneficiaries: data.insuranceDetails.beneficiaries,
              },
            }),
        });
        toast.success("Account updated successfully!");
      } else {
        // Create new account
        addAccount({
          name: data.name,
          type: data.type,
          balance: data.balance,
          currency: data.currency,
          status: data.status,
          institution: data.institution,
          accountNumberLast4: data.accountNumberLast4,
          openedDate: data.openedDate,
          excludeFromStats: data.excludeFromStats,
          notes: data.notes,
          // Type-specific details would be included here
          ...(data.type === "SAVINGS" &&
            data.savingsDetails && {
              savingsDetails: {
                interestRatePerAnnum: data.savingsDetails.interestRatePerAnnum
                  ? parseFloat(data.savingsDetails.interestRatePerAnnum)
                  : undefined,
                requiredMonthlyAdb: data.savingsDetails.requiredMonthlyAdb,
                requiredBalanceToEarnInterest:
                  data.savingsDetails.requiredBalanceToEarnInterest,
                totalInterestEarned: "0.00",
              },
            }),
          ...(data.type === "CREDIT_CARD" &&
            data.creditDetails && {
              creditDetails: {
                creditLimit: data.creditDetails.creditLimit,
                availableCredit: data.creditDetails.availableCredit,
                statementDate: parseInt(data.creditDetails.statementDate),
                dueDateDaysAfterStatement: parseInt(
                  data.creditDetails.dueDateDaysAfterStatement
                ),
                financeChargeInterestRate: parseFloat(
                  data.creditDetails.financeChargeInterestRate
                ),
                annualFeeAmount: data.creditDetails.annualFeeAmount,
                rewardsType: "NONE",
                rewardsBalance: "0",
              },
            }),
          ...(data.type === "LOAN" &&
            data.loanDetails && {
              loanDetails: {
                loanType: data.loanDetails.loanType,
                originalPrincipal: data.loanDetails.originalPrincipal,
                interestRate: parseFloat(data.loanDetails.interestRate),
                termMonths: parseInt(data.loanDetails.termMonths),
                remainingTermMonths: parseInt(data.loanDetails.termMonths),
                maturityDate: data.loanDetails.maturityDate,
                nextPaymentDate: data.loanDetails.nextPaymentDate,
                nextPaymentAmount: data.loanDetails.nextPaymentAmount,
              },
            }),
          ...(data.type === "INSURANCE" &&
            data.insuranceDetails && {
              insuranceDetails: {
                policyType: data.insuranceDetails.policyType,
                policyNumber: data.insuranceDetails.policyNumber,
                coverageAmount: data.insuranceDetails.coverageAmount,
                premiumAmount: data.insuranceDetails.premiumAmount,
                premiumDueDate: data.insuranceDetails.premiumDueDate,
                deductible: data.insuranceDetails.deductible,
                beneficiaries: data.insuranceDetails.beneficiaries,
              },
            }),
        });
        toast.success("Account created successfully!");
      }

      handleClose();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editAccount ? "Edit Account" : "Add New Account"}
          </DialogTitle>
          <DialogDescription>
            {editAccount
              ? "Update your account information and settings."
              : "Add a new financial account to track your money."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="details">Account Details</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              {/* Account Name */}
              <div>
                <Label htmlFor="name">Account Name *</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="e.g., BPI Savings Account"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              {/* Account Type */}
              <div>
                <Label htmlFor="type">Account Type *</Label>
                <Select
                  value={form.watch("type")}
                  onValueChange={(value) => form.setValue("type", value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {accountTypeLabels[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.type && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.type.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Balance */}
                <div>
                  <Label htmlFor="balance">
                    Current Balance *
                    {(selectedType === "CREDIT_CARD" ||
                      selectedType === "LOAN") &&
                      " (negative for owed amount)"}
                  </Label>
                  <Input
                    id="balance"
                    {...form.register("balance")}
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                  />
                  {form.formState.errors.balance && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.balance.message}
                    </p>
                  )}
                </div>

                {/* Currency */}
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={form.watch("currency")}
                    onValueChange={(value) => form.setValue("currency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PHP">PHP (₱)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Institution */}
                <div>
                  <Label htmlFor="institution">Financial Institution</Label>
                  <Input
                    id="institution"
                    {...form.register("institution")}
                    placeholder="e.g., Bank of the Philippine Islands"
                  />
                </div>

                {/* Last 4 digits */}
                <div>
                  <Label htmlFor="accountNumberLast4">
                    Account Number (Last 4 digits)
                  </Label>
                  <Input
                    id="accountNumberLast4"
                    {...form.register("accountNumberLast4")}
                    placeholder="1234"
                    maxLength={4}
                  />
                  {form.formState.errors.accountNumberLast4 && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.accountNumberLast4.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Opened Date */}
                <div>
                  <Label htmlFor="openedDate">Date Opened *</Label>
                  <Input
                    id="openedDate"
                    type="date"
                    {...form.register("openedDate")}
                  />
                  {form.formState.errors.openedDate && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.openedDate.message}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={form.watch("status")}
                    onValueChange={(value) =>
                      form.setValue("status", value as any)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {accountStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0) + status.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Exclude from Stats */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="excludeFromStats"
                  checked={form.watch("excludeFromStats")}
                  onCheckedChange={(checked) =>
                    form.setValue("excludeFromStats", checked)
                  }
                />
                <Label htmlFor="excludeFromStats">
                  Exclude from statistics and net worth calculations
                </Label>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  {...form.register("notes")}
                  placeholder="Optional notes about this account..."
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              {/* Savings Account Details */}
              {selectedType === "SAVINGS" && (
                <div className="space-y-4">
                  <h4 className="font-medium">Savings Account Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="interestRate">
                        Interest Rate (% per annum)
                      </Label>
                      <Input
                        id="interestRate"
                        {...form.register(
                          "savingsDetails.interestRatePerAnnum"
                        )}
                        placeholder="2.5"
                        type="number"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <Label htmlFor="requiredAdb">Required Monthly ADB</Label>
                      <Input
                        id="requiredAdb"
                        {...form.register("savingsDetails.requiredMonthlyAdb")}
                        placeholder="10000.00"
                        type="number"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="minBalance">
                      Minimum Balance to Earn Interest
                    </Label>
                    <Input
                      id="minBalance"
                      {...form.register(
                        "savingsDetails.requiredBalanceToEarnInterest"
                      )}
                      placeholder="5000.00"
                      type="number"
                      step="0.01"
                    />
                  </div>
                </div>
              )}

              {/* Credit Card Details */}
              {(selectedType === "CREDIT_CARD" ||
                selectedType === "LINE_OF_CREDIT") && (
                <div className="space-y-4">
                  <h4 className="font-medium">Credit Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="creditLimit">Credit Limit *</Label>
                      <Input
                        id="creditLimit"
                        {...form.register("creditDetails.creditLimit")}
                        placeholder="50000.00"
                        type="number"
                        step="0.01"
                      />
                      {form.formState.errors.creditDetails?.creditLimit && (
                        <p className="text-sm text-red-500 mt-1">
                          {
                            form.formState.errors.creditDetails.creditLimit
                              .message
                          }
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="availableCredit">
                        Available Credit *
                      </Label>
                      <Input
                        id="availableCredit"
                        {...form.register("creditDetails.availableCredit")}
                        placeholder="41550.00"
                        type="number"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="statementDate">
                        Statement Date (day of month) *
                      </Label>
                      <Input
                        id="statementDate"
                        {...form.register("creditDetails.statementDate")}
                        placeholder="15"
                        type="number"
                        min="1"
                        max="31"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dueDays">
                        Due Date (days after statement) *
                      </Label>
                      <Input
                        id="dueDays"
                        {...form.register(
                          "creditDetails.dueDateDaysAfterStatement"
                        )}
                        placeholder="20"
                        type="number"
                        min="1"
                        max="60"
                      />
                    </div>
                    <div>
                      <Label htmlFor="interestRate">
                        Interest Rate (% per month) *
                      </Label>
                      <Input
                        id="interestRate"
                        {...form.register(
                          "creditDetails.financeChargeInterestRate"
                        )}
                        placeholder="3.5"
                        type="number"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="annualFee">Annual Fee</Label>
                    <Input
                      id="annualFee"
                      {...form.register("creditDetails.annualFeeAmount")}
                      placeholder="2500.00"
                      type="number"
                      step="0.01"
                    />
                  </div>
                </div>
              )}

              {/* Loan Details */}
              {selectedType === "LOAN" && (
                <div className="space-y-4">
                  <h4 className="font-medium">Loan Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="loanType">Loan Type *</Label>
                      <Select
                        value={form.watch("loanDetails.loanType")}
                        onValueChange={(value) =>
                          form.setValue("loanDetails.loanType", value as any)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select loan type" />
                        </SelectTrigger>
                        <SelectContent>
                          {loanTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="originalPrincipal">
                        Original Principal *
                      </Label>
                      <Input
                        id="originalPrincipal"
                        {...form.register("loanDetails.originalPrincipal")}
                        placeholder="1500000.00"
                        type="number"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="loanInterestRate">
                        Interest Rate (% per annum) *
                      </Label>
                      <Input
                        id="loanInterestRate"
                        {...form.register("loanDetails.interestRate")}
                        placeholder="7.5"
                        type="number"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <Label htmlFor="termMonths">Term (months) *</Label>
                      <Input
                        id="termMonths"
                        {...form.register("loanDetails.termMonths")}
                        placeholder="360"
                        type="number"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="maturityDate">Maturity Date *</Label>
                      <Input
                        id="maturityDate"
                        type="date"
                        {...form.register("loanDetails.maturityDate")}
                      />
                    </div>
                    <div>
                      <Label htmlFor="nextPaymentDate">
                        Next Payment Date *
                      </Label>
                      <Input
                        id="nextPaymentDate"
                        type="date"
                        {...form.register("loanDetails.nextPaymentDate")}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="nextPaymentAmount">
                      Next Payment Amount *
                    </Label>
                    <Input
                      id="nextPaymentAmount"
                      {...form.register("loanDetails.nextPaymentAmount")}
                      placeholder="12500.00"
                      type="number"
                      step="0.01"
                    />
                  </div>
                </div>
              )}

              {/* Insurance Details */}
              {selectedType === "INSURANCE" && (
                <div className="space-y-4">
                  <h4 className="font-medium">Insurance Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="policyType">Policy Type *</Label>
                      <Select
                        value={form.watch("insuranceDetails.policyType")}
                        onValueChange={(value) =>
                          form.setValue(
                            "insuranceDetails.policyType",
                            value as any
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select policy type" />
                        </SelectTrigger>
                        <SelectContent>
                          {policyTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="policyNumber">Policy Number *</Label>
                      <Input
                        id="policyNumber"
                        {...form.register("insuranceDetails.policyNumber")}
                        placeholder="PHL-2022-789456"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="coverageAmount">Coverage Amount *</Label>
                      <Input
                        id="coverageAmount"
                        {...form.register("insuranceDetails.coverageAmount")}
                        placeholder="1000000.00"
                        type="number"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <Label htmlFor="premiumAmount">Premium Amount *</Label>
                      <Input
                        id="premiumAmount"
                        {...form.register("insuranceDetails.premiumAmount")}
                        placeholder="8500.00"
                        type="number"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="premiumDueDate">Premium Due Date *</Label>
                      <Input
                        id="premiumDueDate"
                        type="date"
                        {...form.register("insuranceDetails.premiumDueDate")}
                      />
                    </div>
                    <div>
                      <Label htmlFor="deductible">Deductible</Label>
                      <Input
                        id="deductible"
                        {...form.register("insuranceDetails.deductible")}
                        placeholder="0.00"
                        type="number"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="beneficiaries">
                      Beneficiaries (comma-separated)
                    </Label>
                    <Input
                      id="beneficiaries"
                      {...form.register("insuranceDetails.beneficiaries")}
                      placeholder="Maria Dela Cruz, Juan Dela Cruz Jr."
                    />
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editAccount ? "Update Account" : "Create Account"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
