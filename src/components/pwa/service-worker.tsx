"use client";

import { useEffect } from "react";

export function ServiceWorkerProvider() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js");

          // Check for updates periodically
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  // New content is available; please refresh
                  if (
                    confirm("New app version available! Refresh to update?")
                  ) {
                    window.location.reload();
                  }
                }
              });
            }
          });

          console.log("Service Worker registered successfully");
        } catch (error) {
          console.error("Service Worker registration failed:", error);
        }
      };

      registerSW();
    }
  }, []);

  return null;
}
