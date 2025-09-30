"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AccountCard, AddAccountCard } from "./account-card";
import { Building2, CreditCard, Wallet } from "lucide-react";

export function AccountCarousel() {
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
        <AccountCard
          icon={<Wallet className="w-5 h-5 text-blue-600" />}
          name="Cash Account"
          bank="BDO •••• 2847"
          amount="₱45,230.75"
        />
        <AccountCard
          icon={<Building2 className="w-5 h-5 text-green-600" />}
          name="Savings"
          bank="Metrobank •••• 5619"
          amount="₱68,500.00"
        />
        <AccountCard
          icon={<CreditCard className="w-5 h-5 text-purple-600" />}
          name="Credit Card"
          bank="BPI •••• 9123"
          amount="₱-12,350.25"
          negative
        />
        <AccountCard
          icon={<Wallet className="w-5 h-5 text-orange-600" />}
          name="Business Account"
          bank="UnionBank •••• 1234"
          amount="₱25,750.00"
        />
        <AccountCard
          icon={<Building2 className="w-5 h-5 text-red-600" />}
          name="Investment Account"
          bank="Security Bank •••• 5678"
          amount="₱87,650.25"
        />
        <AddAccountCard />
      </div>
    </div>
  );
}
