"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Shield,
  Key,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  X,
  Home,
  Sparkles,
  Loader2
} from "lucide-react";
import Link from "next/link";

// Toast Notification Component
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ type: "spring", damping: 25 }}
      className={`fixed top-6 right-6 z-50 min-w-[320px] rounded-xl shadow-2xl border ${
        type === 'success' 
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
          : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
            type === 'success' ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
          </div>
          <div className="flex-1">
            <p className={`font-semibold ${type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
              {type === 'success' ? 'Success!' : 'Error!'}
            </p>
            <p className={`text-sm ${type === 'success' ? 'text-green-700' : 'text-red-700'} mt-1`}>
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`ml-4 p-1 rounded-full hover:bg-white/50 transition-colors ${
              type === 'success' ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      {/* Progress bar */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 5, ease: "linear" }}
        className={`h-1 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} rounded-b-xl origin-left`}
        onAnimationComplete={onClose}
      />
    </motion.div>
  );
};

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Check if user is logged in (magic link auto-login)
  const [userReady, setUserReady] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) setUserReady(true);
      else setUserReady(false);
      setCheckingSession(false);
    });
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      showToast("Please fill in all fields", 'error');
      return;
    }
    
    if (password !== confirmPassword) {
      showToast("Passwords do not match", 'error');
      return;
    }

    if (password.length < 6) {
      showToast("Password must be at least 6 characters long", 'error');
      return;
    }

    setLoading(true);
    setMessage("");

    // Use updateUser without accessToken
    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      showToast(error.message, 'error');
    } else {
      setMessage("✅ Password reset successfully! Redirecting to login...");
      showToast("Password reset successfully! Redirecting to login...", 'success');
      setTimeout(() => router.push("/auth/login?reset=success"), 2000);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Verifying your session...</p>
        </div>
      </div>
    );
  }

  if (!userReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        {/* Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
        </div>

        {/* Home Navigation */}
        <Link
          href="/"
          className="fixed top-6 left-6 flex items-center text-gray-700 hover:text-gray-900 transition-colors group"
        >
          <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="rounded-2xl border-0 shadow-2xl overflow-hidden bg-white/90 backdrop-blur-sm">
            <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
                  <Key className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900">Link Required</h1>
                  <p className="text-gray-600">Please use the reset link from your email</p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <Key className="w-10 h-10 text-gray-400" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Password Reset Link Required
                </h3>
                <p className="text-gray-600 mb-6">
                  Please open the password reset link sent to your registered email address. 
                  This link will automatically log you in to reset your password.
                </p>
              </div>

              <div className="space-y-3">
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 hover:border-gray-400"
                  >
                    Back to Login
                  </Button>
                </Link>
                
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    If you didn't receive the email, check your spam folder or request a new reset link.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-8 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
              <div className="flex items-center justify-center text-sm text-gray-500">
                <Shield className="w-4 h-4 mr-2" />
                <span>Secure password reset process</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-200 rounded-full opacity-10 blur-3xl"></div>
      </div>

      {/* Home Navigation */}
      <Link
        href="/"
        className="fixed top-6 left-6 flex items-center text-gray-700 hover:text-gray-900 transition-colors group"
      >
        <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
        <span className="font-medium">Back to Home</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="rounded-2xl border-0 shadow-2xl overflow-hidden bg-white/90 backdrop-blur-sm">
          {/* Form Header */}
          <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-md">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
                  <p className="text-gray-600">Create a new secure password</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8 space-y-6">
            {/* Success Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200"
              >
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                  <p className="text-green-700">{message}</p>
                </div>
              </motion.div>
            )}

            {/* New Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <Lock className="inline w-4 h-4 mr-2 text-blue-500" />
                New Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 py-3 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Must be at least 6 characters long
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <Lock className="inline w-4 h-4 mr-2 text-green-500" />
                Confirm New Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 py-3 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
            {password.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Password Strength</span>
                  <span className={`text-sm font-medium ${
                    password.length >= 8 ? 'text-green-600' :
                    password.length >= 6 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {password.length >= 8 ? 'Strong' : password.length >= 6 ? 'Medium' : 'Weak'}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      password.length >= 8 ? 'bg-green-500' :
                      password.length >= 6 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(password.length * 10, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Requirements */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Password Requirements</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li className="flex items-center">
                  {password.length >= 6 ? (
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-gray-300 mr-2 flex-shrink-0"></div>
                  )}
                  <span>At least 6 characters long</span>
                </li>
                <li className="flex items-center">
                  {password === confirmPassword && password.length > 0 ? (
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-gray-300 mr-2 flex-shrink-0"></div>
                  )}
                  <span>Passwords must match</span>
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleReset}
              disabled={loading || !password || !confirmPassword}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Resetting Password...
                </div>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Reset Password
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            {/* Back to Login */}
            <div className="pt-4 border-t border-gray-100 text-center">
              <p className="text-gray-600">
                Remember your password?{" "}
                <Link
                  href="/auth/login"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Back to Login
                </Link>
              </p>
            </div>
          </div>

          {/* Form Footer */}
          <div className="px-8 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Shield className="w-4 h-4 mr-2" />
              <span>Your new password is securely encrypted</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}