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
    bg: "bg-green-50",
    border: "border-green-200",
    icon: "text-green-600",
    title: "text-green-800",
    message: "text-green-700",
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    icon: "text-red-600",
    title: "text-red-800",
    message: "text-red-700",
  },
  warning: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    icon: "text-yellow-600",
    title: "text-yellow-800",
    message: "text-yellow-700",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "text-blue-600",
    title: "text-blue-800",
    message: "text-blue-700",
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
        ${styles.bg} ${styles.border}
        border rounded-xl shadow-lg p-4 max-w-md w-full
      `}
      >
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 ${styles.icon} flex-shrink-0 mt-0.5`} />
          <div className="flex-1 min-w-0">
            <p className={`font-semibold text-sm ${styles.title}`}>
              {toast.title}
            </p>
            {toast.message && (
              <p className={`text-sm ${styles.message} mt-1`}>
                {toast.message}
              </p>
            )}
          </div>
          <button
            onClick={handleRemove}
            className={`
              ${styles.icon} hover:opacity-70 transition-opacity
              p-1 rounded-full hover:bg-black/10
            `}
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
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-3">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
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
