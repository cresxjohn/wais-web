"use client";

import { ReactNode } from "react";
import { Sidebar } from "./sidebar/sidebar";
import { Header } from "./header";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 bg-white overflow-auto">
        <div className="max-w-4xl mx-auto px-8 py-6">
          <Header />
          {children}
        </div>
      </div>
    </div>
  );
}
