import { type Notification } from "@/stores/app-store";

// Initialize sample notifications for demonstration
export const initializeSampleNotifications = (): Notification[] => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const twoHoursAgo = new Date(now);
  twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

  const sampleNotifications: Notification[] = [
    {
      id: "welcome-notification",
      title: "Welcome to WAIS!",
      message:
        "Start managing your finances with AI-powered insights. Connect your accounts to get started.",
      type: "info",
      timestamp: yesterday.toISOString(),
      read: false,
      actionLabel: "Get Started",
      actionUrl: "/accounts",
    },
    {
      id: "payment-reminder-1",
      title: "Payment Due Tomorrow",
      message:
        "Your credit card payment of ₱5,250 is due tomorrow. Don't forget to pay!",
      type: "payment",
      timestamp: twoHoursAgo.toISOString(),
      read: false,
      actionLabel: "Pay Now",
      actionUrl: "/accounts",
    },
    {
      id: "budget-alert-food",
      title: "Budget Alert: Food & Dining",
      message:
        "You've spent 85% of your monthly food budget (₱4,250 of ₱5,000). Consider meal planning to stay on track.",
      type: "budget",
      timestamp: twoHoursAgo.toISOString(),
      read: false,
      actionLabel: "View Budget",
      actionUrl: "/reports",
    },
    {
      id: "transaction-success",
      title: "Transaction Recorded",
      message: "Successfully added transaction: Grocery Shopping for ₱2,150.",
      type: "success",
      timestamp: oneWeekAgo.toISOString(),
      read: true,
    },
    {
      id: "ai-insight-1",
      title: "AI Insight: Savings Opportunity",
      message:
        "You could save ₱450/month by switching to a different mobile plan. Based on your spending pattern.",
      type: "info",
      timestamp: oneWeekAgo.toISOString(),
      read: false,
      actionLabel: "View Insights",
      actionUrl: "/insights",
    },
    {
      id: "security-alert",
      title: "New Login Detected",
      message:
        "Someone signed into your account from a new device in Manila, Philippines.",
      type: "warning",
      timestamp: yesterday.toISOString(),
      read: true,
      actionLabel: "Review Security",
      actionUrl: "/settings?tab=account",
    },
    {
      id: "monthly-report",
      title: "Monthly Report Ready",
      message:
        "Your November financial report is ready with insights on spending patterns and savings.",
      type: "reminder",
      timestamp: oneWeekAgo.toISOString(),
      read: false,
      actionLabel: "View Report",
      actionUrl: "/reports",
    },
    {
      id: "goal-achievement",
      title: "Goal Achieved! 🎉",
      message:
        "Congratulations! You've reached your emergency fund goal of ₱50,000.",
      type: "success",
      timestamp: oneWeekAgo.toISOString(),
      read: true,
      actionLabel: "Set New Goal",
      actionUrl: "/insights?tab=goals",
    },
    {
      id: "account-sync-error",
      title: "Account Sync Failed",
      message:
        "Unable to sync transactions from BPI Account ****1234. Please reconnect your account.",
      type: "error",
      timestamp: yesterday.toISOString(),
      read: false,
      actionLabel: "Reconnect Account",
      actionUrl: "/accounts",
    },
    {
      id: "recurring-payment",
      title: "Recurring Payment Scheduled",
      message:
        "Your Netflix subscription payment of ₱549 has been scheduled for December 15th.",
      type: "payment",
      timestamp: oneWeekAgo.toISOString(),
      read: true,
    },
  ];

  return sampleNotifications.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

// Smart notification templates for different scenarios
export const notificationTemplates = {
  paymentReminder: (paymentName: string, amount: number, daysLeft: number) => ({
    title: `Payment Due ${
      daysLeft === 0 ? "Today" : `in ${daysLeft} day${daysLeft > 1 ? "s" : ""}`
    }`,
    message: `Your ${paymentName} payment of ₱${amount.toLocaleString()} is due ${
      daysLeft === 0 ? "today" : `in ${daysLeft} day${daysLeft > 1 ? "s" : ""}`
    }.`,
    type: "payment" as const,
    actionLabel: "Pay Now",
    actionUrl: "/accounts",
  }),

  budgetAlert: (
    category: string,
    percentUsed: number,
    amountSpent: number,
    budgetLimit: number
  ) => ({
    title: `Budget Alert: ${category}`,
    message: `You've spent ${percentUsed}% of your ${category} budget (₱${amountSpent.toLocaleString()} of ₱${budgetLimit.toLocaleString()}).`,
    type: "budget" as const,
    actionLabel: "View Budget",
    actionUrl: "/reports",
  }),

  goalAchievement: (goalName: string, targetAmount: number) => ({
    title: "Goal Achieved! 🎉",
    message: `Congratulations! You've reached your ${goalName} goal of ₱${targetAmount.toLocaleString()}.`,
    type: "success" as const,
    actionLabel: "Set New Goal",
    actionUrl: "/insights?tab=goals",
  }),

  unusualSpending: (
    category: string,
    amount: number,
    averageAmount: number
  ) => ({
    title: "Unusual Spending Detected",
    message: `You spent ₱${amount.toLocaleString()} on ${category} today, which is ${Math.round(
      ((amount - averageAmount) / averageAmount) * 100
    )}% higher than usual.`,
    type: "warning" as const,
    actionLabel: "View Transactions",
    actionUrl: "/transactions",
  }),

  savingsOpportunity: (description: string, potentialSavings: number) => ({
    title: "AI Insight: Savings Opportunity",
    message: `${description} You could save up to ₱${potentialSavings.toLocaleString()}/month.`,
    type: "info" as const,
    actionLabel: "Learn More",
    actionUrl: "/insights",
  }),

  accountSyncIssue: (accountName: string, lastSync: string) => ({
    title: "Account Sync Issue",
    message: `Unable to sync transactions from ${accountName}. Last successful sync was ${lastSync}.`,
    type: "error" as const,
    actionLabel: "Reconnect Account",
    actionUrl: "/accounts",
  }),

  weeklyReport: (totalSpent: number, compareToLastWeek: number) => ({
    title: "Weekly Financial Summary",
    message: `You spent ₱${totalSpent.toLocaleString()} this week, ${
      compareToLastWeek >= 0
        ? `${compareToLastWeek}% more`
        : `${Math.abs(compareToLastWeek)}% less`
    } than last week.`,
    type: "reminder" as const,
    actionLabel: "View Report",
    actionUrl: "/reports",
  }),

  securityAlert: (deviceInfo: string, location: string) => ({
    title: "New Login Detected",
    message: `Someone signed into your account from ${deviceInfo} in ${location}.`,
    type: "warning" as const,
    actionLabel: "Review Security",
    actionUrl: "/settings?tab=account",
  }),

  transactionSuccess: (description: string, amount: number) => ({
    title: "Transaction Recorded",
    message: `Successfully added transaction: ${description} for ₱${amount.toLocaleString()}.`,
    type: "success" as const,
  }),

  recurringPaymentScheduled: (
    paymentName: string,
    amount: number,
    date: string
  ) => ({
    title: "Recurring Payment Scheduled",
    message: `Your ${paymentName} payment of ₱${amount.toLocaleString()} has been scheduled for ${date}.`,
    type: "payment" as const,
  }),
};

// Generate contextual notifications based on user data
export const generateContextualNotifications = (userData: {
  transactions: any[];
  payments: any[];
  accounts: any[];
  budgets?: any[];
}): Notification[] => {
  const notifications: Notification[] = [];
  const now = new Date();

  // Check for upcoming payments
  userData.payments.forEach((payment) => {
    if (payment.status === "ACTIVE" && payment.nextPaymentDate) {
      const paymentDate = new Date(payment.nextPaymentDate);
      const daysUntilDue = Math.ceil(
        (paymentDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysUntilDue <= 3 && daysUntilDue >= 0) {
        notifications.push({
          id: `payment-reminder-${payment.id}`,
          ...notificationTemplates.paymentReminder(
            payment.name,
            parseFloat(payment.amount),
            daysUntilDue
          ),
          timestamp: now.toISOString(),
          read: false,
        });
      }
    }
  });

  // Check for budget alerts (using mock budgets)
  const mockBudgetAlerts = [
    { category: "Food & Dining", spent: 4250, limit: 5000 },
    { category: "Transportation", spent: 3200, limit: 3000 },
    { category: "Entertainment", spent: 1800, limit: 2500 },
  ];

  mockBudgetAlerts.forEach((budget) => {
    const percentUsed = (budget.spent / budget.limit) * 100;
    if (percentUsed >= 80) {
      notifications.push({
        id: `budget-alert-${budget.category
          .toLowerCase()
          .replace(/\s+/g, "-")}`,
        ...notificationTemplates.budgetAlert(
          budget.category,
          Math.round(percentUsed),
          budget.spent,
          budget.limit
        ),
        timestamp: now.toISOString(),
        read: false,
      });
    }
  });

  return notifications;
};

// Notification scheduler for automated notifications
export class NotificationScheduler {
  private intervals: NodeJS.Timeout[] = [];

  startScheduling() {
    // Check for payment reminders every hour
    const paymentReminderInterval = setInterval(() => {
      this.checkPaymentReminders();
    }, 60 * 60 * 1000); // 1 hour

    // Check for budget alerts daily
    const budgetAlertInterval = setInterval(() => {
      this.checkBudgetAlerts();
    }, 24 * 60 * 60 * 1000); // 24 hours

    // Generate weekly reports
    const weeklyReportInterval = setInterval(() => {
      this.generateWeeklyReport();
    }, 7 * 24 * 60 * 60 * 1000); // 7 days

    this.intervals.push(
      paymentReminderInterval,
      budgetAlertInterval,
      weeklyReportInterval
    );
  }

  stopScheduling() {
    this.intervals.forEach((interval) => clearInterval(interval));
    this.intervals = [];
  }

  private checkPaymentReminders() {
    // Implementation would check actual payment data
    console.log("Checking for payment reminders...");
  }

  private checkBudgetAlerts() {
    // Implementation would check actual budget data
    console.log("Checking for budget alerts...");
  }

  private generateWeeklyReport() {
    // Implementation would generate weekly financial reports
    console.log("Generating weekly report...");
  }
}

export const notificationScheduler = new NotificationScheduler();
