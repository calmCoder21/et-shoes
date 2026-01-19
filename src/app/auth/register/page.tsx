"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  Mail,
  Lock,
  Phone,
  MessageCircle,
  MapPin,
  Building,
  Home,
  Shield,
  CheckCircle,
  AlertCircle,
  X,
  ArrowRight,
  Sparkles,
  User,
  Eye,
  EyeOff,
  Store,
  Navigation,
  Check
} from "lucide-react";
import Link from "next/link";

// Toast Notification Component (unchanged)
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

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    shop_name: "",
    phone: "",
    whatsapp: "",
    city: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleRegister = async () => {
    // Validate required fields
    const requiredFields = ['email', 'password', 'shop_name', 'phone', 'whatsapp', 'city', 'address'];
    const missingField = requiredFields.find(field => !form[field as keyof typeof form]);
    
    if (missingField) {
      showToast(`Please fill in ${missingField.replace('_', ' ')}`, 'error');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    // Validate password length
    if (form.password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    // Check if user agreed to terms
    if (!agreedToTerms) {
      showToast('You must agree to the Terms of Service and Privacy Policy', 'error');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (error || !data.user) {
        showToast(error?.message || 'Registration failed. Please try again.', 'error');
        setLoading(false);
        return;
      }

      const userId = data.user.id;

      // Create profile
      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        role: "seller",
      });

      if (profileError) {
        showToast('Error creating profile: ' + profileError.message, 'error');
        setLoading(false);
        return;
      }

      // Create seller record
      const { error: sellerError } = await supabase.from("sellers").insert({
        id: userId,
        shop_name: form.shop_name,
        phone: form.phone,
        whatsapp: form.whatsapp,
        city: form.city,
        address: form.address,
      });

      if (sellerError) {
        showToast('Error creating seller account: ' + sellerError.message, 'error');
        setLoading(false);
        return;
      }

      // Success
      showToast('Registration successful! Please wait for admin approval.', 'success');
      
      // Reset form
      setForm({
        email: "",
        password: "",
        shop_name: "",
        phone: "",
        whatsapp: "",
        city: "",
        address: "",
      });
      setAgreedToTerms(false);

      // Redirect to login after a delay
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 3000);

    } catch (error: any) {
      showToast('An unexpected error occurred: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 md:p-6">
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
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-pink-200 rounded-full opacity-10 blur-3xl"></div>
      </div>

      {/* Home Navigation - Improved for mobile */}
      <Link
        href="/"
        className="fixed top-4 left-4 md:top-6 md:left-6 flex items-center text-gray-700 hover:text-gray-900 transition-colors group z-40 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm"
      >
        <Home className="w-4 h-4 md:w-5 md:h-5 mr-2 group-hover:scale-110 transition-transform" />
        <span className="font-medium text-sm md:text-base">Back to Home</span>
      </Link>

      {/* Mobile Layout - Stacked vertically */}
      <div className="w-full max-w-6xl lg:hidden">
        {/* TOP SECTION - "Start Selling on Et.Shoes Today..." */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                <Store className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Et.Shoes
                </h1>
                <p className="text-gray-600">Direct Seller Marketplace</p>
              </div>
            </div>
            
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
                Start Selling on{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Et.Shoes Today
                </span>
              </h2>
              
              <p className="text-lg text-gray-600">
                Join our verified seller community. Connect directly with buyers, 
                manage your offers with zero commission fees, and grow your business.
              </p>
            </div>
          </div>
        </motion.div>

        {/* MIDDLE SECTION - Registration Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="rounded-2xl border-0 shadow-xl overflow-hidden bg-white/90 backdrop-blur-sm">
            {/* Form Header */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-md">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Seller Registration
                  </h1>
                  <p className="text-gray-600">
                    Create your seller account in minutes
                  </p>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                {/* Shop Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Building className="inline w-4 h-4 mr-2 text-blue-500" />
                    Shop Name *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      name="shop_name"
                      placeholder="Your shop name"
                      value={form.shop_name}
                      onChange={handleChange}
                      className="pl-10 py-3 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Mail className="inline w-4 h-4 mr-2 text-blue-500" />
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      name="email"
                      placeholder="you@example.com"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className="pl-10 py-3 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Lock className="inline w-4 h-4 mr-2 text-blue-500" />
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      name="password"
                      placeholder="At least 6 characters"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
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
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Phone className="inline w-4 h-4 mr-2 text-green-500" />
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      name="phone"
                      placeholder="0912345678"
                      value={form.phone}
                      onChange={handleChange}
                      className="pl-10 py-3 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <MessageCircle className="inline w-4 h-4 mr-2 text-green-500" />
                    WhatsApp Number *
                  </label>
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      name="whatsapp"
                      placeholder="0912345678"
                      value={form.whatsapp}
                      onChange={handleChange}
                      className="pl-10 py-3 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* City */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <MapPin className="inline w-4 h-4 mr-2 text-purple-500" />
                    City *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      name="city"
                      placeholder="Your city"
                      value={form.city}
                      onChange={handleChange}
                      className="pl-10 py-3 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Address - Full width */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    <Home className="inline w-4 h-4 mr-2 text-amber-500" />
                    Full Address *
                  </label>
                  <div className="relative">
                    <Home className="absolute left-3 top-4 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <textarea
                      name="address"
                      placeholder="Enter your complete address"
                      value={form.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                <div className="flex items-start">
                  <button
                    type="button"
                    onClick={() => setAgreedToTerms(!agreedToTerms)}
                    className={`w-5 h-5 rounded border flex items-center justify-center mt-0.5 mr-3 flex-shrink-0 transition-all duration-200 ${
                      agreedToTerms
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500'
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                  >
                    {agreedToTerms && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </button>
                  <div>
                    <p className="text-sm text-gray-700">
                      By registering, you agree to our{" "}
                      <Link
                        href="/terms"
                        className="text-blue-600 hover:text-blue-700 font-medium underline"
                        target="_blank"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-blue-600 hover:text-blue-700 font-medium underline"
                        target="_blank"
                      >
                        Privacy Policy
                      </Link>
                      . Your account will be reviewed by our admin team within 24-48 hours.
                    </p>
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <Shield className="w-4 h-4 mr-2" />
                      <span>Your data is protected and will never be shared with third parties.</span>
                    </div>
                    {!agreedToTerms && (
                      <p className="text-sm text-red-600 mt-2 font-medium">
                        ✓ You must agree to the Terms and Privacy Policy to register
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleRegister}
                disabled={loading || !agreedToTerms}
                className="w-full mt-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Register as Seller
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              {/* Login Link */}
              <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>

            {/* Form Footer */}
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
              <div className="flex items-center justify-center text-sm text-gray-500">
                <Shield className="w-4 h-4 mr-2" />
                <span>Secure registration • 0% commission • Direct buyer contact</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* BOTTOM SECTION - Benefits/Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center text-gray-900">
              Why Join Et.Shoes?
            </h3>
            
            <div className="space-y-4">
              {/* Benefit 1 */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 shadow-sm">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center mb-4">
                    <Shield className="w-7 h-7 text-green-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-xl mb-2">
                    Verified Seller Program
                  </h4>
                  <p className="text-gray-600">
                    Build trust with buyers through our verification system
                  </p>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100 shadow-sm">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center mb-4">
                    <Navigation className="w-7 h-7 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-xl mb-2">
                    Direct Buyer Contact
                  </h4>
                  <p className="text-gray-600">
                    No middlemen, no commissions - connect directly with customers
                  </p>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 shadow-sm">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center mb-4">
                    <Sparkles className="w-7 h-7 text-purple-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-xl mb-2">
                    Real-time Management
                  </h4>
                  <p className="text-gray-600">
                    Update offers, prices, and inventory anytime from your dashboard
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Desktop Layout - Side by side (original layout) */}
      <div className="hidden lg:block w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Brand/Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                  <Store className="w-7 h-7 text-white" />
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
                  Start Selling on<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    Et.Shoes Today
                  </span>
                </h2>
                
                <p className="text-lg text-gray-600 max-w-md">
                  Join our verified seller community. Connect directly with buyers, 
                  manage your offers with zero commission fees, and grow your business.
                </p>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Verified Seller Program</p>
                      <p className="text-sm text-gray-500">Build trust with buyers</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                      <Navigation className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Direct Buyer Contact</p>
                      <p className="text-sm text-gray-500">No middlemen, no commissions</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Real-time Management</p>
                      <p className="text-sm text-gray-500">Update offers anytime</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Registration Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="rounded-2xl border-0 shadow-2xl overflow-hidden bg-white/90 backdrop-blur-sm">
              {/* Form Header */}
              <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-md">
                    <UserPlus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Seller Registration
                    </h1>
                    <p className="text-gray-600">
                      Create your seller account in minutes
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Shop Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <Building className="inline w-4 h-4 mr-2 text-blue-500" />
                      Shop Name *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        name="shop_name"
                        placeholder="Your shop name"
                        value={form.shop_name}
                        onChange={handleChange}
                        className="pl-10 py-3 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <Mail className="inline w-4 h-4 mr-2 text-blue-500" />
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        name="email"
                        placeholder="you@example.com"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        className="pl-10 py-3 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <Lock className="inline w-4 h-4 mr-2 text-blue-500" />
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        name="password"
                        placeholder="At least 6 characters"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
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
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <Phone className="inline w-4 h-4 mr-2 text-green-500" />
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        name="phone"
                        placeholder="0912345678"
                        value={form.phone}
                        onChange={handleChange}
                        className="pl-10 py-3 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <MessageCircle className="inline w-4 h-4 mr-2 text-green-500" />
                      WhatsApp Number *
                    </label>
                    <div className="relative">
                      <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        name="whatsapp"
                        placeholder="0912345678"
                        value={form.whatsapp}
                        onChange={handleChange}
                        className="pl-10 py-3 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <MapPin className="inline w-4 h-4 mr-2 text-purple-500" />
                      City *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        name="city"
                        placeholder="Your city"
                        value={form.city}
                        onChange={handleChange}
                        className="pl-10 py-3 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Address - Full width */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      <Home className="inline w-4 h-4 mr-2 text-amber-500" />
                      Full Address *
                    </label>
                    <div className="relative">
                      <Home className="absolute left-3 top-4 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <textarea
                        name="address"
                        placeholder="Enter your complete address"
                        value={form.address}
                        onChange={handleChange}
                        rows={3}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                  <div className="flex items-start">
                    <button
                      type="button"
                      onClick={() => setAgreedToTerms(!agreedToTerms)}
                      className={`w-5 h-5 rounded border flex items-center justify-center mt-0.5 mr-3 flex-shrink-0 transition-all duration-200 ${
                        agreedToTerms
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500'
                          : 'border-gray-300 bg-white hover:border-gray-400'
                      }`}
                    >
                      {agreedToTerms && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </button>
                    <div>
                      <p className="text-sm text-gray-700">
                        By registering, you agree to our{" "}
                        <Link
                          href="/terms"
                          className="text-blue-600 hover:text-blue-700 font-medium underline"
                          target="_blank"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-blue-600 hover:text-blue-700 font-medium underline"
                          target="_blank"
                        >
                          Privacy Policy
                        </Link>
                        . Your account will be reviewed by our admin team within 24-48 hours.
                      </p>
                      <div className="flex items-center mt-2 text-sm text-gray-600">
                        <Shield className="w-4 h-4 mr-2" />
                        <span>Your data is protected and will never be shared with third parties.</span>
                      </div>
                      {!agreedToTerms && (
                        <p className="text-sm text-red-600 mt-2 font-medium">
                          ✓ You must agree to the Terms and Privacy Policy to register
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleRegister}
                  disabled={loading || !agreedToTerms}
                  className="w-full mt-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating account...
                    </div>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 mr-2" />
                      Register as Seller
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                {/* Login Link */}
                <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <Link
                      href="/auth/login"
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>

              {/* Form Footer */}
              <div className="px-8 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <Shield className="w-4 h-4 mr-2" />
                  <span>Secure registration • 0% commission • Direct buyer contact</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
