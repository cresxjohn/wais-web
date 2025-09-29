"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks";
import { useAppStore } from "@/stores/app-store";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Bell,
  Download,
  Key,
  Lock,
  Moon,
  Settings,
  Shield,
  Smartphone,
  Sun,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const navigationSections = [
  {
    id: "general",
    title: "General",
    icon: Settings,
  },
  {
    id: "account",
    title: "Account",
    icon: Lock,
  },
  {
    id: "notifications",
    title: "Notifications",
    icon: Bell,
  },
  {
    id: "privacy",
    title: "Privacy & Data",
    icon: Shield,
  },
  {
    id: "danger",
    title: "Danger Zone",
    icon: AlertTriangle,
  },
];

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme, notifications, clearAllNotifications } =
    useAppStore();

  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeSection, setActiveSection] = useState("general");

  // Local state for form inputs
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    timezone: "Asia/Manila",
    currency: "PHP",
    language: "en",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    paymentReminders: true,
    budgetAlerts: true,
    securityAlerts: true,
    weeklyReports: true,
    monthlyReports: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    dataSharing: false,
    analyticsOptIn: true,
    marketingEmails: false,
    thirdPartySharing: false,
  });

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Notification settings updated!");
    } catch (error) {
      toast.error("Failed to update notification settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrivacyUpdate = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Privacy settings updated!");
    } catch (error) {
      toast.error("Failed to update privacy settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataExport = async () => {
    setIsLoading(true);
    try {
      // Simulate data export
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create a mock export file
      const exportData = {
        profile: profileData,
        exportDate: new Date().toISOString(),
        transactions: [], // Would include actual transaction data
        accounts: [], // Would include actual account data
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `wais-data-export-${
        new Date().toISOString().split("T")[0]
      }.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("Data exported successfully!");
    } catch (error) {
      toast.error("Failed to export data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountDelete = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setIsLoading(true);
    try {
      // Simulate account deletion
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success(
        "Account deletion initiated. You will receive a confirmation email."
      );
      logout();
    } catch (error) {
      toast.error("Failed to delete account");
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleChangePassword = () => {
    toast.info(
      "Password change functionality will redirect to secure authentication flow."
    );
  };

  const handle2FASetup = () => {
    toast.info(
      "Two-factor authentication setup will be available in the next update."
    );
  };

  const SidebarNavItem = ({ section, isActive, onClick }: any) => {
    const Icon = section.icon;
    return (
      <button
        onClick={() => onClick(section.id)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-md transition-colors text-left",
          isActive
            ? "bg-blue-50 text-blue-700 border-r-2 border-blue-500 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-400"
            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        )}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span className="font-medium">{section.title}</span>
      </button>
    );
  };

  const renderGeneralContent = () => (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    email: e.target.value,
                  })
                }
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    phone: e.target.value,
                  })
                }
                placeholder="+63 9XX XXX XXXX"
              />
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={profileData.timezone}
                onValueChange={(value) =>
                  setProfileData({ ...profileData, timezone: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Manila">
                    Philippines (GMT+8)
                  </SelectItem>
                  <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                  <SelectItem value="America/New_York">
                    Eastern Time (GMT-5)
                  </SelectItem>
                  <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleProfileUpdate} disabled={isLoading}>
              {isLoading ? "Saving..." : "Update profile"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Configure your app preferences and regional settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currency">Default Currency</Label>
              <Select
                value={profileData.currency}
                onValueChange={(value) =>
                  setProfileData({ ...profileData, currency: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PHP">Philippine Peso (₱)</SelectItem>
                  <SelectItem value="USD">US Dollar ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                  <SelectItem value="GBP">British Pound (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="language">Language</Label>
              <Select
                value={profileData.language}
                onValueChange={(value) =>
                  setProfileData({ ...profileData, language: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fil">Filipino</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label>Theme</Label>
              <p className="text-sm text-gray-500">
                Choose your preferred theme
              </p>
            </div>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    Light
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    Dark
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    System
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleProfileUpdate} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save preferences"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAccountContent = () => (
    <Card>
      <CardHeader>
        <CardTitle>Password and authentication</CardTitle>
        <CardDescription>Manage your account security settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between py-3">
          <div>
            <Label>Change password</Label>
            <p className="text-sm text-gray-500">
              Update your account password
            </p>
          </div>
          <Button variant="outline" onClick={handleChangePassword}>
            <Key className="h-4 w-4 mr-2" />
            Change password
          </Button>
        </div>

        <Separator />

        <div className="flex items-center justify-between py-3">
          <div>
            <Label>Two-factor authentication</Label>
            <p className="text-sm text-gray-500">
              Add an extra layer of security to your account
            </p>
          </div>
          <Button variant="outline" onClick={handle2FASetup}>
            <Smartphone className="h-4 w-4 mr-2" />
            Enable 2FA
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderNotificationsContent = () => (
    <Card>
      <CardHeader>
        <CardTitle>Notification preferences</CardTitle>
        <CardDescription>
          Choose how you want to be notified about account activity and updates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Channels</h4>

          <div className="flex items-center justify-between">
            <div>
              <Label>Push notifications</Label>
              <p className="text-sm text-gray-500">
                Receive notifications in the app
              </p>
            </div>
            <Switch
              checked={notificationSettings.pushNotifications}
              onCheckedChange={(checked) =>
                setNotificationSettings({
                  ...notificationSettings,
                  pushNotifications: checked,
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Email notifications</Label>
              <p className="text-sm text-gray-500">
                Receive notifications via email
              </p>
            </div>
            <Switch
              checked={notificationSettings.emailNotifications}
              onCheckedChange={(checked) =>
                setNotificationSettings({
                  ...notificationSettings,
                  emailNotifications: checked,
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>SMS notifications</Label>
              <p className="text-sm text-gray-500">
                Receive notifications via SMS
              </p>
            </div>
            <Switch
              checked={notificationSettings.smsNotifications}
              onCheckedChange={(checked) =>
                setNotificationSettings({
                  ...notificationSettings,
                  smsNotifications: checked,
                })
              }
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-medium text-sm">Types</h4>

          <div className="flex items-center justify-between">
            <div>
              <Label>Payment reminders</Label>
              <p className="text-sm text-gray-500">
                Upcoming bills and payments
              </p>
            </div>
            <Switch
              checked={notificationSettings.paymentReminders}
              onCheckedChange={(checked) =>
                setNotificationSettings({
                  ...notificationSettings,
                  paymentReminders: checked,
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Budget alerts</Label>
              <p className="text-sm text-gray-500">
                When you approach spending limits
              </p>
            </div>
            <Switch
              checked={notificationSettings.budgetAlerts}
              onCheckedChange={(checked) =>
                setNotificationSettings({
                  ...notificationSettings,
                  budgetAlerts: checked,
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Security alerts</Label>
              <p className="text-sm text-gray-500">
                Login attempts and security events
              </p>
            </div>
            <Switch
              checked={notificationSettings.securityAlerts}
              onCheckedChange={(checked) =>
                setNotificationSettings({
                  ...notificationSettings,
                  securityAlerts: checked,
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Weekly reports</Label>
              <p className="text-sm text-gray-500">
                Weekly financial summaries
              </p>
            </div>
            <Switch
              checked={notificationSettings.weeklyReports}
              onCheckedChange={(checked) =>
                setNotificationSettings({
                  ...notificationSettings,
                  weeklyReports: checked,
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Monthly reports</Label>
              <p className="text-sm text-gray-500">
                Monthly financial insights
              </p>
            </div>
            <Switch
              checked={notificationSettings.monthlyReports}
              onCheckedChange={(checked) =>
                setNotificationSettings({
                  ...notificationSettings,
                  monthlyReports: checked,
                })
              }
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-4">
          <Button onClick={handleNotificationUpdate} disabled={isLoading}>
            {isLoading ? "Saving..." : "Update preferences"}
          </Button>
          <Button variant="outline" onClick={clearAllNotifications}>
            Clear all notifications
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderPrivacyContent = () => (
    <div className="space-y-6">
      {/* Data Collection */}
      <Card>
        <CardHeader>
          <CardTitle>Data collection</CardTitle>
          <CardDescription>
            Control how your data is collected and used
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Analytics</Label>
              <p className="text-sm text-gray-500">
                Help improve the app with usage analytics
              </p>
            </div>
            <Switch
              checked={privacySettings.analyticsOptIn}
              onCheckedChange={(checked) =>
                setPrivacySettings({
                  ...privacySettings,
                  analyticsOptIn: checked,
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Data sharing</Label>
              <p className="text-sm text-gray-500">
                Share anonymized data to improve services
              </p>
            </div>
            <Switch
              checked={privacySettings.dataSharing}
              onCheckedChange={(checked) =>
                setPrivacySettings({
                  ...privacySettings,
                  dataSharing: checked,
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Marketing emails</Label>
              <p className="text-sm text-gray-500">
                Receive promotional content and updates
              </p>
            </div>
            <Switch
              checked={privacySettings.marketingEmails}
              onCheckedChange={(checked) =>
                setPrivacySettings({
                  ...privacySettings,
                  marketingEmails: checked,
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle>Export account data</CardTitle>
          <CardDescription>Download all of your personal data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label>Request data export</Label>
              <p className="text-sm text-gray-500">
                Export all personal information and financial data associated
                with your account. You'll receive a JSON file with all your
                data.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleDataExport}
              disabled={isLoading}
            >
              <Download className="h-4 w-4 mr-2" />
              {isLoading ? "Preparing export..." : "Export data"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handlePrivacyUpdate} disabled={isLoading}>
          {isLoading ? "Saving..." : "Update preferences"}
        </Button>
      </div>
    </div>
  );

  const renderDangerContent = () => (
    <Card className="border-red-200 dark:border-red-800">
      <CardHeader>
        <CardTitle className="text-red-600 dark:text-red-400">
          Delete account
        </CardTitle>
        <CardDescription>
          Once you delete your account, there is no going back. Please be
          certain.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!showDeleteConfirm ? (
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Delete this account and all associated data
              </p>
              <p className="text-sm text-gray-500">
                This action cannot be undone. This will permanently delete your
                account and remove all your data from our servers.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleAccountDelete}
              disabled={isLoading}
              className="ml-4"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete account
            </Button>
          </div>
        ) : (
          <Alert className="border-red-200 dark:border-red-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Are you absolutely sure?</AlertTitle>
            <AlertDescription className="mt-2">
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </AlertDescription>
            <div className="flex gap-2 mt-4">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleAccountDelete}
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Yes, delete my account"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </Alert>
        )}
      </CardContent>
    </Card>
  );

  const renderMainContent = () => {
    const sectionTitles = {
      general: "General",
      account: "Account",
      notifications: "Notifications",
      privacy: "Privacy & Data",
      danger: "Danger Zone",
    };

    const sectionDescriptions = {
      general: "Manage your profile information and application preferences",
      account:
        "Update your account security settings and authentication methods",
      notifications:
        "Choose how you want to be notified about account activity",
      privacy: "Control your privacy settings and manage your personal data",
      danger: "Irreversible and destructive account actions",
    };

    return (
      <div className="space-y-6">
        <div className="pb-4 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {sectionTitles[activeSection as keyof typeof sectionTitles]}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {
              sectionDescriptions[
                activeSection as keyof typeof sectionDescriptions
              ]
            }
          </p>
        </div>

        {activeSection === "general" && renderGeneralContent()}
        {activeSection === "account" && renderAccountContent()}
        {activeSection === "notifications" && renderNotificationsContent()}
        {activeSection === "privacy" && renderPrivacyContent()}
        {activeSection === "danger" && renderDangerContent()}
      </div>
    );
  };

  return (
    <AppLayout title="Settings">
      <div className="flex min-h-[calc(100vh-4rem)] flex-col lg:flex-row">
        {/* Mobile Section Selector */}
        <div className="lg:hidden p-4 bg-gray-50 dark:bg-gray-900/30 border-b border-gray-200 dark:border-gray-800">
          <Select value={activeSection} onValueChange={setActiveSection}>
            <SelectTrigger className="w-full">
              <SelectValue>
                <div className="flex items-center gap-2">
                  {(() => {
                    const section = navigationSections.find(
                      (s) => s.id === activeSection
                    );
                    const Icon = section?.icon;
                    return (
                      <>
                        {Icon && <Icon className="w-4 h-4" />}
                        {section?.title}
                      </>
                    );
                  })()}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {navigationSections.map((section) => {
                const Icon = section.icon;
                return (
                  <SelectItem key={section.id} value={section.id}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {section.title}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Sidebar Navigation - Desktop Only */}
        <div className="hidden lg:block w-64 bg-gray-50 dark:bg-gray-900/30 border-r border-gray-200 dark:border-gray-800">
          <div className="p-4">
            <nav className="space-y-1">
              {navigationSections.map((section) => (
                <SidebarNavItem
                  key={section.id}
                  section={section}
                  isActive={activeSection === section.id}
                  onClick={setActiveSection}
                />
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8 max-w-none lg:max-w-4xl">
          {renderMainContent()}
        </div>
      </div>
    </AppLayout>
  );
}
