// WAIS Application Configuration
export const config = {
  // API Endpoints
  graphqlEndpoint:
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",

  // Authentication
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",

  // PWA & Push Notifications
  vapidPublicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",

  // AI Services (Future integration)
  aiServiceUrl:
    process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:4000",

  // Philippines Banking APIs (Future integration)
  unionbankApiUrl:
    process.env.NEXT_PUBLIC_UNIONBANK_API_URL || "https://api.unionbank.com",
  bpiApiUrl: process.env.NEXT_PUBLIC_BPI_API_URL || "https://api.bpi.com.ph",

  // Feature Flags
  features: {
    aiFeatures: process.env.NEXT_PUBLIC_ENABLE_AI_FEATURES === "true",
    bankingIntegration:
      process.env.NEXT_PUBLIC_ENABLE_BANKING_INTEGRATION === "true",
    ocr: process.env.NEXT_PUBLIC_ENABLE_OCR === "true",
    gamification: process.env.NEXT_PUBLIC_ENABLE_GAMIFICATION === "true",
  },

  // App Metadata
  app: {
    name: "WAIS - AI-Powered Finance",
    version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
    description: "Your AI-powered partner for wais financial moves",
  },

  // Environment
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
};
