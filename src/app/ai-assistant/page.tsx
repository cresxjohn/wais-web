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
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAIAssistantStore } from "@/stores/ai-assistant-store";
import { cn } from "@/lib/utils";
import {
  Bot,
  User,
  Send,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Bookmark,
  BookmarkCheck,
  MessageSquare,
  Zap,
  Target,
  DollarSign,
  PiggyBank,
  CreditCard,
  Calendar,
  Plus,
  MoreHorizontal,
  Clock,
  ArrowRight,
  Sparkles,
  BrainCircuit,
  LineChart,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState, useRef, useEffect } from "react";

const categoryColors = {
  general: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  budgeting: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  investments:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  savings:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  debt: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  planning:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
};

const priorityIcons = {
  high: <AlertCircle className="w-4 h-4 text-red-500" />,
  medium: <Clock className="w-4 h-4 text-orange-500" />,
  low: <CheckCircle className="w-4 h-4 text-green-500" />,
};

const categoryIcons = {
  spending: <CreditCard className="w-5 h-5" />,
  saving: <PiggyBank className="w-5 h-5" />,
  earning: <DollarSign className="w-5 h-5" />,
  investing: <TrendingUp className="w-5 h-5" />,
  budgeting: <Target className="w-5 h-5" />,
};

export default function AIAssistantPage() {
  const {
    conversations,
    currentConversation,
    insights,
    quickTips,
    isLoading,
    isTyping,
    createConversation,
    setCurrentConversation,
    addMessage,
    deleteConversation,
    getUnreadInsights,
    getBookmarkedTips,
    toggleTipBookmark,
    markInsightAsRead,
    setTyping,
  } = useAIAssistantStore();

  const [inputMessage, setInputMessage] = useState("");
  const [selectedInsightCategory, setSelectedInsightCategory] =
    useState<string>("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const unreadInsights = getUnreadInsights();
  const bookmarkedTips = getBookmarkedTips();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentConversation?.messages, isTyping]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    if (!currentConversation) {
      const newConv = createConversation();
      setCurrentConversation(newConv);
    }

    const conversationId = currentConversation?.id || conversations[0]?.id;
    if (!conversationId) return;

    // Add user message
    addMessage(conversationId, inputMessage, "user");
    const userMessage = inputMessage;
    setInputMessage("");
    setTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand your question about " +
          userMessage.toLowerCase() +
          ". Let me analyze your financial data to provide personalized advice.",
        "Based on your current financial profile, here are my recommendations...",
        "That's a great question! Let me break this down for you with specific numbers from your account.",
        "I can help you with that. Looking at your spending patterns and savings goals, here's what I suggest...",
      ];

      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];
      addMessage(conversationId, randomResponse, "assistant");
      setTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startNewConversation = (title?: string, category?: string) => {
    const newConv = createConversation(title, category);
    setCurrentConversation(newConv);
    inputRef.current?.focus();
  };

  const MessageComponent = ({ message }: { message: any }) => (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-lg",
        message.role === "user"
          ? "bg-blue-50 dark:bg-blue-950/20 ml-12"
          : "bg-gray-50 dark:bg-gray-950/50"
      )}
    >
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarFallback
          className={cn(
            message.role === "user"
              ? "bg-blue-100 text-blue-600"
              : "bg-green-100 text-green-600"
          )}
        >
          {message.role === "user" ? (
            <User className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          {message.content.split("\n").map((line: string, index: number) => (
            <p key={index}>{line}</p>
          ))}
        </div>
        {message.metadata?.recommendations && (
          <div className="mt-3">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Key Recommendations:
            </p>
            <ul className="space-y-1">
              {message.metadata.recommendations.map(
                (rec: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {rec}
                  </li>
                )
              )}
            </ul>
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(message.timestamp))} ago
        </p>
      </div>
    </div>
  );

  const InsightCard = ({ insight }: { insight: any }) => (
    <Card
      className={cn(
        "overflow-hidden hover:shadow-md transition-shadow cursor-pointer",
        !insight.isRead && "border-blue-300 dark:border-blue-700"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {categoryIcons[insight.category as keyof typeof categoryIcons]}
            <div>
              <CardTitle className="text-base">{insight.title}</CardTitle>
              <CardDescription className="mt-1">
                {insight.description}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {priorityIcons[insight.priority as keyof typeof priorityIcons]}
            {!insight.isRead && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <Badge variant="secondary" className="capitalize">
            {insight.category}
          </Badge>
          <div className="text-green-600 font-medium">
            {insight.impact.financial > 0 &&
              `+${formatCurrency(insight.impact.financial)}`}
          </div>
        </div>

        {insight.actionable && insight.actions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Quick Actions:
            </p>
            <div className="flex flex-wrap gap-2">
              {insight.actions.slice(0, 2).map((action: any, index: number) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(insight.createdAt))} ago
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markInsightAsRead(insight.id)}
          >
            {insight.isRead ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Circle className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const QuickTipCard = ({ tip }: { tip: any }) => (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-base mb-1">{tip.title}</h3>
            <p className="text-sm text-muted-foreground">{tip.description}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleTipBookmark(tip.id)}
          >
            {tip.isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 text-blue-500" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </Button>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="capitalize">
              {tip.difficulty}
            </Badge>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {tip.estimatedTime}
            </span>
          </div>
          <div className="text-green-600 font-medium">
            Save {formatCurrency(tip.potentialSavings)}
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full">
          <ArrowRight className="w-4 h-4 mr-2" />
          Learn More
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <AppLayout title="AI Assistant">
      <div className="space-y-6">
        {/* AI Assistant Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Conversations
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {conversations.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Chat sessions this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                New Insights
              </CardTitle>
              <Lightbulb className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {unreadInsights.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Personalized recommendations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Bookmarked Tips
              </CardTitle>
              <BookmarkCheck className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {bookmarkedTips.length}
              </div>
              <p className="text-xs text-muted-foreground">Saved for later</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="chat" className="space-y-4">
          <TabsList>
            <TabsTrigger value="chat">
              <Bot className="w-4 h-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="insights">
              <Lightbulb className="w-4 h-4 mr-2" />
              Insights ({unreadInsights.length})
            </TabsTrigger>
            <TabsTrigger value="tips">
              <Sparkles className="w-4 h-4 mr-2" />
              Quick Tips
            </TabsTrigger>
          </TabsList>

          {/* Chat Tab */}
          <TabsContent value="chat">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
              {/* Conversations Sidebar */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Conversations</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startNewConversation()}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-2 p-4">
                      {conversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          className={cn(
                            "p-3 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors",
                            currentConversation?.id === conversation.id &&
                              "bg-muted"
                          )}
                          onClick={() => setCurrentConversation(conversation)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">
                                {conversation.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {conversation.messages.length} messages
                              </p>
                              <Badge
                                variant="secondary"
                                className={cn(
                                  "text-xs mt-1",
                                  categoryColors[
                                    conversation.category as keyof typeof categoryColors
                                  ]
                                )}
                              >
                                {conversation.category}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteConversation(conversation.id);
                              }}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Chat Interface */}
              <Card className="lg:col-span-3">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-green-100 text-green-600">
                        <BrainCircuit className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">
                        WAIS AI Assistant
                      </CardTitle>
                      <CardDescription>
                        Your personal financial advisor
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="ml-auto">
                      Beta
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col h-[500px]">
                  {/* Messages Area */}
                  <ScrollArea className="flex-1 -mx-4 px-4">
                    {currentConversation ? (
                      <div className="space-y-4">
                        {currentConversation.messages.map((message) => (
                          <MessageComponent
                            key={message.id}
                            message={message}
                          />
                        ))}
                        {isTyping && (
                          <div className="flex gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-950/50">
                            <Avatar className="w-8 h-8 flex-shrink-0">
                              <AvatarFallback className="bg-green-100 text-green-600">
                                <Bot className="w-4 h-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex items-center space-x-1">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div
                                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.1s" }}
                                ></div>
                                <div
                                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                  style={{ animationDelay: "0.2s" }}
                                ></div>
                              </div>
                              <span className="text-sm text-muted-foreground ml-2">
                                AI is typing...
                              </span>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                          <Bot className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            Welcome to WAIS AI Assistant!
                          </h3>
                          <p className="text-muted-foreground mt-2">
                            I'm here to help you with personalized financial
                            advice, budgeting tips, and investment strategies.
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-6">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              startNewConversation("Budget Help", "budgeting")
                            }
                          >
                            Budget Help
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              startNewConversation("Savings Plan", "savings")
                            }
                          >
                            Savings Plan
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              startNewConversation("Debt Strategy", "debt")
                            }
                          >
                            Debt Strategy
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              startNewConversation(
                                "Investment Advice",
                                "investments"
                              )
                            }
                          >
                            Investment Advice
                          </Button>
                        </div>
                      </div>
                    )}
                  </ScrollArea>

                  {/* Input Area */}
                  <div className="flex items-center space-x-2 pt-4 border-t">
                    <Input
                      ref={inputRef}
                      placeholder="Ask me anything about your finances..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      size="sm"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">AI Insights</h2>
                <p className="text-muted-foreground">
                  Personalized recommendations based on your financial data
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  className="px-3 py-1 border rounded-md text-sm"
                  value={selectedInsightCategory}
                  onChange={(e) => setSelectedInsightCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="spending">Spending</option>
                  <option value="saving">Saving</option>
                  <option value="earning">Earning</option>
                  <option value="investing">Investing</option>
                  <option value="budgeting">Budgeting</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {insights
                .filter(
                  (insight) =>
                    selectedInsightCategory === "all" ||
                    insight.category === selectedInsightCategory
                )
                .map((insight) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
            </div>
          </TabsContent>

          {/* Tips Tab */}
          <TabsContent value="tips" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Quick Tips</h2>
                <p className="text-muted-foreground">
                  Actionable financial tips you can implement today
                </p>
              </div>
            </div>

            {bookmarkedTips.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Bookmarked Tips</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {bookmarkedTips.map((tip) => (
                    <QuickTipCard key={tip.id} tip={tip} />
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-3">All Tips</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {quickTips.map((tip) => (
                  <QuickTipCard key={tip.id} tip={tip} />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
