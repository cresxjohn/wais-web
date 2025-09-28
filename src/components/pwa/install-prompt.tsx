"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, Smartphone, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: ReadonlyArray<string>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (typeof window !== "undefined") {
      const isStandalone = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;
      const isInAppBrowser = window.navigator.standalone === true;

      if (isStandalone || isInAppBrowser) {
        setIsInstalled(true);
        return;
      }
    }

    // Listen for the install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);

      // Show the prompt after a delay (don't be too aggressive)
      setTimeout(() => {
        setIsVisible(true);
      }, 5000);
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      toast.success("WAIS has been installed successfully!");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;

      if (choice.outcome === "accepted") {
        setIsVisible(false);
        toast.success("Installing WAIS...");
      } else {
        toast.info("Installation cancelled");
      }
    } catch (error) {
      console.error("Installation error:", error);
      toast.error("Installation failed");
    } finally {
      setInstallPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Don't show again for this session
    sessionStorage.setItem("pwa-prompt-dismissed", "true");
  };

  // Don't show if already installed, not available, or dismissed
  if (isInstalled || !installPrompt || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Install WAIS
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-none"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  PWA
                </Badge>
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-white hover:bg-white/20 h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <CardDescription className="text-blue-100 mb-4">
            Get the full app experience with offline access, push notifications,
            and faster loading.
          </CardDescription>

          <div className="flex gap-2">
            <Button
              onClick={handleInstall}
              className="bg-white text-blue-600 hover:bg-gray-100 flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Install App
            </Button>
            <Button
              variant="ghost"
              onClick={handleDismiss}
              className="text-white hover:bg-white/20"
            >
              Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// PWA status indicator for development
export function PWAStatus() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Check installation status
    if (typeof window !== "undefined") {
      const isStandalone = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;
      const isInAppBrowser = window.navigator.standalone === true;
      setIsInstalled(isStandalone || isInAppBrowser);
      setIsOnline(navigator.onLine);
    }

    // Listen for online/offline changes
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      <Badge variant={isInstalled ? "default" : "secondary"}>
        <Smartphone className="h-3 w-3 mr-1" />
        {isInstalled ? "PWA Installed" : "PWA Available"}
      </Badge>
      <Badge variant={isOnline ? "default" : "destructive"}>
        {isOnline ? "Online" : "Offline"}
      </Badge>
    </div>
  );
}
