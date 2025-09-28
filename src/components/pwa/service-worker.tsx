"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function ServiceWorkerProvider() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register(
            "/sw.js",
            {
              scope: "/",
            }
          );

          console.log("SW registered:", registration);

          // Listen for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (!newWorker) return;

            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // New version available
                showUpdateAvailable(registration);
              }
            });
          });

          // Check if there's a waiting service worker
          if (registration.waiting) {
            showUpdateAvailable(registration);
          }
        } catch (error) {
          console.error("SW registration failed:", error);
        }
      };

      registerSW();

      // Listen for messages from SW
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.type === "SW_UPDATE_AVAILABLE") {
          showUpdateAvailable();
        }
      });

      // Handle controller change (when new SW takes over)
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
      });
    }
  }, []);

  const showUpdateAvailable = (registration?: ServiceWorkerRegistration) => {
    toast.info("New version available!", {
      description: "Click to update and get the latest features.",
      action: {
        label: "Update",
        onClick: () => {
          if (registration?.waiting) {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
          } else {
            window.location.reload();
          }
        },
      },
      duration: 10000,
    });
  };

  // Also register for push notifications if user grants permission
  const requestNotificationPermission = async () => {
    if ("Notification" in window && navigator.serviceWorker) {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        // You could subscribe to push notifications here
        console.log("Notification permission granted");
        return true;
      }
    }
    return false;
  };

  // Expose notification request to global scope for other components to use
  useEffect(() => {
    (
      window as Window & {
        requestNotificationPermission?: typeof requestNotificationPermission;
      }
    ).requestNotificationPermission = requestNotificationPermission;
  }, []);

  return null; // This component doesn't render anything
}

// Hook for PWA functionality
export function usePWA() {
  const isStandalone =
    typeof window !== "undefined" &&
    (window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true);

  const isOnline = typeof window !== "undefined" && navigator.onLine;

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    return false;
  };

  const showNotification = (title: string, options?: NotificationOptions) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        icon: "/icon-192x192.png",
        badge: "/icon-72x72.png",
        ...options,
      });
    }
  };

  const shareContent = async (data: ShareData) => {
    if ("share" in navigator) {
      try {
        await navigator.share(data);
        return true;
      } catch (error) {
        console.error("Share failed:", error);
        return false;
      }
    }
    return false;
  };

  return {
    isStandalone,
    isOnline,
    requestNotificationPermission,
    showNotification,
    shareContent,
  };
}
