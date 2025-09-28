"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  ArrowUpDown,
  Bell,
  Bot,
  CreditCard,
  FileText,
  HelpCircle,
  LayoutDashboard,
  PiggyBank,
  Settings,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview of your finances",
  },
  {
    name: "Accounts",
    href: "/accounts",
    icon: Wallet,
    description: "Manage your financial accounts",
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: ArrowUpDown,
    description: "View and manage transactions",
  },
  {
    name: "Insights",
    href: "/insights",
    icon: TrendingUp,
    description: "AI-powered financial insights",
    badge: "AI",
  },
];

const secondaryNavigation = [
  {
    name: "Credit Cards",
    href: "/credit-cards",
    icon: CreditCard,
    description: "Manage credit cards",
  },
  {
    name: "Savings Goals",
    href: "/goals",
    icon: Target,
    description: "Track your savings goals",
  },
  {
    name: "Budget",
    href: "/budget",
    icon: PiggyBank,
    description: "Plan your spending",
  },
  {
    name: "Reports",
    href: "/reports",
    icon: FileText,
    description: "Financial reports & analytics",
  },
];

const bottomNavigation = [
  {
    name: "AI Assistant",
    href: "/ai-assistant",
    icon: Bot,
    description: "Get financial advice",
    badge: "Beta",
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: Bell,
    description: "Your notifications",
  },
  {
    name: "Help & Support",
    href: "/support",
    icon: HelpCircle,
    description: "Get help",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    description: "App preferences",
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-4 border-b">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">W</span>
        </div>
        <span className="font-bold text-xl text-gray-900 dark:text-white">
          WAIS
        </span>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-4">
          {/* Primary Navigation */}
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.name}
                  asChild
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start h-12 px-3"
                >
                  <Link href={item.href}>
                    <item.icon className="mr-3 h-5 w-5" />
                    <span className="flex-1 text-left">{item.name}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </Button>
              );
            })}
          </div>

          {/* Separator */}
          <div className="my-4 border-t" />

          {/* Secondary Navigation */}
          <div className="space-y-1">
            <h3 className="px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Tools
            </h3>
            {secondaryNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.name}
                  asChild
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start h-10 px-3 text-sm"
                >
                  <Link href={item.href}>
                    <item.icon className="mr-3 h-4 w-4" />
                    <span className="flex-1 text-left">{item.name}</span>
                  </Link>
                </Button>
              );
            })}
          </div>

          {/* Separator */}
          <div className="my-4 border-t" />

          {/* Bottom Navigation */}
          <div className="space-y-1">
            {bottomNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.name}
                  asChild
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start h-10 px-3 text-sm"
                >
                  <Link href={item.href}>
                    <item.icon className="mr-3 h-4 w-4" />
                    <span className="flex-1 text-left">{item.name}</span>
                    {item.badge && (
                      <Badge variant="outline" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
