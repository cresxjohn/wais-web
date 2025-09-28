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
import {
  expenseCategories,
  incomeCategories,
  transferCategories,
} from "@/lib/validations/transaction";
import { useAccountStore } from "@/stores/account-store";
import { useTransactionStore, type Payment } from "@/stores/transaction-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDownLeft, ArrowUpRight, Clock, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Payment validation schema
const paymentSchema = z
  .object({
    name: z.string().min(1, "Payment name is required"),
    description: z.string().optional(),
    amount: z
      .string()
      .min(1, "Amount is required")
      .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: "Amount must be a positive number",
      }),
    type: z.enum(["INCOME", "EXPENSE", "TRANSFER"]),
    category: z.string().min(1, "Category is required"),
    accountId: z.string().optional(),
    fromAccountId: z.string().optional(),
    toAccountId: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    status: z
      .enum(["ACTIVE", "PAUSED", "COMPLETED"])
      .optional()
      .default("ACTIVE"),
    isManual: z.boolean().default(false),
    // Recurrence rule
    frequency: z.enum([
      "DAILY",
      "WEEKLY",
      "BI_WEEKLY",
      "MONTHLY",
      "QUARTERLY",
      "SEMI_ANNUALLY",
      "ANNUALLY",
    ]),
    interval: z.number().int().positive().default(1),
    endAfterOccurrences: z.number().int().positive().optional(),
    // Weekly specific
    weeklyDaysOfWeek: z.array(z.number().int().min(0).max(6)).optional(),
    // Monthly specific
    monthlyDayOfMonth: z.number().int().min(1).max(31).optional(),
    monthlyWeekOfMonth: z.number().int().min(1).max(5).optional(),
    monthlyDayOfWeek: z.number().int().min(0).max(6).optional(),
  })
  .refine(
    (data) => {
      if (data.type === "TRANSFER") {
        return (
          data.fromAccountId &&
          data.toAccountId &&
          data.fromAccountId !== data.toAccountId
        );
      } else {
        return data.accountId;
      }
    },
    {
      message: "Please select the appropriate account(s)",
      path: ["accountId"],
    }
  );

type PaymentFormData = z.infer<typeof paymentSchema>;

interface CreatePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editPayment?: Payment | null;
  onClose: () => void;
}

const frequencyLabels = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  BI_WEEKLY: "Bi-weekly",
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  SEMI_ANNUALLY: "Semi-annually",
  ANNUALLY: "Annually",
};

const daysOfWeek = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export function CreatePaymentDialog({
  open,
  onOpenChange,
  editPayment,
  onClose,
}: CreatePaymentDialogProps) {
  const { addPayment, updatePayment } = useTransactionStore();
  const { accounts } = useAccountStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      amount: "",
      type: "EXPENSE",
      category: "",
      accountId: "",
      fromAccountId: "",
      toAccountId: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      status: "ACTIVE",
      isManual: false,
      frequency: "MONTHLY",
      interval: 1,
      endAfterOccurrences: undefined,
      weeklyDaysOfWeek: [],
      monthlyDayOfMonth: undefined,
      monthlyWeekOfMonth: undefined,
      monthlyDayOfWeek: undefined,
    } as PaymentFormData,
  });

  const watchedType = form.watch("type");
  const watchedFrequency = form.watch("frequency");

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
    if (editPayment && open) {
      form.reset({
        name: editPayment.name,
        description: editPayment.description || "",
        amount: editPayment.amount,
        type: editPayment.type,
        category: editPayment.category,
        accountId: editPayment.accountId,
        fromAccountId: editPayment.fromAccountId,
        toAccountId: editPayment.toAccountId,
        startDate: editPayment.startDate,
        endDate: editPayment.endDate || "",
        status: editPayment.status,
        isManual: editPayment.isManual,
        // Recurrence rule
        frequency: editPayment.recurrenceRule?.frequency || "MONTHLY",
        interval: editPayment.recurrenceRule?.interval || 1,
        endAfterOccurrences: editPayment.recurrenceRule?.endAfterOccurrences,
        weeklyDaysOfWeek: editPayment.recurrenceRule?.weeklyDaysOfWeek || [],
        monthlyDayOfMonth: editPayment.recurrenceRule?.monthlyDayOfMonth,
        monthlyWeekOfMonth: editPayment.recurrenceRule?.monthlyWeekOfMonth,
        monthlyDayOfWeek: editPayment.recurrenceRule?.monthlyDayOfWeek,
      });
    }
  }, [editPayment, open, form]);

  // Reset category when type changes
  useEffect(() => {
    if (!editPayment) {
      form.setValue("category", "");
    }
  }, [watchedType, editPayment, form]);

  const onSubmit = async (data: PaymentFormData) => {
    try {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const paymentData = {
        name: data.name,
        description: data.description,
        amount: data.amount,
        type: data.type,
        category: data.category,
        accountId: data.accountId,
        fromAccountId: data.fromAccountId,
        toAccountId: data.toAccountId,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
        isManual: data.isManual,
        recurrenceRule: {
          id:
            editPayment?.recurrenceRule?.id ||
            Math.random().toString(36).substring(7),
          frequency: data.frequency,
          interval: data.interval,
          endDate: data.endDate,
          endAfterOccurrences: data.endAfterOccurrences,
          weeklyDaysOfWeek: data.weeklyDaysOfWeek,
          monthlyDayOfMonth: data.monthlyDayOfMonth,
          monthlyWeekOfMonth: data.monthlyWeekOfMonth,
          monthlyDayOfWeek: data.monthlyDayOfWeek,
        },
      };

      if (editPayment) {
        updatePayment(editPayment.id, paymentData);
        toast.success("Recurring payment updated successfully!");
      } else {
        addPayment(paymentData);
        toast.success("Recurring payment created successfully!");
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <DialogTitle>
              {editPayment ? "Edit Recurring Payment" : "Add Recurring Payment"}
            </DialogTitle>
          </div>
          <DialogDescription>
            {editPayment
              ? "Update your recurring payment schedule and details."
              : "Set up automatic recurring income, expenses, or transfers."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Payment Details</TabsTrigger>
              <TabsTrigger value="schedule">Schedule & Recurrence</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              {/* Payment Name */}
              <div>
                <Label htmlFor="name">Payment Name *</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="e.g., Monthly Salary, Netflix Subscription"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  {...form.register("description")}
                  placeholder="Optional description"
                />
              </div>

              {/* Transaction Type */}
              <div>
                <Label htmlFor="type">Payment Type *</Label>
                <Select
                  value={form.watch("type")}
                  onValueChange={(value) => form.setValue("type", value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXPENSE">
                      <div className="flex items-center gap-2">
                        <ArrowUpRight className="h-4 w-4 text-red-600" />
                        <span>Recurring Expense</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="INCOME">
                      <div className="flex items-center gap-2">
                        <ArrowDownLeft className="h-4 w-4 text-green-600" />
                        <span>Recurring Income</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="TRANSFER">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 text-blue-600" />
                        <span>Recurring Transfer</span>
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
                            <SelectItem
                              key={account.value}
                              value={account.value}
                            >
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
                      onValueChange={(value) =>
                        form.setValue("toAccountId", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination account" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableAccounts(form.watch("fromAccountId")).map(
                          (account) => (
                            <SelectItem
                              key={account.value}
                              value={account.value}
                            >
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

              <div className="grid grid-cols-2 gap-4">
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
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="PAUSED">Paused</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Manual Processing */}
                <div className="flex items-center space-x-2 mt-6">
                  <Switch
                    id="isManual"
                    checked={form.watch("isManual")}
                    onCheckedChange={(checked) =>
                      form.setValue("isManual", checked)
                    }
                  />
                  <Label htmlFor="isManual">Manual processing required</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Start Date */}
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    {...form.register("startDate")}
                  />
                  {form.formState.errors.startDate && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.startDate.message}
                    </p>
                  )}
                </div>

                {/* End Date */}
                <div>
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    {...form.register("endDate")}
                  />
                </div>
              </div>

              {/* Frequency */}
              <div>
                <Label htmlFor="frequency">Frequency *</Label>
                <Select
                  value={form.watch("frequency")}
                  onValueChange={(value) =>
                    form.setValue("frequency", value as any)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(frequencyLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.frequency && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.frequency.message}
                  </p>
                )}
              </div>

              {/* Interval */}
              <div>
                <Label htmlFor="interval">
                  Every {form.watch("interval")}{" "}
                  {frequencyLabels[watchedFrequency]?.toLowerCase()}
                </Label>
                <Input
                  id="interval"
                  type="number"
                  min="1"
                  max="12"
                  {...form.register("interval", { valueAsNumber: true })}
                />
                <p className="text-xs text-gray-500 mt-1">
                  How often this payment occurs (e.g., every 2 weeks)
                </p>
              </div>

              {/* Weekly specific options */}
              {watchedFrequency === "WEEKLY" && (
                <div>
                  <Label>Days of Week</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {daysOfWeek.map((day) => (
                      <div
                        key={day.value}
                        className="flex items-center space-x-2"
                      >
                        <Switch
                          id={`day-${day.value}`}
                          checked={
                            form
                              .watch("weeklyDaysOfWeek")
                              ?.includes(day.value) || false
                          }
                          onCheckedChange={(checked) => {
                            const current =
                              form.watch("weeklyDaysOfWeek") || [];
                            if (checked) {
                              form.setValue("weeklyDaysOfWeek", [
                                ...current,
                                day.value,
                              ]);
                            } else {
                              form.setValue(
                                "weeklyDaysOfWeek",
                                current.filter((d) => d !== day.value)
                              );
                            }
                          }}
                        />
                        <Label htmlFor={`day-${day.value}`} className="text-sm">
                          {day.label.slice(0, 3)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Monthly specific options */}
              {watchedFrequency === "MONTHLY" && (
                <div>
                  <Label htmlFor="monthlyDayOfMonth">Day of Month</Label>
                  <Input
                    id="monthlyDayOfMonth"
                    type="number"
                    min="1"
                    max="31"
                    {...form.register("monthlyDayOfMonth", {
                      valueAsNumber: true,
                    })}
                    placeholder="e.g., 15 for 15th of each month"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty for last day of month
                  </p>
                </div>
              )}

              {/* End after occurrences */}
              <div>
                <Label htmlFor="endAfterOccurrences">
                  End After (Optional)
                </Label>
                <Input
                  id="endAfterOccurrences"
                  type="number"
                  min="1"
                  {...form.register("endAfterOccurrences", {
                    valueAsNumber: true,
                  })}
                  placeholder="Number of occurrences"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to continue indefinitely
                </p>
              </div>
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
              {editPayment ? "Update Payment" : "Create Payment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
