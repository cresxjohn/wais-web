import { z } from "zod";

export const accountTypes = [
  "CASH",
  "SAVINGS",
  "CHECKING",
  "CREDIT_CARD",
  "LINE_OF_CREDIT",
  "INSURANCE",
  "LOAN",
] as const;

export const accountStatuses = ["ACTIVE", "INACTIVE", "CLOSED"] as const;

export const baseAccountSchema = z.object({
  name: z
    .string()
    .min(1, "Account name is required")
    .min(2, "Account name must be at least 2 characters"),
  type: z.enum(accountTypes, {
    required_error: "Account type is required",
  }),
  balance: z
    .string()
    .min(1, "Balance is required")
    .refine((val) => !isNaN(parseFloat(val)), {
      message: "Balance must be a valid number",
    }),
  currency: z.string().default("PHP"),
  status: z.enum(accountStatuses).default("ACTIVE"),
  institution: z.string().optional(),
  accountNumberLast4: z
    .string()
    .optional()
    .refine(
      (val) => !val || (val.length === 4 && /^\d{4}$/.test(val)),
      "Account number must be exactly 4 digits"
    ),
  openedDate: z.string().min(1, "Opened date is required"),
  excludeFromStats: z.boolean().default(false),
  notes: z.string().optional(),
});

export const savingsDetailsSchema = z.object({
  interestRatePerAnnum: z
    .string()
    .optional()
    .refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
      {
        message: "Interest rate must be a valid positive number",
      }
    ),
  requiredMonthlyAdb: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(parseFloat(val)), {
      message: "Required ADB must be a valid number",
    }),
  requiredBalanceToEarnInterest: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(parseFloat(val)), {
      message: "Required balance must be a valid number",
    }),
});

export const creditDetailsSchema = z.object({
  creditLimit: z
    .string()
    .min(1, "Credit limit is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Credit limit must be a positive number",
    }),
  availableCredit: z
    .string()
    .min(1, "Available credit is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: "Available credit must be a non-negative number",
    }),
  statementDate: z
    .string()
    .min(1, "Statement date is required")
    .refine(
      (val) => {
        const num = parseInt(val);
        return !isNaN(num) && num >= 1 && num <= 31;
      },
      { message: "Statement date must be between 1 and 31" }
    ),
  dueDateDaysAfterStatement: z
    .string()
    .min(1, "Due date days is required")
    .refine(
      (val) => {
        const num = parseInt(val);
        return !isNaN(num) && num >= 1 && num <= 60;
      },
      { message: "Due date days must be between 1 and 60" }
    ),
  financeChargeInterestRate: z
    .string()
    .min(1, "Interest rate is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: "Interest rate must be a non-negative number",
    }),
  annualFeeAmount: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(parseFloat(val)), {
      message: "Annual fee must be a valid number",
    }),
});

export const loanDetailsSchema = z.object({
  loanType: z.enum([
    "PERSONAL",
    "AUTO",
    "MORTGAGE",
    "BUSINESS",
    "SALARY",
    "PAG_IBIG",
    "SSS",
  ]),
  originalPrincipal: z
    .string()
    .min(1, "Original principal is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Original principal must be a positive number",
    }),
  interestRate: z
    .string()
    .min(1, "Interest rate is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: "Interest rate must be a non-negative number",
    }),
  termMonths: z
    .string()
    .min(1, "Term in months is required")
    .refine(
      (val) => {
        const num = parseInt(val);
        return !isNaN(num) && num > 0;
      },
      { message: "Term must be a positive number" }
    ),
  maturityDate: z.string().min(1, "Maturity date is required"),
  nextPaymentDate: z.string().min(1, "Next payment date is required"),
  nextPaymentAmount: z
    .string()
    .min(1, "Next payment amount is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Next payment amount must be a positive number",
    }),
});

export const insuranceDetailsSchema = z.object({
  policyType: z.enum(["LIFE", "HEALTH", "AUTO", "HOME", "TRAVEL", "VUL"]),
  policyNumber: z.string().min(1, "Policy number is required"),
  coverageAmount: z
    .string()
    .min(1, "Coverage amount is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Coverage amount must be a positive number",
    }),
  premiumAmount: z
    .string()
    .min(1, "Premium amount is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Premium amount must be a positive number",
    }),
  premiumDueDate: z.string().min(1, "Premium due date is required"),
  deductible: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(parseFloat(val)), {
      message: "Deductible must be a valid number",
    }),
  beneficiaries: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(",").map((s) => s.trim()) : [])),
});

export const createAccountSchema = baseAccountSchema.and(
  z.discriminatedUnion("type", [
    z.object({
      type: z.literal("CASH"),
    }),
    z.object({
      type: z.literal("CHECKING"),
    }),
    z.object({
      type: z.literal("SAVINGS"),
      savingsDetails: savingsDetailsSchema.optional(),
    }),
    z.object({
      type: z.literal("CREDIT_CARD"),
      creditDetails: creditDetailsSchema,
    }),
    z.object({
      type: z.literal("LINE_OF_CREDIT"),
      creditDetails: creditDetailsSchema,
    }),
    z.object({
      type: z.literal("LOAN"),
      loanDetails: loanDetailsSchema,
    }),
    z.object({
      type: z.literal("INSURANCE"),
      insuranceDetails: insuranceDetailsSchema,
    }),
  ])
);

export const updateAccountSchema = z.object({
  id: z.string().min(1, "Account ID is required"),
  name: baseAccountSchema.shape.name.optional(),
  type: baseAccountSchema.shape.type.optional(),
  balance: baseAccountSchema.shape.balance.optional(),
  currency: baseAccountSchema.shape.currency.optional(),
  status: baseAccountSchema.shape.status.optional(),
  openedDate: baseAccountSchema.shape.openedDate.optional(),
  notes: baseAccountSchema.shape.notes.optional(),
  // Details are optional for updates - only include schemas that exist
  savingsDetails: savingsDetailsSchema.optional(),
  creditDetails: creditDetailsSchema.optional(),
  loanDetails: loanDetailsSchema.optional(),
  insuranceDetails: insuranceDetailsSchema.optional(),
});

export type CreateAccountFormData = z.infer<typeof createAccountSchema>;
export type UpdateAccountFormData = z.infer<typeof updateAccountSchema>;
export type AccountType = (typeof accountTypes)[number];
export type AccountStatus = (typeof accountStatuses)[number];
