"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogIn,
  Mail,
  Lock,
  Key,
  ArrowRight,
  Eye,
  EyeOff,
  Shield,
  Sparkles,
  User,
  Home,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  X
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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showToast("Please enter email and password", 'error');
      return;
    }

    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      showToast(error.message, 'error');
      return;
    }

    if (!data.user) {
      showToast("No user found with these credentials", 'error');
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profile?.role === "admin") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/seller";
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      showToast("Please enter your registered email", 'error');
      return;
    }

    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    setLoading(false);

    if (error) {
      showToast(error.message, 'error');
    } else {
      setMessage(
        "If this email is registered, a password reset link has been sent."
      );
      showToast("Password reset link sent to your email", 'success');
    }
  };

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
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
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

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Column - Brand/Info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block"
        >
          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Et.Shoes
                </h1>
                <p className="text-gray-600">Direct Seller Marketplace</p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                Welcome Back to<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Your Dashboard
                </span>
              </h2>
              
              <p className="text-lg text-gray-600 max-w-md">
                Sign in to manage your seller offers or access admin tools. 
                Connect directly with buyers and grow your business.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Secure Access</p>
                    <p className="text-sm text-gray-500">Protected by encryption</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Role-based Access</p>
                    <p className="text-sm text-gray-500">Admin or Seller dashboard</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Instant Access</p>
                    <p className="text-sm text-gray-500">No waiting time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Login Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={resetMode ? "reset" : "login"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="rounded-2xl border-0 shadow-2xl overflow-hidden bg-white/90 backdrop-blur-sm">
                {/* Form Header */}
                <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-xl ${resetMode ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-blue-600 to-purple-600'} flex items-center justify-center shadow-md`}>
                        {resetMode ? (
                          <Key className="w-6 h-6 text-white" />
                        ) : (
                          <LogIn className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                          {resetMode ? "Reset Password" : "Welcome Back"}
                        </h1>
                        <p className="text-gray-600">
                          {resetMode 
                            ? "Enter your email to reset password"
                            : "Sign in to your account"
                          }
                        </p>
                      </div>
                    </div>
                    
                    {resetMode && (
                      <button
                        onClick={() => {
                          setResetMode(false);
                          setMessage("");
                        }}
                        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back
                      </button>
                    )}
                  </div>
                </div>

                {/* Form Content */}
                <div className="p-8 space-y-6">
                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <Mail className="inline w-4 h-4 mr-2 text-blue-500" />
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        placeholder="you@example.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 py-3 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Input (Login Mode Only) */}
                  {!resetMode && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        <Lock className="inline w-4 h-4 mr-2 text-blue-500" />
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          placeholder="Enter your password"
                          type={showPassword ? "text" : "password"}
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
                      
                      <div className="flex justify-end">
                        <button
                          onClick={() => {
                            setResetMode(true);
                            setMessage("");
                          }}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                          Forgot Password?
                        </button>
                      </div>
                    </div>
                  )}

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

                  {/* Submit Button */}
                  <Button
                    onClick={resetMode ? handleResetPassword : handleLogin}
                    disabled={loading || (!resetMode && (!email || !password)) || (resetMode && !email)}
                    className={`w-full py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 ${
                      resetMode
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    } text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </div>
                    ) : resetMode ? (
                      <>
                        <Key className="w-5 h-5 mr-2" />
                        Send Reset Link
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5 mr-2" />
                        Sign In
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>

                  {/* Mode Toggle */}
                  {resetMode && (
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-center text-gray-600">
                        Remember your password?{" "}
                        <button
                          onClick={() => {
                            setResetMode(false);
                            setMessage("");
                          }}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Back to Login
                        </button>
                      </p>
                    </div>
                  )}

                  {/* Register Link */}
                  {!resetMode && (
                    <div className="pt-6 border-t border-gray-100">
                      <div className="text-center">
                        <p className="text-gray-600 mb-3">New to Et.Shoes?</p>
                        <Link href="/auth/register">
                          <Button
                            variant="outline"
                            className="w-full border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700"
                          >
                            <User className="w-5 h-5 mr-2" />
                            Create Seller Account
                          </Button>
                        </Link>
                        <p className="text-xs text-gray-500 mt-3">
                          By signing in, you agree to our Terms & Privacy Policy
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Form Footer */}
                <div className="px-8 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                  <div className="flex items-center justify-center text-sm text-gray-500">
                    <Shield className="w-4 h-4 mr-2" />
                    <span>Your data is securely encrypted</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Mobile Branding */}
          <div className="mt-8 text-center lg:hidden">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Et.Shoes
                </h1>
                <p className="text-sm text-gray-600">Direct Seller Marketplace</p>
              </div>
            </div>
            
            <p className="text-gray-600">
              Connect directly with buyers. No middlemen, no commissions.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}