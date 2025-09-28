import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/lib/react-query-provider";
// import { ApolloGraphQLProvider } from "@/lib/apollo-provider"; // Temporarily disabled
import { Toaster } from "@/components/ui/sonner";
import { ServiceWorkerProvider } from "@/components/pwa/service-worker";
import { PWAInstallPrompt } from "@/components/pwa/install-prompt";
import { NotificationActions } from "@/components/notifications/notification-center";
import { AppInitializer } from "@/components/app-initializer";
import { config } from "@/lib/config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: config.app.name,
    template: `%s | ${config.app.name}`,
  },
  description: config.app.description,
  keywords: [
    "personal finance",
    "AI",
    "budgeting",
    "expense tracking",
    "Philippines",
    "fintech",
    "money management",
  ],
  authors: [
    {
      name: "WAIS Team",
    },
  ],
  creator: "WAIS Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://wais.ph",
    title: config.app.name,
    description: config.app.description,
    siteName: config.app.name,
  },
  twitter: {
    card: "summary_large_image",
    title: config.app.name,
    description: config.app.description,
    creator: "@wais_ph",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ReactQueryProvider>
          {/* <ApolloGraphQLProvider> */}
          <AppInitializer />
          <ServiceWorkerProvider />
          {children}
          <PWAInstallPrompt />
          <NotificationActions />
          <Toaster richColors position="top-right" />
          {/* </ApolloGraphQLProvider> */}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
