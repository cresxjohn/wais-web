"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Bell, CreditCard, Lock, Settings, User, Wallet } from "lucide-react";

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your account and preferences
          </p>
        </div>

        {/* Settings Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <div className="walz-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Profile</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value="Cres John Lazo"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  readOnly
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value="@cresxjohn"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  readOnly
                />
              </div>
              <Button size="sm">Update Profile</Button>
            </div>
          </div>

          {/* Security Settings */}
          <div className="walz-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-50 rounded-lg">
                <Lock className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Security</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    Two-Factor Authentication
                  </p>
                  <p className="text-sm text-gray-500">
                    Add an extra layer of security
                  </p>
                </div>
                <Button variant="secondary" size="sm">
                  Enable
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Change Password</p>
                  <p className="text-sm text-gray-500">Update your password</p>
                </div>
                <Button variant="secondary" size="sm">
                  Change
                </Button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="walz-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <Bell className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Notifications</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Payment Reminders</p>
                  <p className="text-sm text-gray-500">
                    Get notified about upcoming bills
                  </p>
                </div>
                <input type="checkbox" className="w-4 h-4" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Budget Alerts</p>
                  <p className="text-sm text-gray-500">
                    Alerts when approaching budget limits
                  </p>
                </div>
                <input type="checkbox" className="w-4 h-4" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">AI Insights</p>
                  <p className="text-sm text-gray-500">
                    Weekly financial insights
                  </p>
                </div>
                <input type="checkbox" className="w-4 h-4" defaultChecked />
              </div>
            </div>
          </div>

          {/* Connected Accounts */}
          <div className="walz-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Wallet className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">
                Connected Accounts
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">BDO Bank</p>
                    <p className="text-sm text-gray-500">•••• 2847</p>
                  </div>
                </div>
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Metrobank</p>
                    <p className="text-sm text-gray-500">•••• 5619</p>
                  </div>
                </div>
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                  Connected
                </span>
              </div>
              <Button variant="secondary" size="sm" className="w-full">
                Connect New Account
              </Button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="walz-card p-6 border-red-200">
          <h3 className="font-semibold text-red-600 mb-4">Danger Zone</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Delete Account</p>
              <p className="text-sm text-gray-500">
                Permanently delete your account and all data
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
