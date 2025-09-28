"use client";

import { notificationScheduler } from "@/services/notification-initializer";
import { useAppStore } from "@/stores/app-store";
import { useEffect } from "react";

export function AppInitializer() {
  const { initializeNotifications, theme, setTheme } = useAppStore();

  useEffect(() => {
    // Initialize notifications with sample data
    initializeNotifications();

    // Apply theme on initial load
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;

      if (theme === "dark") {
        root.classList.add("dark");
      } else if (theme === "light") {
        root.classList.remove("dark");
      } else {
        // System preference
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
        if (systemTheme === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }

      // Listen for system theme changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        if (theme === "system") {
          if (e.matches) {
            root.classList.add("dark");
          } else {
            root.classList.remove("dark");
          }
        }
      };

      mediaQuery.addEventListener("change", handleChange);

      // Start notification scheduling (if in production)
      if (process.env.NODE_ENV === "production") {
        notificationScheduler.startScheduling();
      }

      return () => {
        mediaQuery.removeEventListener("change", handleChange);
        notificationScheduler.stopScheduling();
      };
    }
  }, [initializeNotifications, theme, setTheme]);

  // This component doesn't render anything
  return null;
}
