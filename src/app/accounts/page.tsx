"use client";

import { MainLayout } from "@/components/layout/main-layout";
import {
  AccountCard,
  AddAccountCard,
} from "@/components/dashboard/account-card";
import { Button } from "@/components/ui/button";
import { Building2, CreditCard, Plus, Wallet } from "lucide-react";

export default function AccountsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
            <p className="text-gray-600 mt-1">Manage your financial accounts</p>
          </div>
          <Button icon={<Plus className="w-4 h-4" />}>Add Account</Button>
        </div>

        {/* Account Overview */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Total Balance
          </h2>
          <div className="text-3xl font-bold text-gray-900">₱125,847.50</div>
          <p className="text-sm text-gray-600 mt-1">Across all accounts</p>
        </div>

        {/* Account Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AccountCard
            icon={<Wallet className="text-blue-600" />}
            name="Cash Account"
            bank="BDO •••• 2847"
            amount="₱45,230.75"
          />
          <AccountCard
            icon={<Building2 className="text-green-600" />}
            name="Savings"
            bank="Metrobank •••• 5619"
            amount="₱68,500.00"
          />
          <AccountCard
            icon={<CreditCard className="text-purple-600" />}
            name="Credit Card"
            bank="BPI •••• 9123"
            amount="₱-12,350.25"
            negative
          />
          <AccountCard
            icon={<Wallet className="text-orange-600" />}
            name="Business Account"
            bank="UnionBank •••• 1234"
            amount="₱25,750.00"
          />
          <AccountCard
            icon={<Building2 className="text-red-600" />}
            name="Investment Account"
            bank="Security Bank •••• 5678"
            amount="₱87,650.25"
          />
          <AddAccountCard />
        </div>
      </div>
    </MainLayout>
  );
}
