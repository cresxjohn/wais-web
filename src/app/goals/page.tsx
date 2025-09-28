"use client";

import { AppLayout } from "@/components/layout/app-layout";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useSavingsGoalsStore } from "@/stores/savings-goals-store";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  Target,
  TrendingUp,
  Trophy,
  Star,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Users,
  Gift,
  Zap,
  Award,
  CheckCircle,
  Circle,
  DollarSign,
  PiggyBank,
  Home,
  Car,
  GraduationCap,
  Plane,
  Heart,
  MoreHorizontal,
} from "lucide-react";
import { formatDistanceToNow, differenceInDays } from "date-fns";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";
import { useState } from "react";

const categoryIcons = {
  emergency: "🚨",
  vacation: "✈️",
  house: "🏠",
  car: "🚗",
  education: "🎓",
  retirement: "👴",
  other: "🎯",
};

const priorityColors = {
  high: "border-red-500 bg-red-50 dark:bg-red-950/20",
  medium: "border-orange-500 bg-orange-50 dark:bg-orange-950/20",
  low: "border-green-500 bg-green-50 dark:bg-green-950/20",
};

const progressData = [
  { month: "Jul", saved: 45000 },
  { month: "Aug", saved: 52000 },
  { month: "Sep", saved: 67000 },
  { month: "Oct", saved: 89000 },
  { month: "Nov", saved: 112000 },
  { month: "Dec", saved: 135000 },
  { month: "Jan", saved: 155000 },
];

export default function SavingsGoalsPage() {
  const {
    goals,
    transactions,
    achievements,
    challenges,
    selectedGoal,
    setSelectedGoal,
    getTotalSaved,
    getTotalTargetAmount,
    getOverallProgress,
    getGoalProgress,
    getGoalTransactions,
    getCompletedGoals,
    getActiveGoals,
    getMonthlyAutoSaveTotal,
    addToGoal,
    withdrawFromGoal,
  } = useSavingsGoalsStore();

  const [newGoalOpen, setNewGoalOpen] = useState(false);
  const [selectedGoalForAction, setSelectedGoalForAction] = useState<
    string | null
  >(null);
  const [actionAmount, setActionAmount] = useState("");
  const [actionDescription, setActionDescription] = useState("");

  const totalSaved = getTotalSaved();
  const totalTarget = getTotalTargetAmount();
  const overallProgress = getOverallProgress();
  const completedGoals = getCompletedGoals();
  const activeGoals = getActiveGoals();
  const monthlyAutoSave = getMonthlyAutoSaveTotal();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  const getTimeRemaining = (targetDate: string) => {
    const days = differenceInDays(new Date(targetDate), new Date());
    if (days < 0) return "Overdue";
    if (days === 0) return "Due today";
    if (days === 1) return "1 day left";
    return `${days} days left`;
  };

  const getTimeRemainingColor = (targetDate: string) => {
    const days = differenceInDays(new Date(targetDate), new Date());
    if (days < 0) return "text-red-600";
    if (days <= 30) return "text-orange-600";
    if (days <= 90) return "text-yellow-600";
    return "text-green-600";
  };

  const handleAddToGoal = (goalId: string) => {
    const amount = parseFloat(actionAmount);
    if (amount && actionDescription && goalId) {
      addToGoal(goalId, amount, actionDescription);
      setActionAmount("");
      setActionDescription("");
      setSelectedGoalForAction(null);
    }
  };

  const GoalCard = ({ goal }: { goal: any }) => {
    const progress = getGoalProgress(goal.id);
    const remainingAmount = goal.targetAmount - goal.currentAmount;
    const isCompleted = goal.isCompleted;

    return (
      <Card
        className={cn(
          "overflow-hidden hover:shadow-lg transition-all cursor-pointer group",
          priorityColors[goal.priority],
          isCompleted && "opacity-75"
        )}
      >
        <CardContent className="p-0">
          {/* Goal Header */}
          <div
            className={cn(
              "relative p-4 text-white bg-gradient-to-r",
              goal.color
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{goal.icon}</div>
                <div>
                  <h3 className="font-semibold text-lg">{goal.name}</h3>
                  <p className="text-sm opacity-90">{goal.description}</p>
                </div>
              </div>
              {isCompleted && (
                <CheckCircle className="w-6 h-6 text-green-200" />
              )}
              {goal.priority === "high" && !isCompleted && (
                <Star className="w-5 h-5 text-yellow-200" />
              )}
            </div>

            {goal.autoSave && (
              <div className="mt-3 flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span className="text-sm">
                  Auto-save: {formatCurrency(goal.autoSaveAmount)}{" "}
                  {goal.autoSaveFrequency}
                </span>
              </div>
            )}
          </div>

          {/* Progress Section */}
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm font-semibold">
                  {progress.toFixed(1)}%
                </span>
              </div>
              <Progress value={Math.min(progress, 100)} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-green-600">
                  {formatCurrency(goal.currentAmount)}
                </span>
                <span className="text-muted-foreground">
                  of {formatCurrency(goal.targetAmount)}
                </span>
              </div>
            </div>

            {!isCompleted && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Remaining
                  </span>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      getTimeRemainingColor(goal.targetDate)
                    )}
                  >
                    {getTimeRemaining(goal.targetDate)}
                  </span>
                </div>
                <p className="text-lg font-semibold text-orange-600">
                  {formatCurrency(remainingAmount)}
                </p>
              </div>
            )}

            {isCompleted && goal.completedAt && (
              <div className="text-center py-2">
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  Completed {formatDistanceToNow(new Date(goal.completedAt))}{" "}
                  ago
                </Badge>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2">
              {!isCompleted && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setSelectedGoalForAction(goal.id)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedGoal(goal)}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </>
              )}
              {isCompleted && (
                <Button variant="outline" size="sm" className="flex-1">
                  <Trophy className="w-4 h-4 mr-1" />
                  View Details
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const AchievementBadge = ({ achievement }: { achievement: any }) => (
    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
      <div className="text-2xl">{achievement.icon}</div>
      <div className="flex-1">
        <p className="font-semibold text-yellow-800 dark:text-yellow-200">
          {achievement.name}
        </p>
        <p className="text-sm text-yellow-700 dark:text-yellow-300">
          {achievement.description}
        </p>
        <p className="text-xs text-yellow-600 dark:text-yellow-400">
          Unlocked {formatDistanceToNow(new Date(achievement.unlockedAt))} ago
        </p>
      </div>
      <Award className="w-6 h-6 text-yellow-600" />
    </div>
  );

  const ChallengeCard = ({ challenge }: { challenge: any }) => (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{challenge.name}</CardTitle>
          <Badge variant={challenge.isActive ? "default" : "secondary"}>
            {challenge.isActive ? "Active" : "Ended"}
          </Badge>
        </div>
        <CardDescription>{challenge.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>{challenge.participants.toLocaleString()} participants</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{challenge.duration} days</span>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            Target: {formatCurrency(challenge.targetAmount)}
          </p>
          <p className="text-sm font-medium text-green-600 mt-1">
            <Gift className="w-4 h-4 inline mr-1" />
            {challenge.reward}
          </p>
        </div>
        <Button
          className="w-full"
          variant={challenge.isActive ? "default" : "secondary"}
        >
          {challenge.isActive ? "Join Challenge" : "View Results"}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <AppLayout title="Savings Goals">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
              <PiggyBank className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totalSaved)}
              </div>
              <p className="text-xs text-muted-foreground">
                Across {goals.length} goals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Overall Progress
              </CardTitle>
              <Target className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {overallProgress.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(totalTarget)} target
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Goals Completed
              </CardTitle>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {completedGoals.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {activeGoals.length} active goals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Auto-Save</CardTitle>
              <Zap className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(monthlyAutoSave)}
              </div>
              <p className="text-xs text-muted-foreground">Per month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="goals" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="goals">My Goals</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <Dialog open={newGoalOpen} onOpenChange={setNewGoalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Goal
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Savings Goal</DialogTitle>
                  <DialogDescription>
                    Set up a new savings target and track your progress
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="goal-name">Goal Name</Label>
                    <Input id="goal-name" placeholder="e.g., Emergency Fund" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goal-description">Description</Label>
                    <Textarea
                      id="goal-description"
                      placeholder="What is this goal for?"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="target-amount">Target Amount</Label>
                      <Input
                        id="target-amount"
                        type="number"
                        placeholder="50000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="target-date">Target Date</Label>
                      <Input id="target-date" type="date" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emergency">🚨 Emergency</SelectItem>
                        <SelectItem value="vacation">✈️ Vacation</SelectItem>
                        <SelectItem value="house">🏠 House</SelectItem>
                        <SelectItem value="car">🚗 Car</SelectItem>
                        <SelectItem value="education">🎓 Education</SelectItem>
                        <SelectItem value="retirement">
                          👴 Retirement
                        </SelectItem>
                        <SelectItem value="other">🎯 Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-save" />
                    <Label htmlFor="auto-save">Enable auto-save</Label>
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <Button className="flex-1">Create Goal</Button>
                    <Button
                      variant="outline"
                      onClick={() => setNewGoalOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
                <CardDescription>
                  Badges earned on your savings journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.map((achievement) => (
                    <AchievementBadge
                      key={achievement.id}
                      achievement={achievement}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Progress Over Time */}
              <Card>
                <CardHeader>
                  <CardTitle>Savings Progress</CardTitle>
                  <CardDescription>
                    Your total savings growth over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: any) => formatCurrency(value)}
                      />
                      <Area
                        type="monotone"
                        dataKey="saved"
                        stroke="#10B981"
                        fill="#10B981"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Goal Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Goals by Category</CardTitle>
                  <CardDescription>
                    Breakdown of your savings goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(
                      goals.reduce((acc: any, goal) => {
                        acc[goal.category] = (acc[goal.category] || 0) + 1;
                        return acc;
                      }, {})
                    ).map(([category, count]: [string, any]) => (
                      <div
                        key={category}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">
                            {
                              categoryIcons[
                                category as keyof typeof categoryIcons
                              ]
                            }
                          </span>
                          <span className="capitalize">{category}</span>
                        </div>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Summary */}
            <Card>
              <CardHeader>
                <CardTitle>This Month Summary</CardTitle>
                <CardDescription>
                  Your savings activity for January 2025
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <ArrowUpRight className="w-8 h-8 mx-auto text-green-600 mb-2" />
                    <p className="text-2xl font-bold text-green-600">₱26,000</p>
                    <p className="text-sm text-muted-foreground">Total Saved</p>
                    <p className="text-xs text-green-600 mt-1">
                      ↑ 15% vs last month
                    </p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Target className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                    <p className="text-2xl font-bold text-blue-600">3</p>
                    <p className="text-sm text-muted-foreground">
                      Goals Updated
                    </p>
                    <p className="text-xs text-blue-600 mt-1">All on track</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Star className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                    <p className="text-2xl font-bold text-purple-600">2</p>
                    <p className="text-sm text-muted-foreground">
                      Achievements
                    </p>
                    <p className="text-xs text-purple-600 mt-1">Keep it up!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Money Dialog */}
        {selectedGoalForAction && (
          <Dialog
            open={!!selectedGoalForAction}
            onOpenChange={() => setSelectedGoalForAction(null)}
          >
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add to Goal</DialogTitle>
                <DialogDescription>
                  Add money to{" "}
                  {goals.find((g) => g.id === selectedGoalForAction)?.name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="1000"
                    value={actionAmount}
                    onChange={(e) => setActionAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="e.g., Bonus allocation"
                    value={actionDescription}
                    onChange={(e) => setActionDescription(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleAddToGoal(selectedGoalForAction)}
                    disabled={!actionAmount || !actionDescription}
                  >
                    Add Money
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedGoalForAction(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AppLayout>
  );
}
