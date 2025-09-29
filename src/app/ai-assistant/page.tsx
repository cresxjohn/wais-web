"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAIAssistantStore } from "@/stores/ai-assistant-store";
import { cn } from "@/lib/utils";
import {
  Bot,
  User,
  Send,
  CheckCircle,
  Plus,
  MoreHorizontal,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function AIAssistantPage() {
  const {
    conversations,
    currentConversation,
    isLoading,
    isTyping,
    createConversation,
    setCurrentConversation,
    addMessage,
    deleteConversation,
    setTyping,
  } = useAIAssistantStore();

  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentConversation?.messages, isTyping]);

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
    <div className="flex items-start space-x-4">
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarFallback
          className={cn(
            message.role === "user"
              ? "bg-blue-500 text-white"
              : "bg-green-500 text-white"
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
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {message.role === "user" ? "You" : "WAIS AI"}
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
          {message.content.split("\n").map((line: string, index: number) => (
            <p key={index} className="mb-2 last:mb-0">
              {line}
            </p>
          ))}
        </div>
        {message.metadata?.recommendations && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Key Recommendations:
            </p>
            <ul className="space-y-1">
              {message.metadata.recommendations.map(
                (rec: string, index: number) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {rec}
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <AppLayout title="">
      <div className="flex h-[calc(100vh-4rem)] bg-white dark:bg-gray-950">
        {/* Conversations Sidebar */}
        <div className="w-80 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">WAIS AI</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => startNewConversation()}
                className="h-8 w-8 p-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Conversations List */}
          <ScrollArea className="flex-1 px-2">
            <div className="space-y-1 py-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={cn(
                    "group relative p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                    currentConversation?.id === conversation.id &&
                      "bg-gray-100 dark:bg-gray-800"
                  )}
                  onClick={() => setCurrentConversation(conversation)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
                        {conversation.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {conversation.messages.length} messages
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conversation.id);
                      }}
                    >
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col">
          {currentConversation ? (
            <>
              {/* Messages Area */}
              <ScrollArea className="flex-1 px-4">
                <div className="max-w-3xl mx-auto py-8 space-y-6">
                  {currentConversation.messages.map((message) => (
                    <MessageComponent key={message.id} message={message} />
                  ))}
                  {isTyping && (
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="bg-green-500 text-white">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
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
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t border-gray-200 dark:border-gray-800 p-4">
                <div className="max-w-3xl mx-auto">
                  <div className="relative flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-3">
                    <Input
                      ref={inputRef}
                      placeholder="Message WAIS AI..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isLoading}
                      className="flex-1 border-0 bg-transparent focus:ring-0 focus:outline-none"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      size="sm"
                      className="ml-2 h-8 w-8 p-0 bg-green-500 hover:bg-green-600"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Welcome Screen */
            <div className="flex-1 flex items-center justify-center">
              <div className="max-w-2xl mx-auto text-center space-y-6 px-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                  <Bot className="w-8 h-8 text-white" />
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
                    Welcome to WAIS AI
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    Your personal financial assistant
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
                  <Button
                    variant="outline"
                    className="h-12 text-sm"
                    onClick={() =>
                      startNewConversation("Budget Help", "budgeting")
                    }
                  >
                    💰 Budget Help
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 text-sm"
                    onClick={() =>
                      startNewConversation("Savings Plan", "savings")
                    }
                  >
                    🎯 Savings Goals
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 text-sm"
                    onClick={() =>
                      startNewConversation("Debt Strategy", "debt")
                    }
                  >
                    💳 Debt Strategy
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 text-sm"
                    onClick={() =>
                      startNewConversation("Investment Advice", "investments")
                    }
                  >
                    📈 Investments
                  </Button>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Click on any topic above or start a new conversation to get
                  personalized financial advice
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
