"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { GradientActionCard } from "@/components/dashboard/action-card";
import { BarChart3, Bot, LineChart, Sparkles, TrendingUp } from "lucide-react";

export default function InsightsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
            <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
              AI
            </div>
          </div>
          <p className="text-gray-600">
            Get personalized financial insights powered by AI
          </p>
        </div>

        {/* Main AI Insights Card */}
        <div className="walz-gradient-insights rounded-xl p-6 text-white relative overflow-hidden">
          <div className="flex justify-between items-start relative z-10">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="px-3 py-1 bg-green-400/90 text-green-900 rounded-full text-xs font-semibold">
                  +7.1% this month
                </div>
              </div>
              <h3 className="text-xl font-bold leading-tight">
                Great financial progress!
              </h3>
              <p className="text-blue-100 text-sm leading-relaxed max-w-xl">
                Your spending decreased by 15% this month and you're building
                healthy habits. You're on track to reach your emergency fund
                goal 2 months early!
              </p>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium text-sm mt-4 transition-all border border-white/30">
                View Full Analysis →
              </button>
            </div>
          </div>
          <div className="absolute -right-6 -bottom-6 opacity-20">
            <div className="w-40 h-40 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Bot className="w-20 h-20 text-white" />
            </div>
          </div>
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="walz-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Spending Trends</h3>
            </div>
            <p className="text-gray-600 mb-3">
              You're spending 15% less than last month. Your biggest savings
              came from dining out.
            </p>
            <div className="text-sm text-green-600 font-medium">
              ↓ ₱3,450 savings this month
            </div>
          </div>

          <div className="walz-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">
                Budget Performance
              </h3>
            </div>
            <p className="text-gray-600 mb-3">
              You're 76.5% through your monthly budget with 8 days remaining.
            </p>
            <div className="text-sm text-blue-600 font-medium">
              On track to save ₱2,750 this month
            </div>
          </div>
        </div>

        {/* AI Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            AI-Powered Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GradientActionCard
              title="Spending Analysis"
              icon={<BarChart3 className="w-5 h-5" />}
              gradient="from-blue-500 to-blue-600"
            />
            <GradientActionCard
              title="Budget Optimization"
              icon={<LineChart className="w-5 h-5" />}
              gradient="from-green-500 to-green-600"
            />
            <GradientActionCard
              title="Investment Insights"
              icon={<TrendingUp className="w-5 h-5" />}
              gradient="from-purple-500 to-purple-600"
            />
            <GradientActionCard
              title="Financial Forecast"
              icon={<Sparkles className="w-5 h-5" />}
              gradient="from-indigo-500 to-indigo-600"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
