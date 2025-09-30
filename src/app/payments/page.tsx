"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { PaymentItem } from "@/components/dashboard/payment-item";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CreditCard, Plus } from "lucide-react";

export default function PaymentsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
            <p className="text-gray-600 mt-1">
              Manage upcoming payments and bills
            </p>
          </div>
          <Button icon={<Plus className="w-4 h-4" />}>Add Payment</Button>
        </div>

        {/* Payment Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="walz-card p-4">
            <div className="text-sm text-gray-600">Overdue Payments</div>
            <div className="text-2xl font-bold text-red-600">₱6,939.00</div>
          </div>
          <div className="walz-card p-4">
            <div className="text-sm text-gray-600">Upcoming This Month</div>
            <div className="text-2xl font-bold text-gray-900">₱12,450.00</div>
          </div>
          <div className="walz-card p-4">
            <div className="text-sm text-gray-600">Total Paid This Month</div>
            <div className="text-2xl font-bold text-green-600">₱8,750.00</div>
          </div>
        </div>

        {/* Overdue Payments */}
        <div className="walz-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            Overdue Payments
          </h2>
          <div className="space-y-3">
            <PaymentItem
              icon={<ArrowUpRight className="w-4 h-4 text-red-500" />}
              title="Credit Card Bill"
              subtitle="BPI • Due Nov 10 (Overdue)"
              amount="₱5,240.00"
              overdue
            />
            <PaymentItem
              icon={<ArrowUpRight className="w-4 h-4 text-red-500" />}
              title="Internet Bill"
              subtitle="PLDT • Due Nov 8 (Overdue)"
              amount="₱1,699.00"
              overdue
            />
          </div>
        </div>

        {/* Upcoming Payments */}
        <div className="walz-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
            Upcoming Payments
          </h2>
          <div className="space-y-3">
            <PaymentItem
              icon={<ArrowUpRight className="w-4 h-4 text-blue-500" />}
              title="Electric Bill"
              subtitle="MERALCO • Due Nov 20"
              amount="₱4,200.00"
            />
            <PaymentItem
              icon={<CreditCard className="w-4 h-4 text-blue-500" />}
              title="Insurance Premium"
              subtitle="Philam Life • Due Nov 25"
              amount="₱3,500.00"
            />
            <PaymentItem
              icon={<ArrowUpRight className="w-4 h-4 text-blue-500" />}
              title="Water Bill"
              subtitle="Manila Water • Due Nov 30"
              amount="₱850.00"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
