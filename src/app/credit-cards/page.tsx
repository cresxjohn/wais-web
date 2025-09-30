"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus } from "lucide-react";

export default function CreditCardsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Credit Cards</h1>
            <p className="text-gray-600 mt-1">
              Manage your credit cards and track spending
            </p>
          </div>
          <Button icon={<Plus className="w-4 h-4" />}>Add Credit Card</Button>
        </div>

        {/* Credit Card Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="walz-card p-4">
            <div className="text-sm text-gray-600">Total Credit Limit</div>
            <div className="text-2xl font-bold text-gray-900">₱150,000</div>
          </div>
          <div className="walz-card p-4">
            <div className="text-sm text-gray-600">Available Credit</div>
            <div className="text-2xl font-bold text-green-600">₱137,650</div>
          </div>
          <div className="walz-card p-4">
            <div className="text-sm text-gray-600">Total Balance</div>
            <div className="text-2xl font-bold text-red-600">₱12,350</div>
          </div>
        </div>

        {/* Credit Cards List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Your Credit Cards
          </h2>

          <div className="walz-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    BPI Credit Card
                  </h3>
                  <p className="text-sm text-gray-500">•••• •••• •••• 9123</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Balance</div>
                <div className="text-lg font-semibold text-red-600">
                  ₱12,350.25
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Credit Used</span>
                <span>₱12,350 of ₱150,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
                  style={{ width: "8.2%" }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>8.2% utilized</span>
                <span>Due: Nov 15, 2024</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm">Pay Balance</Button>
              <Button variant="secondary" size="sm">
                View Statement
              </Button>
            </div>
          </div>

          {/* Placeholder for more cards */}
          <div className="walz-card p-6 border-2 border-dashed border-gray-200">
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Add another credit card
              </h3>
              <p className="text-gray-600 mb-4">
                Track all your credit cards in one place
              </p>
              <Button size="sm">Add Credit Card</Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
