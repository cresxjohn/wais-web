// Layout Components
export { MainLayout } from "./layout/main-layout";
export { Sidebar } from "./layout/sidebar/sidebar";
export { Header } from "./layout/header";
export {
  SidebarItem,
  SidebarItemWithBadge,
  CollapsibleSidebarItem,
  SidebarSubItem,
} from "./layout/sidebar/sidebar-item";

// Dashboard Components
export { AccountCard, AddAccountCard } from "./dashboard/account-card";
export { PaymentItem } from "./dashboard/payment-item";
export { GoalCard } from "./dashboard/goal-card";
export { BudgetCategory } from "./dashboard/budget-category";
export { GradientActionCard } from "./dashboard/action-card";
export { AiInsightsCard } from "./dashboard/ai-insights-card";
export { AccountCarousel } from "./dashboard/account-carousel";
export { BudgetOverview } from "./dashboard/budget-overview";

// UI Components
export { Button } from "./ui/button";
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
export { ToastProvider, useToast, useToastActions } from "./ui/toast";

// PWA Components
export { ServiceWorkerProvider } from "./pwa/service-worker";
export { PWAInstallPrompt } from "./pwa/install-prompt";

// Auth Components
export { AuthLayout } from "./auth/auth-layout";
