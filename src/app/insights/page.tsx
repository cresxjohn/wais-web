"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { config } from "@/lib/config";
import { useAccountStore } from "@/stores/account-store";
import { useAppStore } from "@/stores/app-store";
import { useTransactionStore } from "@/stores/transaction-store";
import {
  AlertTriangle,
  ArrowRight,
  Brain,
  Calendar,
  Camera,
  CheckCircle2,
  Lightbulb,
  PiggyBank,
  RefreshCw,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Mock AI insights data
const mockInsights = {
  financialHealthScore: 78,
  spendingPatterns: [
    {
      category: "Food & Dining",
      trend: "up",
      change: 15,
      insight:
        "You've been spending 15% more on dining out this month. Consider meal planning to save money.",
      severity: "medium",
    },
    {
      category: "Transportation",
      trend: "down",
      change: 8,
      insight: "Great! You've reduced transportation costs by 8% this month.",
      severity: "positive",
    },
    {
      category: "Shopping",
      trend: "up",
      change: 22,
      insight:
        "Shopping expenses have increased significantly. Review your recent purchases.",
      severity: "high",
    },
  ],
  savingsOpportunities: [
    {
      title: "Reduce Subscription Services",
      potential: 45,
      description:
        "You have multiple streaming subscriptions. Consider consolidating.",
      priority: "high",
    },
    {
      title: "Switch to Generic Brands",
      potential: 120,
      description:
        "Switching to generic brands for groceries could save you money.",
      priority: "medium",
    },
    {
      title: "Energy Bill Optimization",
      potential: 85,
      description:
        "Your electricity usage is higher than average for your area.",
      priority: "medium",
    },
  ],
  budgetRecommendations: [
    {
      category: "Food & Dining",
      current: 1200,
      suggested: 1000,
      reason:
        "Based on your income, allocating ₱1,000 monthly for dining would be more sustainable.",
    },
    {
      category: "Entertainment",
      current: 800,
      suggested: 600,
      reason:
        "Consider reducing entertainment spending to boost your savings rate.",
    },
  ],
  forecastData: [
    { month: "Jan", predicted: 5200, actual: 5100 },
    { month: "Feb", predicted: 4800, actual: 4900 },
    { month: "Mar", predicted: 5100, actual: null },
    { month: "Apr", predicted: 5300, actual: null },
  ],
  goals: [
    {
      id: "1",
      title: "Emergency Fund",
      target: 50000,
      current: 32000,
      deadline: "2024-12-31",
      status: "on_track",
    },
    {
      id: "2",
      title: "Vacation Fund",
      target: 25000,
      current: 8500,
      deadline: "2024-06-30",
      status: "behind",
    },
    {
      id: "3",
      title: "New Laptop",
      target: 80000,
      current: 45000,
      deadline: "2024-08-15",
      status: "ahead",
    },
  ],
};

export default function InsightsPage() {
  const { transactions } = useTransactionStore();
  const { accounts } = useAccountStore();
  const { notifications, addNotification } = useAppStore();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleRefreshInsights = async () => {
    setIsAnalyzing(true);

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsAnalyzing(false);
    setLastRefresh(new Date());
    toast.success("AI insights refreshed successfully!");

    // Add a notification about new insights
    addNotification({
      id: Date.now().toString(),
      title: "New AI Insights Available",
      message:
        "We've analyzed your spending patterns and found new opportunities to save!",
      type: "info",
      timestamp: new Date().toISOString(),
      read: false,
    });
  };

  const handleOCRUpload = () => {
    // Stub for OCR receipt processing
    toast.info(
      "OCR Receipt Processing will be available soon! This feature will automatically extract transaction details from receipt photos."
    );
  };

  const handleCategoryAI = () => {
    // Stub for AI category suggestion
    toast.info(
      "AI Category Suggestions coming soon! We'll automatically categorize your transactions using machine learning."
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreDescription = (score: number) => {
    if (score >= 80) return "Excellent financial health";
    if (score >= 60) return "Good financial health";
    if (score >= 40) return "Fair financial health";
    return "Needs improvement";
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "medium":
        return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      case "positive":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <Lightbulb className="h-4 w-4 text-blue-500" />;
    }
  };

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case "on_track":
        return "bg-green-100 text-green-800";
      case "ahead":
        return "bg-blue-100 text-blue-800";
      case "behind":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AppLayout title="AI Insights">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                AI Financial Insights
              </h1>
              {config.features.aiFeatures && (
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-800"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Powered
                </Badge>
              )}
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Personalized financial insights powered by artificial intelligence
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-500">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </div>
            <Button
              variant="outline"
              onClick={handleRefreshInsights}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              {isAnalyzing ? "Analyzing..." : "Refresh"}
            </Button>
          </div>
        </div>

        {/* Financial Health Score */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-purple-600" />
              Financial Health Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div
                  className={`text-4xl font-bold ${getScoreColor(
                    mockInsights.financialHealthScore
                  )}`}
                >
                  {mockInsights.financialHealthScore}
                </div>
                <div className="text-sm text-gray-500">out of 100</div>
              </div>
              <div className="flex-1">
                <Progress
                  value={mockInsights.financialHealthScore}
                  className="h-3 mb-2"
                />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {getScoreDescription(mockInsights.financialHealthScore)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Feature Stubs */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-dashed border-2 border-blue-200 hover:border-blue-400 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-blue-600" />
                OCR Receipt Processing
                <Badge variant="outline" className="text-blue-600">
                  Coming Soon
                </Badge>
              </CardTitle>
              <CardDescription>
                Automatically extract transaction details from receipt photos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={handleOCRUpload}
                className="w-full border-dashed"
              >
                <Camera className="h-4 w-4 mr-2" />
                Upload Receipt (Demo)
              </Button>
            </CardContent>
          </Card>

          <Card className="border-dashed border-2 border-green-200 hover:border-green-400 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-600" />
                AI Category Suggestions
                <Badge variant="outline" className="text-green-600">
                  Beta
                </Badge>
              </CardTitle>
              <CardDescription>
                Smart categorization of transactions using machine learning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={handleCategoryAI}
                className="w-full border-dashed"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Try AI Categories (Demo)
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Insights Tabs */}
        <Tabs defaultValue="patterns" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="patterns">Spending Patterns</TabsTrigger>
            <TabsTrigger value="opportunities">Savings Tips</TabsTrigger>
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="patterns" className="space-y-4">
            <div className="grid gap-4">
              {mockInsights.spendingPatterns.map((pattern, index) => (
                <Alert key={index} className="relative">
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(pattern.severity)}
                    <div className="flex-1">
                      <AlertTitle className="flex items-center gap-2">
                        {pattern.category}
                        <Badge
                          variant={
                            pattern.trend === "up" ? "destructive" : "default"
                          }
                        >
                          {pattern.trend === "up" ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {pattern.change}%
                        </Badge>
                      </AlertTitle>
                      <AlertDescription className="mt-1">
                        {pattern.insight}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-4">
            <div className="grid gap-4">
              {mockInsights.savingsOpportunities.map((opportunity, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <PiggyBank className="h-5 w-5 text-green-600" />
                        {opportunity.title}
                      </CardTitle>
                      <Badge
                        variant={
                          opportunity.priority === "high"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {opportunity.priority} priority
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        Potential monthly savings
                      </span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(opportunity.potential)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      {opportunity.description}
                    </p>
                    <Button variant="outline" size="sm">
                      <ArrowRight className="h-3 w-3 mr-1" />
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="forecast" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Expense Forecast
                </CardTitle>
                <CardDescription>
                  AI-powered predictions for your upcoming expenses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockInsights.forecastData.map((data, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{data.month}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {formatCurrency(data.predicted)}
                        </div>
                        {data.actual && (
                          <div
                            className={`text-xs ${
                              data.actual < data.predicted
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            Actual: {formatCurrency(data.actual)}
                          </div>
                        )}
                        {!data.actual && (
                          <div className="text-xs text-gray-500">Predicted</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Alert className="mt-4">
                  <Lightbulb className="h-4 w-4" />
                  <AlertTitle>AI Insight</AlertTitle>
                  <AlertDescription>
                    Based on your spending patterns, we predict your expenses
                    will be 5% lower next month. Great job on improving your
                    spending habits!
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            <div className="grid gap-4">
              {mockInsights.goals.map((goal) => {
                const progress = (goal.current / goal.target) * 100;
                return (
                  <Card key={goal.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5 text-blue-600" />
                          {goal.title}
                        </CardTitle>
                        <Badge className={getGoalStatusColor(goal.status)}>
                          {goal.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>
                            {formatCurrency(goal.current)} of{" "}
                            {formatCurrency(goal.target)}
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{progress.toFixed(1)}% complete</span>
                          <span>
                            Due: {new Date(goal.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
