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
import { Textarea } from "@/components/ui/textarea";
import {
  createTransactionSchema,
  expenseCategories,
  incomeCategories,
  transferCategories,
  type CreateTransactionFormData,
} from "@/lib/validations/transaction";
import { useAccountStore } from "@/stores/account-store";
import {
  useTransactionStore,
  type Transaction,
} from "@/stores/transaction-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDownLeft, ArrowUpRight, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CreateTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editTransaction?: Transaction | null;
  onClose: () => void;
}

export function CreateTransactionDialog({
  open,
  onOpenChange,
  editTransaction,
  onClose,
}: CreateTransactionDialogProps) {
  const { addTransaction, updateTransaction } = useTransactionStore();
  const { accounts } = useAccountStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateTransactionFormData>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      description: "",
      amount: "",
      type: "EXPENSE",
      category: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
      isRecurring: false,
      tags: "",
    },
  });

  const watchedType = form.watch("type");

  // Get appropriate categories based on transaction type
  const getCategories = () => {
    switch (watchedType) {
      case "INCOME":
        return incomeCategories.map((cat) => ({ value: cat, label: cat }));
      case "TRANSFER":
        return transferCategories.map((cat) => ({ value: cat, label: cat }));
      default:
        return expenseCategories.map((cat) => ({ value: cat, label: cat }));
    }
  };

  // Get appropriate accounts based on transaction type
  const getAvailableAccounts = (excludeId?: string) => {
    return accounts
      .filter(
        (account) => account.status === "ACTIVE" && account.id !== excludeId
      )
      .map((account) => ({
        value: account.id,
        label: `${account.name} (${account.type})`,
      }));
  };

  // Populate form when editing
  useEffect(() => {
    if (editTransaction && open) {
      form.reset({
        description: editTransaction.description,
        amount: editTransaction.amount,
        type: editTransaction.type,
        category: editTransaction.category,
        date: editTransaction.date,
        notes: editTransaction.notes || "",
        isRecurring: editTransaction.isRecurring,
        tags: editTransaction.tags.join(", "),
        // Type-specific fields
        ...(editTransaction.type !== "TRANSFER" && {
          accountId: editTransaction.accountId,
        }),
        ...(editTransaction.type === "TRANSFER" && {
          fromAccountId: editTransaction.fromAccountId,
          toAccountId: editTransaction.toAccountId,
          transferFee: editTransaction.transferFee || "",
        }),
      });
    }
  }, [editTransaction, open, form]);

  // Reset category when type changes
  useEffect(() => {
    if (!editTransaction) {
      form.setValue("category", "");
    }
  }, [watchedType, editTransaction, form]);

  const onSubmit = async (data: CreateTransactionFormData) => {
    try {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const transactionData = {
        description: data.description,
        amount: data.amount,
        type: data.type,
        category: data.category,
        date: data.date,
        status: "COMPLETED" as const,
        notes: data.notes,
        tags: data.tags || [],
        isRecurring: data.isRecurring,
        // Type-specific fields
        ...(data.type !== "TRANSFER" && {
          accountId: data.accountId,
        }),
        ...(data.type === "TRANSFER" && {
          fromAccountId: data.fromAccountId,
          toAccountId: data.toAccountId,
          transferFee: data.transferFee,
          transferGroupId: Math.random().toString(36).substring(7),
        }),
      };

      if (editTransaction) {
        updateTransaction(editTransaction.id, transactionData);
        toast.success("Transaction updated successfully!");
      } else {
        addTransaction(transactionData);
        toast.success("Transaction created successfully!");
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

  const getTypeIcon = () => {
    switch (watchedType) {
      case "INCOME":
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
      case "TRANSFER":
        return <RefreshCw className="h-4 w-4 text-blue-600" />;
      default:
        return <ArrowUpRight className="h-4 w-4 text-red-600" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {getTypeIcon()}
            <DialogTitle>
              {editTransaction ? "Edit Transaction" : "Add New Transaction"}
            </DialogTitle>
          </div>
          <DialogDescription>
            {editTransaction
              ? "Update your transaction details."
              : "Record a new income, expense, or transfer."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Transaction Type */}
          <div>
            <Label htmlFor="type">Transaction Type *</Label>
            <Select
              value={form.watch("type")}
              onValueChange={(value) => form.setValue("type", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EXPENSE">
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4 text-red-600" />
                    <span>Expense</span>
                  </div>
                </SelectItem>
                <SelectItem value="INCOME">
                  <div className="flex items-center gap-2">
                    <ArrowDownLeft className="h-4 w-4 text-green-600" />
                    <span>Income</span>
                  </div>
                </SelectItem>
                <SelectItem value="TRANSFER">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-blue-600" />
                    <span>Transfer</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.type && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.type.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Description */}
            <div>
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                {...form.register("description")}
                placeholder="e.g., Lunch at Jollibee"
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            {/* Amount */}
            <div>
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                {...form.register("amount")}
                placeholder="0.00"
                type="number"
                step="0.01"
              />
              {form.formState.errors.amount && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.amount.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={form.watch("category")}
                onValueChange={(value) => form.setValue("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {getCategories().map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.category && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.category.message}
                </p>
              )}
            </div>

            {/* Date */}
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input id="date" type="date" {...form.register("date")} />
              {form.formState.errors.date && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.date.message}
                </p>
              )}
            </div>
          </div>

          {/* Account Selection - Type Specific */}
          {watchedType === "TRANSFER" ? (
            <div className="grid grid-cols-2 gap-4">
              {/* From Account */}
              <div>
                <Label htmlFor="fromAccountId">From Account *</Label>
                <Select
                  value={form.watch("fromAccountId")}
                  onValueChange={(value) =>
                    form.setValue("fromAccountId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source account" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableAccounts(form.watch("toAccountId")).map(
                      (account) => (
                        <SelectItem key={account.value} value={account.value}>
                          {account.label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                {form.formState.errors.fromAccountId && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.fromAccountId.message}
                  </p>
                )}
              </div>

              {/* To Account */}
              <div>
                <Label htmlFor="toAccountId">To Account *</Label>
                <Select
                  value={form.watch("toAccountId")}
                  onValueChange={(value) => form.setValue("toAccountId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination account" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableAccounts(form.watch("fromAccountId")).map(
                      (account) => (
                        <SelectItem key={account.value} value={account.value}>
                          {account.label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                {form.formState.errors.toAccountId && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.toAccountId.message}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div>
              <Label htmlFor="accountId">Account *</Label>
              <Select
                value={form.watch("accountId")}
                onValueChange={(value) => form.setValue("accountId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableAccounts().map((account) => (
                    <SelectItem key={account.value} value={account.value}>
                      {account.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.accountId && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.accountId.message}
                </p>
              )}
            </div>
          )}

          {/* Transfer Fee (only for transfers) */}
          {watchedType === "TRANSFER" && (
            <div>
              <Label htmlFor="transferFee">Transfer Fee</Label>
              <Input
                id="transferFee"
                {...form.register("transferFee")}
                placeholder="0.00"
                type="number"
                step="0.01"
              />
              {form.formState.errors.transferFee && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.transferFee.message}
                </p>
              )}
            </div>
          )}

          {/* Tags */}
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              {...form.register("tags")}
              placeholder="e.g., food, work, personal (comma-separated)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple tags with commas
            </p>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...form.register("notes")}
              placeholder="Optional notes about this transaction..."
              rows={3}
            />
          </div>

          {/* Recurring Transaction */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isRecurring" className="text-base">
                Recurring Transaction
              </Label>
              <p className="text-sm text-gray-500">
                Create a recurring payment rule for this transaction
              </p>
            </div>
            <Switch
              id="isRecurring"
              checked={form.watch("isRecurring")}
              onCheckedChange={(checked) =>
                form.setValue("isRecurring", checked)
              }
            />
          </div>

          {form.watch("isRecurring") && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900 dark:text-blue-100">
                  Recurring Payment
                </span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                This will create a recurring payment that automatically
                generates future transactions based on the schedule you set up.
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editTransaction ? "Update Transaction" : "Create Transaction"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
