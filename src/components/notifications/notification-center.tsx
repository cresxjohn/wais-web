"use client";

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
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore, type Notification } from "@/stores/app-store";
import { formatDistanceToNow } from "date-fns";
import {
  AlertTriangle,
  Bell,
  BellRing,
  Calendar,
  Check,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Eye,
  EyeOff,
  Info,
  Settings,
  TrendingUp,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const NotificationIcon = ({ type }: { type: Notification["type"] }) => {
  switch (type) {
    case "success":
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case "error":
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    case "payment":
      return <DollarSign className="h-4 w-4 text-blue-600" />;
    case "reminder":
      return <Calendar className="h-4 w-4 text-purple-600" />;
    case "budget":
      return <TrendingUp className="h-4 w-4 text-orange-600" />;
    case "account":
      return <CreditCard className="h-4 w-4 text-indigo-600" />;
    default:
      return <Info className="h-4 w-4 text-blue-600" />;
  }
};

const getNotificationBgColor = (type: Notification["type"]) => {
  switch (type) {
    case "success":
      return "border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/20";
    case "error":
      return "border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/20";
    case "warning":
      return "border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
    case "payment":
      return "border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20";
    case "reminder":
      return "border-l-4 border-l-purple-500 bg-purple-50 dark:bg-purple-900/20";
    case "budget":
      return "border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-900/20";
    case "account":
      return "border-l-4 border-l-indigo-500 bg-indigo-50 dark:bg-indigo-900/20";
    default:
      return "border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20";
  }
};

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onAction?: (notification: Notification) => void;
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  onAction,
}: NotificationItemProps) {
  const handleAction = () => {
    if (onAction) {
      onAction(notification);
    }
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <Card
      className={`mb-3 transition-all hover:shadow-md ${
        !notification.read ? getNotificationBgColor(notification.type) : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <NotificationIcon type={notification.type} />
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm font-medium leading-5">
                {notification.title}
                {!notification.read && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    New
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(notification.timestamp), {
                  addSuffix: true,
                })}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {!notification.read && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMarkAsRead(notification.id)}
                className="h-6 w-6 p-0"
              >
                <Check className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(notification.id)}
              className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {notification.message && (
        <CardContent className="pt-0">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {notification.message}
          </p>
          {(notification.actionUrl || notification.actionLabel) && (
            <Button
              variant="link"
              size="sm"
              onClick={handleAction}
              className="mt-2 p-0 h-auto text-blue-600 hover:text-blue-700"
            >
              {notification.actionLabel || "View Details"} →
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export function NotificationCenter() {
  const {
    notifications,
    markNotificationAsRead,
    deleteNotification,
    clearAllNotifications,
    markAllNotificationsAsRead,
  } = useAppStore();

  const [showAll, setShowAll] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayNotifications = showAll
    ? notifications
    : notifications.slice(0, 5);

  const handleNotificationAction = (notification: Notification) => {
    if (notification.actionUrl) {
      // Navigate to the action URL
      window.location.href = notification.actionUrl;
    }
  };

  const handleClearAll = () => {
    clearAllNotifications();
    toast.success("All notifications cleared");
  };

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
    toast.success("All notifications marked as read");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 max-h-[80vh] p-0">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <DropdownMenuLabel className="text-lg font-semibold p-0">
              Notifications
            </DropdownMenuLabel>
            <div className="flex items-center gap-2">
              {notifications.length > 5 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAll(!showAll)}
                  className="text-xs"
                >
                  {showAll ? (
                    <>
                      <EyeOff className="h-3 w-3 mr-1" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <Eye className="h-3 w-3 mr-1" />
                      Show All ({notifications.length})
                    </>
                  )}
                </Button>
              )}
              <Link href="/settings?tab=notifications">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Settings className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>
          {unreadCount > 0 && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{unreadCount} unread notifications</span>
              <div className="flex gap-2">
                <Button
                  variant="link"
                  size="sm"
                  onClick={handleMarkAllRead}
                  className="text-xs p-0 h-auto"
                >
                  Mark all read
                </Button>
                <span className="text-muted-foreground">•</span>
                <Button
                  variant="link"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-xs p-0 h-auto text-red-600 hover:text-red-700"
                >
                  Clear all
                </Button>
              </div>
            </div>
          )}
        </div>

        <ScrollArea className="max-h-96">
          <div className="p-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No notifications</p>
                <p className="text-xs text-gray-400 mt-1">
                  You&apos;re all caught up!
                </p>
              </div>
            ) : (
              <>
                {displayNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markNotificationAsRead}
                    onDelete={deleteNotification}
                    onAction={handleNotificationAction}
                  />
                ))}
                {notifications.length > 5 && !showAll && (
                  <Button
                    variant="outline"
                    onClick={() => setShowAll(true)}
                    className="w-full mt-3"
                  >
                    Show {notifications.length - 5} more notifications
                  </Button>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Quick notification actions
export function NotificationActions() {
  const { addNotification } = useAppStore();

  const showTestNotification = (type: Notification["type"]) => {
    const notifications = {
      info: {
        title: "Test Info Notification",
        message: "This is a test information notification.",
      },
      success: {
        title: "Payment Successful",
        message: "Your payment of ₱1,500 has been processed successfully.",
      },
      warning: {
        title: "Budget Alert",
        message: "You've spent 80% of your monthly food budget.",
      },
      error: {
        title: "Transaction Failed",
        message: "Your recent transaction could not be processed.",
      },
      payment: {
        title: "Payment Due Soon",
        message: "Your credit card bill of ₱5,000 is due in 3 days.",
        actionLabel: "View Bill",
        actionUrl: "/accounts",
      },
      reminder: {
        title: "Monthly Review",
        message: "Time to review your monthly spending and budget.",
        actionLabel: "Open Reports",
        actionUrl: "/reports",
      },
      budget: {
        title: "Budget Exceeded",
        message: "You've exceeded your shopping budget by ₱1,200 this month.",
        actionLabel: "View Budget",
        actionUrl: "/reports",
      },
      account: {
        title: "Account Connected",
        message: "Your BPI account has been successfully connected and synced.",
        actionLabel: "View Account",
        actionUrl: "/accounts",
      },
    };

    const notificationData = notifications[type] || notifications.info;

    addNotification({
      id: Date.now().toString(),
      type,
      timestamp: new Date().toISOString(),
      read: false,
      ...notificationData,
    });

    toast.success(`Test ${type} notification added!`);
  };

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return null;

  return (
    <Card className="fixed bottom-4 left-4 z-50 w-64">
      <CardHeader>
        <CardTitle className="text-sm">Notification Testing</CardTitle>
        <CardDescription className="text-xs">
          Test different notification types
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => showTestNotification("info")}
        >
          Info
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => showTestNotification("success")}
        >
          Success
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => showTestNotification("warning")}
        >
          Warning
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => showTestNotification("error")}
        >
          Error
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => showTestNotification("payment")}
        >
          Payment
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => showTestNotification("reminder")}
        >
          Reminder
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => showTestNotification("budget")}
        >
          Budget
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => showTestNotification("account")}
        >
          Account
        </Button>
      </CardContent>
    </Card>
  );
}
