"use client";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/stores/app-store";
import { cn } from "@/lib/utils";
import {
  Bell,
  BellOff,
  CheckCircle,
  Circle,
  Settings,
  Trash,
  Filter,
  AlertTriangle,
  Info,
  CheckCircle2,
  Clock,
  Calendar,
  CreditCard,
  Target,
  TrendingUp,
  PiggyBank,
  Zap,
  User,
  Shield,
  Smartphone,
  Mail,
  MessageSquare,
  Volume2,
  VolumeX,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

const notificationIcons = {
  payment: <CreditCard className="w-5 h-5 text-blue-500" />,
  budget: <Target className="w-5 h-5 text-orange-500" />,
  goal: <PiggyBank className="w-5 h-5 text-green-500" />,
  investment: <TrendingUp className="w-5 h-5 text-purple-500" />,
  security: <Shield className="w-5 h-5 text-red-500" />,
  system: <Settings className="w-5 h-5 text-gray-500" />,
  achievement: <CheckCircle2 className="w-5 h-5 text-yellow-500" />,
  reminder: <Clock className="w-5 h-5 text-indigo-500" />,
};

const priorityColors = {
  high: "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950/20",
  medium:
    "border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-950/20",
  low: "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950/20",
  info: "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/20",
};

const mockNotificationSettings = {
  push: {
    enabled: true,
    payments: true,
    budgetAlerts: true,
    goalUpdates: true,
    securityAlerts: true,
    marketingUpdates: false,
  },
  email: {
    enabled: true,
    weeklyDigest: true,
    monthlyReports: true,
    productUpdates: true,
    securityAlerts: true,
    marketingEmails: false,
  },
  inApp: {
    enabled: true,
    sound: true,
    badge: true,
    vibration: true,
  },
  schedule: {
    quietHoursEnabled: true,
    quietStart: "22:00",
    quietEnd: "07:00",
    weekendNotifications: false,
  },
};

export default function NotificationsPage() {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
    deleteNotification,
  } = useAppStore();

  const [filter, setFilter] = useState("all");
  const [settings, setSettings] = useState(mockNotificationSettings);

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  const updateSetting = (
    category: string,
    setting: string,
    value: boolean | string
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value,
      },
    }));
  };

  const NotificationCard = ({ notification }: { notification: any }) => {
    const isUnread = !notification.read;

    return (
      <Card
        className={cn(
          "hover:shadow-md transition-all cursor-pointer",
          isUnread && "border-blue-300 dark:border-blue-700",
          priorityColors[notification.priority as keyof typeof priorityColors]
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              {
                notificationIcons[
                  notification.type as keyof typeof notificationIcons
                ]
              }
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3
                    className={cn(
                      "font-medium text-sm",
                      isUnread && "font-semibold"
                    )}
                  >
                    {notification.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>

                  {notification.actionUrl && (
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 h-auto mt-2 text-blue-600 hover:text-blue-800"
                    >
                      {notification.actionLabel || "View Details"}
                    </Button>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {isUnread && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                  <Badge variant="outline" className="text-xs capitalize">
                    {notification.type}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(notification.timestamp))} ago
                </p>

                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      markNotificationAsRead(notification.id);
                    }}
                  >
                    {isUnread ? (
                      <Circle className="w-4 h-4" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const SettingToggle = ({
    label,
    description,
    checked,
    onChange,
  }: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }) => (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0">
      <div className="flex-1">
        <Label className="text-sm font-medium">{label}</Label>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );

  return (
    <AppLayout title="Notifications">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Notifications
              </CardTitle>
              <Bell className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {notifications.length}
              </div>
              <p className="text-xs text-muted-foreground">All notifications</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unread</CardTitle>
              <Circle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {unreadCount}
              </div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today</CardTitle>
              <Calendar className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {
                  notifications.filter(
                    (n) =>
                      new Date(n.timestamp).toDateString() ===
                      new Date().toDateString()
                  ).length
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Today&apos;s notifications
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Push Enabled
              </CardTitle>
              {settings.push.enabled ? (
                <Volume2 className="h-4 w-4 text-purple-500" />
              ) : (
                <VolumeX className="h-4 w-4 text-gray-500" />
              )}
            </CardHeader>
            <CardContent>
              <div
                className={cn(
                  "text-2xl font-bold",
                  settings.push.enabled ? "text-purple-600" : "text-gray-600"
                )}
              >
                {settings.push.enabled ? "On" : "Off"}
              </div>
              <p className="text-xs text-muted-foreground">
                Push notifications
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">
                All ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="payment">Payments</SelectItem>
                  <SelectItem value="budget">Budget</SelectItem>
                  <SelectItem value="goal">Goals</SelectItem>
                  <SelectItem value="investment">Investments</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="achievement">Achievements</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={markAllNotificationsAsRead}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={clearAllNotifications}
              >
                <Trash className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>

          {/* All Notifications Tab */}
          <TabsContent value="all" className="space-y-4">
            {filteredNotifications.length > 0 ? (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BellOff className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground">
                    No notifications found
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {filter === "all"
                      ? "You're all caught up! No notifications to show."
                      : `No ${filter} notifications found.`}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Unread Notifications Tab */}
          <TabsContent value="unread" className="space-y-4">
            {unreadCount > 0 ? (
              <div className="space-y-3">
                {notifications
                  .filter((n) => !n.read)
                  .map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                  <h3 className="text-lg font-semibold text-green-600">
                    All caught up!
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    You have no unread notifications.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Push Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Smartphone className="w-5 h-5" />
                    <span>Push Notifications</span>
                  </CardTitle>
                  <CardDescription>
                    Manage push notifications sent to your devices
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-1">
                  <SettingToggle
                    label="Enable Push Notifications"
                    description="Receive notifications on your device"
                    checked={settings.push.enabled}
                    onChange={(checked) =>
                      updateSetting("push", "enabled", checked)
                    }
                  />
                  <SettingToggle
                    label="Payment Reminders"
                    description="Get notified about upcoming payments"
                    checked={settings.push.payments}
                    onChange={(checked) =>
                      updateSetting("push", "payments", checked)
                    }
                  />
                  <SettingToggle
                    label="Budget Alerts"
                    description="Alerts when you exceed budget limits"
                    checked={settings.push.budgetAlerts}
                    onChange={(checked) =>
                      updateSetting("push", "budgetAlerts", checked)
                    }
                  />
                  <SettingToggle
                    label="Goal Updates"
                    description="Progress updates on your savings goals"
                    checked={settings.push.goalUpdates}
                    onChange={(checked) =>
                      updateSetting("push", "goalUpdates", checked)
                    }
                  />
                  <SettingToggle
                    label="Security Alerts"
                    description="Important security-related notifications"
                    checked={settings.push.securityAlerts}
                    onChange={(checked) =>
                      updateSetting("push", "securityAlerts", checked)
                    }
                  />
                </CardContent>
              </Card>

              {/* Email Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="w-5 h-5" />
                    <span>Email Notifications</span>
                  </CardTitle>
                  <CardDescription>
                    Control what emails you receive from WAIS
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-1">
                  <SettingToggle
                    label="Enable Email Notifications"
                    description="Receive notifications via email"
                    checked={settings.email.enabled}
                    onChange={(checked) =>
                      updateSetting("email", "enabled", checked)
                    }
                  />
                  <SettingToggle
                    label="Weekly Digest"
                    description="Weekly summary of your financial activity"
                    checked={settings.email.weeklyDigest}
                    onChange={(checked) =>
                      updateSetting("email", "weeklyDigest", checked)
                    }
                  />
                  <SettingToggle
                    label="Monthly Reports"
                    description="Comprehensive monthly financial reports"
                    checked={settings.email.monthlyReports}
                    onChange={(checked) =>
                      updateSetting("email", "monthlyReports", checked)
                    }
                  />
                  <SettingToggle
                    label="Product Updates"
                    description="News about new features and improvements"
                    checked={settings.email.productUpdates}
                    onChange={(checked) =>
                      updateSetting("email", "productUpdates", checked)
                    }
                  />
                  <SettingToggle
                    label="Security Alerts"
                    description="Critical security notifications via email"
                    checked={settings.email.securityAlerts}
                    onChange={(checked) =>
                      updateSetting("email", "securityAlerts", checked)
                    }
                  />
                </CardContent>
              </Card>

              {/* In-App Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>In-App Settings</span>
                  </CardTitle>
                  <CardDescription>
                    Configure how notifications appear in the app
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-1">
                  <SettingToggle
                    label="In-App Notifications"
                    description="Show notifications within the app"
                    checked={settings.inApp.enabled}
                    onChange={(checked) =>
                      updateSetting("inApp", "enabled", checked)
                    }
                  />
                  <SettingToggle
                    label="Sound Effects"
                    description="Play sound when notifications arrive"
                    checked={settings.inApp.sound}
                    onChange={(checked) =>
                      updateSetting("inApp", "sound", checked)
                    }
                  />
                  <SettingToggle
                    label="Badge Counter"
                    description="Show unread count on app icon"
                    checked={settings.inApp.badge}
                    onChange={(checked) =>
                      updateSetting("inApp", "badge", checked)
                    }
                  />
                  <SettingToggle
                    label="Vibration"
                    description="Vibrate device for important notifications"
                    checked={settings.inApp.vibration}
                    onChange={(checked) =>
                      updateSetting("inApp", "vibration", checked)
                    }
                  />
                </CardContent>
              </Card>

              {/* Schedule Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Schedule Settings</span>
                  </CardTitle>
                  <CardDescription>
                    Control when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SettingToggle
                    label="Quiet Hours"
                    description="Disable notifications during specified hours"
                    checked={settings.schedule.quietHoursEnabled}
                    onChange={(checked) =>
                      updateSetting("schedule", "quietHoursEnabled", checked)
                    }
                  />

                  {settings.schedule.quietHoursEnabled && (
                    <div className="grid grid-cols-2 gap-4 pl-6">
                      <div className="space-y-2">
                        <Label className="text-sm">Start Time</Label>
                        <Select
                          value={settings.schedule.quietStart}
                          onValueChange={(value) =>
                            updateSetting("schedule", "quietStart", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="20:00">8:00 PM</SelectItem>
                            <SelectItem value="21:00">9:00 PM</SelectItem>
                            <SelectItem value="22:00">10:00 PM</SelectItem>
                            <SelectItem value="23:00">11:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">End Time</Label>
                        <Select
                          value={settings.schedule.quietEnd}
                          onValueChange={(value) =>
                            updateSetting("schedule", "quietEnd", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="06:00">6:00 AM</SelectItem>
                            <SelectItem value="07:00">7:00 AM</SelectItem>
                            <SelectItem value="08:00">8:00 AM</SelectItem>
                            <SelectItem value="09:00">9:00 AM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <SettingToggle
                    label="Weekend Notifications"
                    description="Receive non-urgent notifications on weekends"
                    checked={settings.schedule.weekendNotifications}
                    onChange={(checked) =>
                      updateSetting("schedule", "weekendNotifications", checked)
                    }
                  />
                </CardContent>
              </Card>
            </div>

            {/* Save Settings */}
            <div className="flex justify-end">
              <Button>Save Preferences</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
