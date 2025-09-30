"use client";

import {
  BarChart3,
  CreditCard,
  HelpCircle,
  LayoutDashboard,
  Settings,
  Wallet,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  SidebarItem,
  SidebarItemWithBadge,
  CollapsibleSidebarItem,
  SidebarSubItem,
} from "./sidebar-item";

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isToolsExpanded, setIsToolsExpanded] = useState(true);

  const isActive = (path: string) => pathname === path;

  const navigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className="w-72 bg-white sticky top-0 h-screen overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-3 mt-2 ml-5 mb-8">
          <img
            src="/walz-logo.png"
            alt="walz logo"
            className="h-8 rounded-lg"
          />
        </div>

        <nav className="space-y-2">
          <SidebarItem
            icon={LayoutDashboard}
            label="Dashboard"
            active={isActive("/dashboard")}
            onClick={() => navigate("/dashboard")}
          />
          <SidebarItem
            icon={Wallet}
            label="Accounts"
            active={isActive("/accounts")}
            onClick={() => navigate("/accounts")}
          />
          <SidebarItem
            icon={CreditCard}
            label="Payments"
            active={isActive("/payments")}
            onClick={() => navigate("/payments")}
          />
          <SidebarItemWithBadge
            icon={BarChart3}
            label="Insights"
            badge="AI"
            active={isActive("/insights")}
            onClick={() => navigate("/insights")}
          />

          <CollapsibleSidebarItem
            icon={Wrench}
            label="Tools"
            isExpanded={isToolsExpanded}
            onToggle={() => setIsToolsExpanded(!isToolsExpanded)}
          />

          <div
            className={`ml-6 space-y-1 mt-2 mb-3 overflow-hidden transition-all duration-300 ease-in-out ${
              isToolsExpanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <SidebarSubItem
              label="Credit Cards"
              active={isActive("/credit-cards")}
              onClick={() => navigate("/credit-cards")}
            />
            <SidebarSubItem
              label="Savings Goals"
              active={isActive("/savings-goals")}
              onClick={() => navigate("/savings-goals")}
            />
            <SidebarSubItem
              label="Budget"
              active={isActive("/budget")}
              onClick={() => navigate("/budget")}
            />
            <SidebarSubItem
              label="Reports"
              active={isActive("/reports")}
              onClick={() => navigate("/reports")}
            />
          </div>

          {/* Bottom Section */}
          <div className="space-y-2">
            <SidebarItem
              icon={HelpCircle}
              label="Help & Support"
              active={isActive("/help")}
              onClick={() => navigate("/help")}
            />
            <SidebarItem
              icon={Settings}
              label="Settings"
              active={isActive("/settings")}
              onClick={() => navigate("/settings")}
            />
          </div>
        </nav>
      </div>
    </div>
  );
}
