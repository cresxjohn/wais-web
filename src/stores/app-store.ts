import { initializeSampleNotifications } from "@/services/notification-initializer";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Notification {
  id: string;
  type:
    | "info"
    | "success"
    | "warning"
    | "error"
    | "payment"
    | "reminder"
    | "budget"
    | "account";
  title: string;
  message?: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

interface AppState {
  sidebarOpen: boolean;
  currentPage: string;
  theme: "light" | "dark" | "system";
  notifications: Notification[];
  loading: Record<string, boolean>;
}

interface AppActions {
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setCurrentPage: (page: string) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "read"> | Notification
  ) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  removeNotification: (id: string) => void; // Legacy - alias for deleteNotification
  clearAllNotifications: () => void;
  initializeNotifications: () => void;
  setLoading: (key: string, loading: boolean) => void;
  clearLoading: (key: string) => void;
}

export type AppStore = AppState & AppActions;

const initialState: AppState = {
  sidebarOpen: false,
  currentPage: "dashboard",
  theme: "system",
  notifications: [],
  loading: {},
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setSidebarOpen: (sidebarOpen) => {
        set({ sidebarOpen });
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setCurrentPage: (currentPage) => {
        set({ currentPage });
      },

      setTheme: (theme) => {
        set({ theme });

        // Apply theme to document
        if (typeof window !== "undefined") {
          const root = window.document.documentElement;

          if (theme === "dark") {
            root.classList.add("dark");
          } else if (theme === "light") {
            root.classList.remove("dark");
          } else {
            // System preference
            const systemTheme = window.matchMedia(
              "(prefers-color-scheme: dark)"
            ).matches
              ? "dark"
              : "light";
            if (systemTheme === "dark") {
              root.classList.add("dark");
            } else {
              root.classList.remove("dark");
            }
          }
        }
      },

      addNotification: (notificationData) => {
        // Check if it's already a complete notification or needs to be created
        const notification: Notification =
          "id" in notificationData && "timestamp" in notificationData
            ? (notificationData as Notification)
            : {
                ...notificationData,
                id: Math.random().toString(36).substring(7),
                timestamp: new Date().toISOString(),
                read: false,
              };

        set((state) => ({
          notifications: [notification, ...state.notifications].slice(0, 100), // Keep only last 100 notifications
        }));
      },

      markNotificationAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      markAllNotificationsAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },

      deleteNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      removeNotification: (id) => {
        // Legacy method - alias for deleteNotification
        get().deleteNotification(id);
      },

      clearAllNotifications: () => {
        set({ notifications: [] });
      },

      initializeNotifications: () => {
        const currentNotifications = get().notifications;

        // Only initialize if no notifications exist
        if (currentNotifications.length === 0) {
          const sampleNotifications = initializeSampleNotifications();
          set({ notifications: sampleNotifications });
        }
      },

      setLoading: (key, loading) => {
        set((state) => ({
          loading: { ...state.loading, [key]: loading },
        }));
      },

      clearLoading: (key) => {
        set((state) => {
          const { [key]: _, ...rest } = state.loading;
          return { loading: rest };
        });
      },
    }),
    {
      name: "wais-app-store",
      partialize: (state) => ({
        theme: state.theme,
        notifications: state.notifications,
      }),
    }
  )
);
