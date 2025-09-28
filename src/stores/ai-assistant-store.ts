"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
  type?: "text" | "chart" | "recommendation" | "insight";
  metadata?: {
    chartData?: any;
    recommendations?: string[];
    insights?: {
      title: string;
      description: string;
      impact: "positive" | "negative" | "neutral";
      actionable: boolean;
    };
  };
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  category:
    | "general"
    | "budgeting"
    | "investments"
    | "savings"
    | "debt"
    | "planning";
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  category: "spending" | "saving" | "earning" | "investing" | "budgeting";
  priority: "high" | "medium" | "low";
  actionable: boolean;
  actions: {
    label: string;
    description: string;
    type:
      | "budget_adjust"
      | "goal_create"
      | "spending_limit"
      | "investment"
      | "other";
  }[];
  createdAt: string;
  isRead: boolean;
  impact: {
    financial: number; // potential savings/earnings
    timeframe: "immediate" | "short_term" | "long_term";
  };
}

export interface QuickTip {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  potentialSavings: number;
  isBookmarked: boolean;
}

interface AIAssistantStore {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  insights: AIInsight[];
  quickTips: QuickTip[];
  isLoading: boolean;
  isTyping: boolean;

  // Actions
  setConversations: (conversations: Conversation[]) => void;
  createConversation: (title?: string, category?: string) => Conversation;
  setCurrentConversation: (conversation: Conversation | null) => void;
  addMessage: (
    conversationId: string,
    content: string,
    role: "user" | "assistant",
    type?: string,
    metadata?: any
  ) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;

  addInsight: (insight: Omit<AIInsight, "id" | "createdAt">) => void;
  markInsightAsRead: (id: string) => void;
  deleteInsight: (id: string) => void;

  toggleTipBookmark: (id: string) => void;

  setLoading: (loading: boolean) => void;
  setTyping: (typing: boolean) => void;

  // Computed
  getUnreadInsights: () => AIInsight[];
  getInsightsByCategory: (category: string) => AIInsight[];
  getConversationsByCategory: (category: string) => Conversation[];
  getBookmarkedTips: () => QuickTip[];
}

// Mock data
const mockConversations: Conversation[] = [
  {
    id: "1",
    title: "Help with Emergency Fund Planning",
    category: "savings",
    createdAt: "2025-01-03T10:30:00Z",
    updatedAt: "2025-01-03T11:15:00Z",
    messages: [
      {
        id: "msg-1",
        content:
          "Hi! I need help planning my emergency fund. How much should I save?",
        role: "user",
        timestamp: "2025-01-03T10:30:00Z",
      },
      {
        id: "msg-2",
        content:
          "Great question! Based on your current monthly expenses of ₱42,456, I recommend building an emergency fund of ₱127,368 to ₱254,736 (3-6 months of expenses). \n\nHere's a personalized plan:\n\n**Phase 1: Mini Emergency Fund (₱30,000)**\n- Start with a small goal to build momentum\n- Save ₱5,000/month for 6 months\n\n**Phase 2: Full Emergency Fund (₱170,000)**\n- Continue saving ₱7,000/month for 20 months\n- Keep in high-yield savings account\n\nWould you like me to help you set up automatic transfers to reach this goal?",
        role: "assistant",
        timestamp: "2025-01-03T10:32:00Z",
        type: "recommendation",
        metadata: {
          recommendations: [
            "Start with ₱30,000 mini emergency fund",
            "Set up automatic transfers of ₱5,000/month",
            "Use high-yield savings account",
            "Aim for 3-6 months of expenses total",
          ],
        },
      },
      {
        id: "msg-3",
        content:
          "That sounds perfect! How do I set up the automatic transfers?",
        role: "user",
        timestamp: "2025-01-03T11:10:00Z",
      },
      {
        id: "msg-4",
        content:
          "I can help you set that up right now! Here are the steps:\n\n1. **Create Emergency Fund Goal** - I'll add it to your savings goals\n2. **Set Up Auto-Transfer** - Link your primary account to automatically transfer ₱5,000 on the 1st of each month\n3. **Choose High-Yield Account** - I recommend using your BPI savings account (1.5% APY)\n\nShould I create this goal for you and set up the auto-save feature?",
        role: "assistant",
        timestamp: "2025-01-03T11:12:00Z",
      },
    ],
  },
  {
    id: "2",
    title: "Credit Card Debt Strategy",
    category: "debt",
    createdAt: "2025-01-02T14:20:00Z",
    updatedAt: "2025-01-02T15:05:00Z",
    messages: [
      {
        id: "msg-5",
        content:
          "I have credit card debt across 3 cards. What's the best way to pay them off?",
        role: "user",
        timestamp: "2025-01-02T14:20:00Z",
      },
      {
        id: "msg-6",
        content:
          "I can see your credit card situation:\n\n**Current Debt:**\n- Chase Travel Card: ₱2,451 (18.99% APR)\n- BDO Cashback: ₱1,205 (22.99% APR)\n- BPI Premium: ₱0 (16.99% APR)\n\n**Recommended Strategy: Avalanche Method**\n\n1. **Priority 1**: BDO Cashback (Highest APR at 22.99%)\n   - Pay ₱1,500/month until cleared (1 month)\n   \n2. **Priority 2**: Chase Travel Card (18.99% APR)\n   - Pay ₱2,500/month until cleared (1 month)\n\n**Total Payoff Time**: 2 months\n**Interest Saved**: ₱185 vs minimum payments\n\nShould I create a debt payoff plan with automatic payments?",
        role: "assistant",
        timestamp: "2025-01-02T14:25:00Z",
        type: "recommendation",
      },
    ],
  },
];

const mockInsights: AIInsight[] = [
  {
    id: "insight-1",
    title: "Entertainment Budget Exceeded",
    description:
      "You've spent ₱5,250 on entertainment this month, which is 105% of your ₱5,000 budget. Consider reducing streaming subscriptions or finding free alternatives.",
    category: "spending",
    priority: "high",
    actionable: true,
    actions: [
      {
        label: "Review Subscriptions",
        description: "Cancel unused streaming services",
        type: "spending_limit",
      },
      {
        label: "Adjust Budget",
        description: "Increase entertainment budget to ₱6,000",
        type: "budget_adjust",
      },
    ],
    createdAt: "2025-01-05T09:30:00Z",
    isRead: false,
    impact: {
      financial: 1000,
      timeframe: "immediate",
    },
  },
  {
    id: "insight-2",
    title: "Savings Rate Opportunity",
    description:
      "Your current savings rate is 18%. You could increase it to 25% by optimizing your food spending, potentially saving ₱3,500 more per month.",
    category: "saving",
    priority: "medium",
    actionable: true,
    actions: [
      {
        label: "Meal Planning",
        description: "Plan weekly meals to reduce food waste",
        type: "other",
      },
      {
        label: "Create Savings Goal",
        description: "Set up automatic transfer for extra savings",
        type: "goal_create",
      },
    ],
    createdAt: "2025-01-04T16:45:00Z",
    isRead: false,
    impact: {
      financial: 3500,
      timeframe: "short_term",
    },
  },
  {
    id: "insight-3",
    title: "Investment Recommendation",
    description:
      "With ₱155,000 total savings, you're ready to start investing. Consider allocating 60% to low-cost index funds for long-term growth.",
    category: "investing",
    priority: "medium",
    actionable: true,
    actions: [
      {
        label: "Start Investment Account",
        description: "Open a diversified portfolio",
        type: "investment",
      },
    ],
    createdAt: "2025-01-03T11:20:00Z",
    isRead: true,
    impact: {
      financial: 15500,
      timeframe: "long_term",
    },
  },
];

const mockQuickTips: QuickTip[] = [
  {
    id: "tip-1",
    title: "The 24-Hour Purchase Rule",
    description:
      "Wait 24 hours before making any non-essential purchase over ₱1,000. This simple rule can reduce impulse buying by up to 70%.",
    category: "spending",
    difficulty: "beginner",
    estimatedTime: "1 minute setup",
    potentialSavings: 5000,
    isBookmarked: true,
  },
  {
    id: "tip-2",
    title: "Automate Your Savings",
    description:
      "Set up automatic transfers to savings accounts right after payday. Pay yourself first before any expenses.",
    category: "saving",
    difficulty: "beginner",
    estimatedTime: "5 minutes",
    potentialSavings: 12000,
    isBookmarked: false,
  },
  {
    id: "tip-3",
    title: "High-Yield Savings Account",
    description:
      "Move your emergency fund to a high-yield savings account earning 2.5% APY instead of traditional 0.5% savings.",
    category: "earning",
    difficulty: "intermediate",
    estimatedTime: "15 minutes",
    potentialSavings: 3000,
    isBookmarked: true,
  },
  {
    id: "tip-4",
    title: "Credit Card Points Optimization",
    description:
      "Use your rewards credit card for all regular expenses and pay it off monthly to maximize points without interest.",
    category: "earning",
    difficulty: "intermediate",
    estimatedTime: "10 minutes setup",
    potentialSavings: 8000,
    isBookmarked: false,
  },
  {
    id: "tip-5",
    title: "Expense Categorization Review",
    description:
      "Review and recategorize your expenses monthly to identify spending patterns and optimization opportunities.",
    category: "budgeting",
    difficulty: "beginner",
    estimatedTime: "20 minutes monthly",
    potentialSavings: 2500,
    isBookmarked: false,
  },
];

export const useAIAssistantStore = create<AIAssistantStore>()(
  persist(
    (set, get) => ({
      conversations: mockConversations,
      currentConversation: null,
      insights: mockInsights,
      quickTips: mockQuickTips,
      isLoading: false,
      isTyping: false,

      setConversations: (conversations) => set({ conversations }),
      createConversation: (
        title = "New Conversation",
        category = "general"
      ) => {
        const newConversation: Conversation = {
          id: Math.random().toString(36).substr(2, 9),
          title,
          category: category as any,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: [],
        };
        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          currentConversation: newConversation,
        }));
        return newConversation;
      },
      setCurrentConversation: (conversation) =>
        set({ currentConversation: conversation }),
      addMessage: (
        conversationId,
        content,
        role,
        type = "text",
        metadata = null
      ) => {
        const newMessage: ChatMessage = {
          id: Math.random().toString(36).substr(2, 9),
          content,
          role,
          timestamp: new Date().toISOString(),
          type: type as any,
          metadata,
        };

        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, newMessage],
                  updatedAt: new Date().toISOString(),
                }
              : conv
          ),
          currentConversation:
            state.currentConversation?.id === conversationId
              ? {
                  ...state.currentConversation,
                  messages: [...state.currentConversation.messages, newMessage],
                  updatedAt: new Date().toISOString(),
                }
              : state.currentConversation,
        }));
      },
      updateConversation: (id, updates) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id
              ? { ...conv, ...updates, updatedAt: new Date().toISOString() }
              : conv
          ),
          currentConversation:
            state.currentConversation?.id === id
              ? {
                  ...state.currentConversation,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : state.currentConversation,
        })),
      deleteConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.filter((conv) => conv.id !== id),
          currentConversation:
            state.currentConversation?.id === id
              ? null
              : state.currentConversation,
        })),

      addInsight: (insight) => {
        const newInsight: AIInsight = {
          ...insight,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ insights: [newInsight, ...state.insights] }));
      },
      markInsightAsRead: (id) =>
        set((state) => ({
          insights: state.insights.map((insight) =>
            insight.id === id ? { ...insight, isRead: true } : insight
          ),
        })),
      deleteInsight: (id) =>
        set((state) => ({
          insights: state.insights.filter((insight) => insight.id !== id),
        })),

      toggleTipBookmark: (id) =>
        set((state) => ({
          quickTips: state.quickTips.map((tip) =>
            tip.id === id ? { ...tip, isBookmarked: !tip.isBookmarked } : tip
          ),
        })),

      setLoading: (isLoading) => set({ isLoading }),
      setTyping: (isTyping) => set({ isTyping }),

      // Computed
      getUnreadInsights: () => {
        const { insights } = get();
        return insights.filter((insight) => !insight.isRead);
      },
      getInsightsByCategory: (category) => {
        const { insights } = get();
        return insights.filter((insight) => insight.category === category);
      },
      getConversationsByCategory: (category) => {
        const { conversations } = get();
        return conversations.filter((conv) => conv.category === category);
      },
      getBookmarkedTips: () => {
        const { quickTips } = get();
        return quickTips.filter((tip) => tip.isBookmarked);
      },
    }),
    {
      name: "wais-ai-assistant",
      partialize: (state) => ({
        conversations: state.conversations,
        insights: state.insights,
        quickTips: state.quickTips,
      }),
    }
  )
);
