"use client";

import React, {
  ReactNode,
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastStyles = {
  success: {
    bg: "bg-gradient-to-r from-emerald-500 to-emerald-600",
    icon: "text-white",
    title: "text-white",
    message: "text-emerald-50",
  },
  error: {
    bg: "bg-gradient-to-r from-rose-500 to-rose-600",
    icon: "text-white",
    title: "text-white",
    message: "text-rose-50",
  },
  warning: {
    bg: "bg-gradient-to-r from-orange-500 to-orange-600",
    icon: "text-white",
    title: "text-white",
    message: "text-orange-50",
  },
  info: {
    bg: "bg-gradient-to-r from-blue-500 to-blue-600",
    icon: "text-white",
    title: "text-white",
    message: "text-blue-50",
  },
};

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [isExiting, setIsExiting] = React.useState(false);
  const Icon = toastIcons[toast.type];
  const styles = toastStyles[toast.type];

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 200); // Match the exit animation duration
  };

  return (
    <div className={isExiting ? "toast-exit" : "toast-enter"}>
      <div
        className={`
        ${styles.bg}
        rounded-xl shadow-xl p-5 max-w-md w-full backdrop-blur-sm
      `}
      >
        <div className="flex items-start gap-3">
          <Icon className={`w-6 h-6 ${styles.icon} flex-shrink-0`} />
          <div className="flex-1 min-w-0">
            <p className={`font-semibold text-base ${styles.title}`}>
              {toast.title}
            </p>
            {toast.message && (
              <p className={`text-sm ${styles.message} mt-1 leading-relaxed`}>
                {toast.message}
              </p>
            )}
          </div>
          <button
            onClick={handleRemove}
            className="text-white/80 hover:text-white hover:bg-white/20 transition-all p-1 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ToastContainer() {
  const { toasts, removeToast } = useToast();
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof window === "undefined") {
    return null;
  }

  if (toasts.length === 0) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-x-0 top-6 z-50 flex flex-col items-center space-y-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onRemove={removeToast} />
        </div>
      ))}
    </div>,
    document.body
  );
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto-remove toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Set up global toast access for services
  React.useEffect(() => {
    const { setGlobalToast } = require("@/services/notification-service");
    const toastActions = {
      success: (title: string, message?: string, duration?: number) =>
        addToast({ type: "success", title, message, duration }),
      error: (title: string, message?: string, duration?: number) =>
        addToast({ type: "error", title, message, duration }),
      warning: (title: string, message?: string, duration?: number) =>
        addToast({ type: "warning", title, message, duration }),
      info: (title: string, message?: string, duration?: number) =>
        addToast({ type: "info", title, message, duration }),
    };
    setGlobalToast(toastActions);
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

// Convenience functions for different toast types
export function useToastActions() {
  const { addToast } = useToast();

  return {
    success: (title: string, message?: string, duration?: number) =>
      addToast({ type: "success", title, message, duration }),

    error: (title: string, message?: string, duration?: number) =>
      addToast({ type: "error", title, message, duration }),

    warning: (title: string, message?: string, duration?: number) =>
      addToast({ type: "warning", title, message, duration }),

    info: (title: string, message?: string, duration?: number) =>
      addToast({ type: "info", title, message, duration }),
  };
}
