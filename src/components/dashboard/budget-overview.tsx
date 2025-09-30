import { BudgetCategory } from "./budget-category";
import { Car, Home, ShoppingCart, Utensils } from "lucide-react";

export function BudgetOverview() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">
          Budget Overview
        </h2>
        <span className="text-sm text-gray-500">September 2025</span>
      </div>

      {/* Budget Summary Card */}
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

      {/* Category Breakdown */}
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
  );
}
