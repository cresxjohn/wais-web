"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaApple } from "react-icons/fa";
import Link from "next/link";

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const [formData, setFormData] = useState<SignupForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.error || "Failed to create account");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof SignupForm, value: string) => {
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
          {/* Create Account Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-normal text-gray-900 mb-4">
              Create your account
            </h1>
            <div className="text-base text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-gray-900 underline hover:no-underline"
              >
                Log in
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="text-sm text-red-600 text-center">{error}</div>
            )}

            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Your full name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-4 py-4 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

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
                Create a password
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

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Confirm your password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="space-y-2">
                <div className="text-xs text-gray-600">Password strength:</div>
                <div className="flex gap-1">
                  <div
                    className={`h-1 flex-1 rounded ${
                      formData.password.length >= 6
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`h-1 flex-1 rounded ${
                      formData.password.length >= 8
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`h-1 flex-1 rounded ${
                      formData.password.length >= 10 &&
                      /[A-Z]/.test(formData.password)
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  ></div>
                </div>
              </div>
            )}

            {/* Terms Agreement */}
            <div className="text-xs text-gray-600">
              By creating an account, you agree to our{" "}
              <Link
                href="/terms"
                className="text-gray-900 underline hover:no-underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-gray-900 underline hover:no-underline"
              >
                Privacy Policy
              </Link>
              .
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full !p-5 rounded-md font-medium text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed walz-button-primary text-white"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Divider */}
          <div className="text-center text-sm text-gray-600 my-8">
            Or sign up with
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
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pb-8">
          <p className="text-xs text-gray-500">© Walz Payments Limited 2025</p>
        </div>
      </div>
    </div>
  );
}
