import { z } from "zod";

export const transactionTypes = ["INCOME", "EXPENSE", "TRANSFER"] as const;
export const transactionStatuses = [
  "PENDING",
  "COMPLETED",
  "CANCELLED",
] as const;

export const baseTransactionSchema = z.object({
  description: z
    .string()
    .min(1, "Description is required")
    .min(2, "Description must be at least 2 characters"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a positive number",
    }),
  type: z.enum(transactionTypes, {
    required_error: "Transaction type is required",
  }),
  category: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
  isRecurring: z.boolean().default(false),
  tags: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(",").map((s) => s.trim()) : [])),
});

export const expenseTransactionSchema = baseTransactionSchema.extend({
  type: z.literal("EXPENSE"),
  accountId: z.string().min(1, "Account is required"),
});

export const incomeTransactionSchema = baseTransactionSchema.extend({
  type: z.literal("INCOME"),
  accountId: z.string().min(1, "Account is required"),
});

export const transferTransactionSchema = baseTransactionSchema.extend({
  type: z.literal("TRANSFER"),
  fromAccountId: z.string().min(1, "From account is required"),
  toAccountId: z.string().min(1, "To account is required"),
  transferFee: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
      {
        message: "Transfer fee must be a non-negative number",
      }
    ),
});

export const createTransactionSchema = z.discriminatedUnion("type", [
  expenseTransactionSchema,
  incomeTransactionSchema,
  transferTransactionSchema,
]);

// Recurrence patterns
export const recurrenceFrequencies = [
  "DAILY",
  "WEEKLY",
  "BI_WEEKLY",
  "MONTHLY",
  "QUARTERLY",
  "SEMI_ANNUALLY",
  "ANNUALLY",
] as const;

export const recurrenceSchema = z.object({
  frequency: z.enum(recurrenceFrequencies),
  interval: z.number().int().positive().default(1),
  endDate: z.string().optional(),
  endAfterOccurrences: z.number().int().positive().optional(),
  weeklyDaysOfWeek: z.array(z.number().int().min(0).max(6)).optional(),
  monthlyDayOfMonth: z.number().int().min(1).max(31).optional(),
  monthlyWeekOfMonth: z.number().int().min(1).max(5).optional(),
  monthlyDayOfWeek: z.number().int().min(0).max(6).optional(),
});

export const createRecurringTransactionSchema = z.object({
  // Base transaction fields
  description: baseTransactionSchema.shape.description,
  amount: baseTransactionSchema.shape.amount,
  date: baseTransactionSchema.shape.date,
  category: baseTransactionSchema.shape.category,
  notes: baseTransactionSchema.shape.notes,
  tags: baseTransactionSchema.shape.tags,

  // Type-specific fields (make them all optional to handle different transaction types)
  type: z.enum(["EXPENSE", "INCOME", "TRANSFER"]),
  accountId: z.string().optional(),
  fromAccountId: z.string().optional(),
  toAccountId: z.string().optional(),
  transferFee: z.string().optional(),

  // Recurring-specific fields
  isRecurring: z.literal(true),
  recurrenceRule: recurrenceSchema,
});

// Categories for different transaction types
export const expenseCategories = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  "Home & Garden",
  "Personal Care",
  "Gifts & Donations",
  "Business",
  "Investments",
  "Insurance",
  "Taxes",
  "Fees & Charges",
  "Other",
] as const;

export const incomeCategories = [
  "Salary",
  "Freelance",
  "Business",
  "Investment Returns",
  "Rental Income",
  "Government Benefits",
  "Gifts Received",
  "Tax Refund",
  "Bonus",
  "Commission",
  "Interest Earned",
  "Dividends",
  "Other",
] as const;

export const transferCategories = [
  "Account Transfer",
  "Savings",
  "Investment",
  "Loan Payment",
  "Credit Card Payment",
  "Bill Payment",
  "Emergency Fund",
  "Goal Saving",
  "Other",
] as const;

export type TransactionType = (typeof transactionTypes)[number];
export type TransactionStatus = (typeof transactionStatuses)[number];
export type CreateTransactionFormData = z.infer<typeof createTransactionSchema>;
export type CreateRecurringTransactionFormData = z.infer<
  typeof createRecurringTransactionSchema
>;
export type RecurrenceFrequency = (typeof recurrenceFrequencies)[number];
export type ExpenseCategory = (typeof expenseCategories)[number];
export type IncomeCategory = (typeof incomeCategories)[number];
export type TransferCategory = (typeof transferCategories)[number];
