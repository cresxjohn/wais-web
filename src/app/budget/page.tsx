"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { BudgetCategory } from "@/components/dashboard/budget-category";
import { Button } from "@/components/ui/button";
import { Car, Home, Plus, ShoppingCart, Target, Utensils } from "lucide-react";

export default function BudgetPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Budget</h1>
            <p className="text-gray-600 mt-1">
              Track your spending and stay on budget
            </p>
          </div>
          <Button icon={<Plus className="w-4 h-4" />}>Add Category</Button>
        </div>

        {/* Budget Overview */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">₱38,250</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Budget</p>
              <p className="text-2xl font-bold text-gray-900">₱50,000</p>
            </div>
          </div>
          <div className="w-full bg-white rounded-full h-3 mb-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
              style={{ width: "76.5%" }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">76.5% used</span>
            <span className="text-blue-600 font-medium">₱11,750 remaining</span>
          </div>
        </div>

        {/* Budget Categories */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>September 2025</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BudgetCategory
              name="Food & Dining"
              spent={12500}
              budget={15000}
              icon={<Utensils className="w-4 h-4 text-blue-600" />}
              color="blue"
            />
            <BudgetCategory
              name="Transportation"
              spent={8750}
              budget={10000}
              icon={<Car className="w-4 h-4 text-green-600" />}
              color="green"
            />
            <BudgetCategory
              name="Utilities"
              spent={7200}
              budget={8000}
              icon={<Home className="w-4 h-4 text-orange-600" />}
              color="orange"
            />
            <BudgetCategory
              name="Shopping"
              spent={9800}
              budget={12000}
              icon={<ShoppingCart className="w-4 h-4 text-purple-600" />}
              color="purple"
            />
          </div>
        </div>

        {/* Budget Insights */}
        <div className="walz-card p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Budget Insights
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-green-800">Great progress!</p>
                <p className="text-sm text-green-700">
                  You're on track to save ₱11,750 this month
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="font-medium text-yellow-800">
                  Watch your utilities
                </p>
                <p className="text-sm text-yellow-700">
                  You've used 90% of your utilities budget
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
