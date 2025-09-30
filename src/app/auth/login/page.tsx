"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { Eye, EyeOff, Key } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaApple } from "react-icons/fa";
import Link from "next/link";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn(formData);
      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.error || "Failed to sign in");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signInWithGoogle();
      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.error || "Failed to sign in with Google");
      }
    } catch {
      setError("An unexpected error occurred with Google sign-in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with logo and close button */}
      <div className="flex items-center justify-between p-6">
        <img src="/walz-logo.png" alt="Walz" className="h-8" />
        <Link
          href="/"
          className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors text-2xl"
        >
          ×
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-4 pb-8">
        <div className="w-full max-w-md">
          {/* Welcome Back Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-normal text-gray-900 mb-4">
              Welcome back.
            </h1>
            <div className="text-base text-gray-600">
              New to Walz?{" "}
              <Link
                href="/auth/signup"
                className="text-gray-900 underline hover:no-underline"
              >
                Sign up
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="text-sm text-red-600 text-center">{error}</div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Your email address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Your password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full !p-5 rounded-md font-medium text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed walz-button-primary text-white"
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </form>

          {/* Trouble Logging In Link */}
          <div className="text-center mt-6">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-gray-900 underline hover:no-underline"
            >
              Trouble logging in?
            </Link>
          </div>

          {/* Divider */}
          <div className="text-center text-sm text-gray-600 my-8">
            Or log in with
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="flex items-center justify-center py-4 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <FcGoogle className="w-6 h-6" />
            </button>

            <button
              type="button"
              className="flex items-center justify-center py-4 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="w-6 h-6 bg-blue-600 rounded-sm flex items-center justify-center">
                <FaFacebookF className="w-4 h-4 text-white" />
              </div>
            </button>

            <button
              type="button"
              className="flex items-center justify-center py-4 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <FaApple className="w-6 h-6 text-black" />
            </button>
          </div>

          {/* Passkey Login */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 py-4 px-4 text-sm text-gray-900 hover:bg-gray-50 rounded-md transition-colors border border-gray-200"
          >
            <Key className="w-4 h-4" />
            Log in with a passkey
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pb-8">
          <p className="text-xs text-gray-500">© Walz Payments Limited 2025</p>
        </div>
      </div>
    </div>
  );
}
