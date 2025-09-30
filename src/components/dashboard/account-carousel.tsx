"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AccountCard, AddAccountCard } from "./account-card";
import {
  Building2,
  CreditCard,
  Wallet,
  PiggyBank,
  DollarSign,
  Car,
} from "lucide-react";
import { formatAccountBalance } from "@/hooks/use-dashboard-data";
import type { Account } from "@/lib/graphql-client";

interface AccountCarouselProps {
  accounts?: Account[];
}

// Map account types to icons
const getAccountIcon = (type: string) => {
  const accountType = type.toLowerCase();
  switch (accountType) {
    case "cash":
      return <Wallet className="w-5 h-5 text-blue-600" />;
    case "savings":
      return <PiggyBank className="w-5 h-5 text-green-600" />;
    case "checking":
      return <Building2 className="w-5 h-5 text-orange-600" />;
    case "credit_card":
    case "line_of_credit":
      return <CreditCard className="w-5 h-5 text-purple-600" />;
    case "loan":
      return <Car className="w-5 h-5 text-red-600" />;
    case "insurance":
      return <DollarSign className="w-5 h-5 text-indigo-600" />;
    default:
      return <Wallet className="w-5 h-5 text-gray-600" />;
  }
};

export function AccountCarousel({ accounts = [] }: AccountCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    setShowLeftButton(scrollLeft > 0);
    setShowRightButton(scrollLeft < scrollWidth - clientWidth - 1);
  };

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollBy({ left: -320, behavior: "smooth" });
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollBy({ left: 320, behavior: "smooth" });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Check initial state
    checkScrollButtons();

    // Add resize observer to check when container size changes
    const resizeObserver = new ResizeObserver(() => {
      checkScrollButtons();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="relative">
      {/* Left Navigation Button */}
      {showLeftButton && (
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg rounded-full w-10 h-10 flex items-center justify-center hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
          style={{
            animation: showLeftButton
              ? "fadeIn 300ms ease-in-out"
              : "fadeOut 300ms ease-in-out",
          }}
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
      )}

      {/* Right Navigation Button */}
      {showRightButton && (
        <button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg rounded-full w-10 h-10 flex items-center justify-center hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
          style={{
            animation: showRightButton
              ? "fadeIn 300ms ease-in-out"
              : "fadeOut 300ms ease-in-out",
          }}
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      )}

      {/* Scrollable Cards Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
        onScroll={checkScrollButtons}
      >
        {accounts.length > 0 ? (
          <>
            {accounts
              .filter((account) => !account.excludeFromStats) // Only show active accounts
              .map((account) => {
                const balanceInfo = formatAccountBalance(account);
                return (
                  <AccountCard
                    key={account.id}
                    icon={getAccountIcon(account.type)}
                    name={account.name}
                    bank={`${account.institution || "Bank"} ${
                      account.accountNumberLast4
                        ? `•••• ${account.accountNumberLast4}`
                        : ""
                    }`}
                    amount={balanceInfo.formatted}
                    negative={balanceInfo.isNegative}
                    onClick={() => {
                      // Handle account click - could navigate to account details
                      console.log("Account clicked:", account.id);
                    }}
                  />
                );
              })}
            <AddAccountCard />
          </>
        ) : (
          <>
            {/* Show placeholder when no accounts */}
            <div className="flex-shrink-0 w-80 bg-gray-50 rounded-xl p-6 flex items-center justify-center">
              <div className="text-center">
                <PiggyBank className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium mb-2">
                  No accounts yet
                </p>
                <p className="text-sm text-gray-500">
                  Add your first account to get started
                </p>
              </div>
            </div>
            <AddAccountCard />
          </>
        )}
      </div>
    </div>
  );
}
