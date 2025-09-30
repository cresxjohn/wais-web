"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Book, HelpCircle, Mail, MessageCircle, Phone } from "lucide-react";

export default function HelpPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-gray-600 mt-1">
            Get help with walz or contact our support team
          </p>
        </div>

        {/* Quick Help */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="walz-card p-6 text-center">
            <div className="p-3 bg-blue-50 rounded-lg w-fit mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600 mb-4">
              Chat with our support team in real-time
            </p>
            <button className="text-blue-600 font-medium text-sm hover:underline">
              Start Chat
            </button>
          </div>

          <div className="walz-card p-6 text-center">
            <div className="p-3 bg-green-50 rounded-lg w-fit mx-auto mb-4">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-sm text-gray-600 mb-4">
              Send us an email and we'll respond within 24 hours
            </p>
            <button className="text-green-600 font-medium text-sm hover:underline">
              Send Email
            </button>
          </div>

          <div className="walz-card p-6 text-center">
            <div className="p-3 bg-purple-50 rounded-lg w-fit mx-auto mb-4">
              <Phone className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
            <p className="text-sm text-gray-600 mb-4">
              Call us during business hours for immediate help
            </p>
            <button className="text-purple-600 font-medium text-sm hover:underline">
              Call Now
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="walz-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <HelpCircle className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-medium text-gray-900 mb-2">
                How do I connect my bank account?
              </h3>
              <p className="text-sm text-gray-600">
                You can connect your bank account by going to Accounts → Add
                Account and following the secure connection process.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-medium text-gray-900 mb-2">
                Is my financial data secure?
              </h3>
              <p className="text-sm text-gray-600">
                Yes, we use bank-level encryption and never store your banking
                credentials. All data is encrypted and securely stored.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-medium text-gray-900 mb-2">
                How do I set up budget categories?
              </h3>
              <p className="text-sm text-gray-600">
                Navigate to Tools → Budget and click "Add Category" to create
                custom spending categories with limits.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-medium text-gray-900 mb-2">
                What happens if I exceed my budget?
              </h3>
              <p className="text-sm text-gray-600">
                You'll receive notifications when you're approaching or
                exceeding budget limits. The app will suggest ways to get back
                on track.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                How accurate are the AI insights?
              </h3>
              <p className="text-sm text-gray-600">
                Our AI analyzes your spending patterns and provides insights
                based on your transaction history. Accuracy improves over time
                as more data is analyzed.
              </p>
            </div>
          </div>
        </div>

        {/* Resources */}
        <div className="walz-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-50 rounded-lg">
              <Book className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Resources</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Book className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">User Guide</p>
                <p className="text-sm text-gray-500">
                  Complete guide to using walz
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <HelpCircle className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Video Tutorials</p>
                <p className="text-sm text-gray-500">
                  Learn with step-by-step videos
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MessageCircle className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Community Forum</p>
                <p className="text-sm text-gray-500">
                  Connect with other users
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Release Notes</p>
                <p className="text-sm text-gray-500">See what's new in walz</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
