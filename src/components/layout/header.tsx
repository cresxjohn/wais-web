"use client";

import { Bell, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks";

export function Header() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };
  return (
    <div className="flex justify-end items-center mb-4">
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-full font-medium transition-colors cursor-pointer">
          <Sparkles className="w-4 h-4" />
          Ask AI
        </button>
        <button className="flex items-center justify-center w-8 h-8 text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
          <Bell className="w-4 h-4" />
        </button>
        <button
          className="flex items-center gap-3 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          onClick={handleLogout}
          title="Click to logout"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {user?.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : "CJ"}
            </span>
          </div>
          <span className="font-medium text-gray-900">
            {user?.name || "@cresxjohn"}
          </span>
        </button>
      </div>
    </div>
  );
}
