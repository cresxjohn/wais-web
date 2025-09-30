import { type Notification } from "@/stores/app-store";

// Global toast interface - will be set by the toast provider
let globalToast: any = null;

export function setGlobalToast(toast: any) {
  globalToast = toast;
}

// Simple notification function fallback to console
const toast = {
  success: (title: string, message?: string) => {
    if (globalToast) {
      globalToast.success(title, message);
    } else {
      console.log("✅", title, message || "");
    }
  },
  error: (title: string, message?: string) => {
    if (globalToast) {
      globalToast.error(title, message);
    } else {
      console.error("❌", title, message || "");
    }
  },
  info: (title: string, message?: string) => {
    if (globalToast) {
      globalToast.info(title, message);
    } else {
      console.log("ℹ️", title, message || "");
    }
  },
};

// Push notification service
export class NotificationService {
  private static instance: NotificationService;
  private swRegistration: ServiceWorkerRegistration | null = null;
  private pushSubscription: PushSubscription | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.initializeServiceWorker();
    }
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async initializeServiceWorker() {
    if ("serviceWorker" in navigator) {
      try {
        this.swRegistration = await navigator.serviceWorker.ready;
        console.log("Service Worker ready for notifications");
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    }
  }

  // Request permission for notifications
  async requestPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return "denied";
    }

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      toast.success("Notifications enabled successfully!");
    } else if (permission === "denied") {
      toast.error(
        "Notifications blocked",
        "Please enable them in browser settings."
      );
    }

    return permission;
  }

  // Subscribe to push notifications
  async subscribeToPush(): Promise<PushSubscription | null> {
    if (!this.swRegistration) {
      console.error("Service Worker not ready");
      return null;
    }

    try {
      // Check if already subscribed
      this.pushSubscription =
        await this.swRegistration.pushManager.getSubscription();

      if (this.pushSubscription) {
        console.log("Already subscribed to push notifications");
        return this.pushSubscription;
      }

      // Subscribe to push notifications
      // Note: In a real app, you would get this VAPID key from your backend
      const vapidPublicKey = "your-vapid-public-key-here"; // Replace with actual key

      this.pushSubscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlB64ToUint8Array(vapidPublicKey),
      });

      console.log("Subscribed to push notifications:", this.pushSubscription);

      // Send subscription to server
      await this.sendSubscriptionToServer(this.pushSubscription);

      return this.pushSubscription;
    } catch (error) {
      console.error("Failed to subscribe to push notifications:", error);
      toast.error("Failed to enable push notifications");
      return null;
    }
  }

  // Unsubscribe from push notifications
  async unsubscribeFromPush(): Promise<boolean> {
    if (!this.pushSubscription) {
      return true;
    }

    try {
      const successful = await this.pushSubscription.unsubscribe();

      if (successful) {
        this.pushSubscription = null;
        console.log("Unsubscribed from push notifications");
        toast.success("Push notifications disabled");
      }

      return successful;
    } catch (error) {
      console.error("Failed to unsubscribe from push notifications:", error);
      return false;
    }
  }

  // Show browser notification
  showNotification(title: string, options?: NotificationOptions): void {
    if (Notification.permission !== "granted") {
      console.warn("Notification permission not granted");
      return;
    }

    const defaultOptions: NotificationOptions = {
      icon: "/icon-192x192.png",
      badge: "/icon-72x72.png",
      tag: "wais-notification",
      renotify: false,
      vibrate: [200, 100, 200],
      data: {
        timestamp: Date.now(),
        url: window.location.origin,
      },
    };

    new Notification(title, { ...defaultOptions, ...options });
  }

  // Schedule local notification (mock implementation)
  scheduleNotification(
    title: string,
    options: NotificationOptions & { delay?: number } = {}
  ): number {
    const { delay = 0, ...notificationOptions } = options;

    const timeoutId = setTimeout(() => {
      this.showNotification(title, notificationOptions);
    }, delay);

    return timeoutId;
  }

  // Cancel scheduled notification
  cancelScheduledNotification(notificationId: number): void {
    clearTimeout(notificationId);
  }

  // Smart notification based on user activity and preferences
  smartNotify(notification: Notification): void {
    const now = new Date();
    const hour = now.getHours();

    // Don't disturb during night hours (10 PM - 6 AM)
    if (hour >= 22 || hour <= 6) {
      console.log("Quiet hours - notification queued for later");
      return;
    }

    // Show as toast for less important notifications
    const lowPriorityTypes: Notification["type"][] = ["info"];

    if (lowPriorityTypes.includes(notification.type)) {
      toast.info(notification.title, notification.message);
      return;
    }

    // Show browser notification for important ones
    const urgentTypes: Notification["type"][] = ["error", "payment", "budget"];

    if (urgentTypes.includes(notification.type)) {
      this.showNotification(notification.title, {
        body: notification.message,
        tag: `wais-${notification.type}`,
        requireInteraction: true,
      });
    }

    // Default to toast notification
    toast.info(notification.title, notification.message);
  }

  // Send subscription to server (stub implementation)
  private async sendSubscriptionToServer(
    subscription: PushSubscription
  ): Promise<void> {
    // In a real app, you would send this to your backend
    console.log("Would send subscription to server:", subscription);

    try {
      // const response = await fetch("/api/push/subscribe", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(subscription),
      // });

      // if (!response.ok) {
      //   throw new Error("Failed to save subscription");
      // }

      toast.success("Push notifications configured!");
    } catch (error) {
      console.error("Failed to save push subscription:", error);
      toast.error("Failed to configure push notifications");
    }
  }

  // Convert VAPID key
  private urlB64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Get current subscription status
  async getSubscriptionStatus(): Promise<{
    isSubscribed: boolean;
    subscription: PushSubscription | null;
  }> {
    if (!this.swRegistration) {
      return { isSubscribed: false, subscription: null };
    }

    try {
      const subscription =
        await this.swRegistration.pushManager.getSubscription();
      return {
        isSubscribed: !!subscription,
        subscription,
      };
    } catch (error) {
      console.error("Failed to get subscription status:", error);
      return { isSubscribed: false, subscription: null };
    }
  }
}

// Notification scheduler for financial reminders
export class FinancialNotificationScheduler {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = NotificationService.getInstance();
  }

  // Schedule payment reminders
  schedulePaymentReminder(
    paymentName: string,
    amount: number,
    dueDate: Date,
    daysBefore: number = 3
  ): number {
    const reminderTime = new Date(dueDate);
    reminderTime.setDate(reminderTime.getDate() - daysBefore);

    const delay = reminderTime.getTime() - Date.now();

    if (delay <= 0) {
      // Due date has passed or is today
      return this.notificationService.scheduleNotification(
        `Payment Due: ${paymentName}`,
        {
          body: `₱${amount.toLocaleString()} is due ${dueDate.toDateString()}`,
          tag: `payment-${paymentName}`,
          requireInteraction: true,
        }
      );
    }

    return this.notificationService.scheduleNotification(
      `Payment Reminder: ${paymentName}`,
      {
        body: `₱${amount.toLocaleString()} due in ${daysBefore} days`,
        tag: `payment-reminder-${paymentName}`,
        delay,
      }
    );
  }

  // Schedule budget alerts
  scheduleBudgetAlert(
    category: string,
    percentUsed: number,
    threshold: number = 80
  ): void {
    if (percentUsed >= threshold) {
      this.notificationService.showNotification(`Budget Alert: ${category}`, {
        body: `You've used ${percentUsed}% of your ${category} budget`,
        tag: `budget-alert-${category}`,
        requireInteraction: true,
      });
    }
  }

  // Schedule weekly/monthly reports
  schedulePeriodicReports(): void {
    // Schedule weekly report (every Sunday at 9 AM)
    const nextSunday = new Date();
    nextSunday.setDate(nextSunday.getDate() + (7 - nextSunday.getDay()));
    nextSunday.setHours(9, 0, 0, 0);

    const weeklyDelay = nextSunday.getTime() - Date.now();

    if (weeklyDelay > 0) {
      this.notificationService.scheduleNotification("Weekly Financial Report", {
        body: "Your weekly spending summary is ready",
        tag: "weekly-report",
        delay: weeklyDelay,
      });
    }

    // Schedule monthly report (1st of every month at 10 AM)
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1, 1);
    nextMonth.setHours(10, 0, 0, 0);

    const monthlyDelay = nextMonth.getTime() - Date.now();

    if (monthlyDelay > 0) {
      this.notificationService.scheduleNotification(
        "Monthly Financial Report",
        {
          body: "Your monthly financial insights are available",
          tag: "monthly-report",
          delay: monthlyDelay,
        }
      );
    }
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();
export const financialNotificationScheduler =
  new FinancialNotificationScheduler();
