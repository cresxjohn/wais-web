import { AuthRedirect } from "@/components/auth/auth-redirect";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle,
  Shield,
  Smartphone,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

// This page is now statically generated for better performance
export default function HomePage() {
  return (
    <>
      <AuthRedirect />
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <img
                  src="/walz-logo.png"
                  alt="walz logo"
                  className="h-8 rounded-lg"
                />
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Sign In
                </Link>
                <Button size="sm">
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Your AI-powered partner for{" "}
              <span className="walz-gradient-primary bg-clip-text text-transparent">
                walz
              </span>{" "}
              financial moves
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Take control of your finances with intelligent tracking, AI-driven
              insights, and seamless integration with Philippine banks and
              e-wallets.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mb-10 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Bank-level security</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>BSP & NPC compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-600" />
                <span>Trusted by 10,000+ Filipinos</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-green-600" />
                <span>4.9/5 rating</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-4">
                <Link href="/auth/signup" className="flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="text-lg px-8 py-4"
              >
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            <div className="walz-card p-8 text-center hover:shadow-lg transition-all">
              <div className="w-16 h-16 walz-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                AI-Powered Insights
              </h3>
              <p className="text-gray-600">
                Get personalized financial advice, spending patterns, and smart
                recommendations to optimize your money
              </p>
            </div>

            <div className="walz-card p-8 text-center hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Bank-Level Security
              </h3>
              <p className="text-gray-600">
                256-bit encryption, multi-factor authentication, and regulatory
                compliance keep your financial data safe
              </p>
            </div>

            <div className="walz-card p-8 text-center hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Philippines-First
              </h3>
              <p className="text-gray-600">
                Native integrations with BPI, Metrobank, UnionBank, GCash,
                PayMaya, and 50+ local financial institutions
              </p>
            </div>

            <div className="walz-card p-8 text-center hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Real-Time Tracking
              </h3>
              <p className="text-gray-600">
                Instant notifications, automatic categorization, and live
                balance updates across all your accounts
              </p>
            </div>
          </div>

          {/* Additional Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="text-center p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Smart Budgeting
              </h4>
              <p className="text-gray-600">
                AI suggests budget allocations based on your income, spending
                habits, and financial goals
              </p>
            </div>
            <div className="text-center p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Credit Monitoring
              </h4>
              <p className="text-gray-600">
                Track your credit score with TransUnion and get alerts on
                changes to your credit report
              </p>
            </div>
            <div className="text-center p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Bill Reminders
              </h4>
              <p className="text-gray-600">
                Never miss a payment with smart reminders and automated bill
                tracking
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="walz-gradient-insights rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="flex flex-col items-center relative z-10">
              <h2 className="text-4xl font-bold mb-6">
                Ready to take control of your finances?
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Join thousands of Filipinos already using Walz to build better
                financial habits
              </p>
              <Button
                size="lg"
                className="text-lg px-8 py-4 bg-white hover:bg-gray-100 text-blue-600"
              >
                <Link href="/auth/signup" className="flex items-center gap-2">
                  Start Your Financial Journey
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
            <div className="absolute -right-20 -bottom-20 opacity-10">
              <TrendingUp className="w-80 h-80" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <img
                  src="/walz-logo.png"
                  alt="walz logo"
                  className="h-8 rounded-lg"
                />
              </div>
              <p className="text-gray-600 mb-6">
                Your AI-powered partner for wise financial moves
              </p>
              <div className="flex justify-center gap-8 text-sm text-gray-500">
                <Link href="/privacy" className="hover:text-gray-900">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-gray-900">
                  Terms of Service
                </Link>
                <Link href="/support" className="hover:text-gray-900">
                  Support
                </Link>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  © 2025 Walz. All rights reserved. Built with ❤️ for Filipinos.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
