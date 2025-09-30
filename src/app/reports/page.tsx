"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { GradientActionCard } from "@/components/dashboard/action-card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Calendar,
  Download,
  FileText,
  LineChart,
  PieChart,
} from "lucide-react";

export default function ReportsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600 mt-1">
              Generate detailed financial reports and analysis
            </p>
          </div>
          <Button icon={<Download className="w-4 h-4" />}>Export Report</Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="walz-card p-4">
            <div className="text-sm text-gray-600">This Month</div>
            <div className="text-2xl font-bold text-gray-900">₱38,250</div>
            <div className="text-xs text-green-600">↓ 15% from last month</div>
          </div>
          <div className="walz-card p-4">
            <div className="text-sm text-gray-600">Average Daily</div>
            <div className="text-2xl font-bold text-gray-900">₱1,275</div>
            <div className="text-xs text-gray-500">30-day average</div>
          </div>
          <div className="walz-card p-4">
            <div className="text-sm text-gray-600">Top Category</div>
            <div className="text-lg font-bold text-gray-900">Food & Dining</div>
            <div className="text-xs text-gray-500">₱12,500 spent</div>
          </div>
          <div className="walz-card p-4">
            <div className="text-sm text-gray-600">Savings Rate</div>
            <div className="text-2xl font-bold text-green-600">23.5%</div>
            <div className="text-xs text-green-600">↑ 3% improvement</div>
          </div>
        </div>

        {/* Report Types */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Available Reports
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GradientActionCard
              title="Spending Analysis"
              icon={<BarChart3 className="w-5 h-5" />}
              gradient="from-blue-500 to-blue-600"
            />
            <GradientActionCard
              title="Income vs Expenses"
              icon={<LineChart className="w-5 h-5" />}
              gradient="from-green-500 to-green-600"
            />
            <GradientActionCard
              title="Category Breakdown"
              icon={<PieChart className="w-5 h-5" />}
              gradient="from-purple-500 to-purple-600"
            />
            <GradientActionCard
              title="Monthly Trends"
              icon={<Calendar className="w-5 h-5" />}
              gradient="from-orange-500 to-orange-600"
            />
          </div>
        </div>

        {/* Recent Reports */}
        <div className="walz-card p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Reports</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">
                    September 2025 Summary
                  </p>
                  <p className="text-sm text-gray-500">
                    Generated on Oct 1, 2025
                  </p>
                </div>
              </div>
              <Button variant="secondary" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Q3 2025 Analysis</p>
                  <p className="text-sm text-gray-500">
                    Generated on Oct 1, 2025
                  </p>
                </div>
              </div>
              <Button variant="secondary" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">
                    August 2025 Summary
                  </p>
                  <p className="text-sm text-gray-500">
                    Generated on Sep 1, 2025
                  </p>
                </div>
              </div>
              <Button variant="secondary" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
