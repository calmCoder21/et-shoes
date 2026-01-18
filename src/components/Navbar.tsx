"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  User,
  LogOut,
  Home,
  Menu,
  X,
  ChevronDown,
  Shield,
  Store,
  Package,
  Users,
  BarChart3,
  Bell,
  Search,
  Sparkles,
  Crown,
  Briefcase,
  Upload,
  Grid
} from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [sellerDropdownOpen, setSellerDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        if (profile) setRole(profile.role);
      }
    };

    fetchUser();

    // Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });

    // Handle scroll effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      listener.subscription.unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    setMobileMenuOpen(false);
  };

  // Navigation items
  const navItems = [
    { href: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
    { href: "/shop", label: "Shop", icon: <ShoppingBag className="w-4 h-4" /> },
    { href: "/about", label: "About", icon: <Users className="w-4 h-4" /> },
  ];

  // Admin navigation items - Removed /sellers
  const adminNavItems = [
    { href: "/admin", label: "Dashboard", icon: <BarChart3 className="w-4 h-4" /> },
    { href: "/admin/products", label: "Products", icon: <Package className="w-4 h-4" /> },
    { href: "/admin/variants", label: "Variants", icon: <Grid className="w-4 h-4" /> },
  ];

  // Seller navigation items - Only dashboard and upload offer (removed /seller/offers as My Offers)
  const sellerNavItems = [
    { href: "/seller", label: "Dashboard", icon: <BarChart3 className="w-4 h-4" /> },
    { href: "/seller/offers", label: "Upload Offers", icon: <Upload className="w-4 h-4" /> },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200/50" 
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-white" />
                </div>
              </motion.div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Et.Shoes
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Direct Marketplace</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {/* Main Navigation */}
              <div className="flex items-center space-x-1 mr-4">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={`relative px-4 py-2 rounded-lg transition-all duration-200 ${
                        isActive(item.href)
                          ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600"
                          : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                      }`}
                    >
                      {isActive(item.href) && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        />
                      )}
                      <span className="flex items-center">
                        {item.icon}
                        <span className="ml-2 font-medium">{item.label}</span>
                      </span>
                    </Button>
                  </Link>
                ))}
              </div>

              {/* Role-based Navigation */}
              {user ? (
                <div className="flex items-center space-x-2">
                  {/* Admin Navigation */}
                  {role === "admin" && (
                    <div className="relative">
                      <Button
                        variant="ghost"
                        onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                          <Crown className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold">Admin</p>
                          <p className="text-xs text-gray-500">Dashboard</p>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform ${adminDropdownOpen ? "rotate-180" : ""}`} />
                      </Button>

                      <AnimatePresence>
                        {adminDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                          >
                            <div className="p-2">
                              {adminNavItems.map((item) => (
                                <Link key={item.href} href={item.href}>
                                  <Button
                                    variant="ghost"
                                    className={`w-full justify-start px-3 py-3 rounded-lg mb-1 ${
                                      isActive(item.href)
                                        ? "bg-blue-50 text-blue-600"
                                        : "hover:bg-gray-100"
                                    }`}
                                  >
                                    <span className="flex items-center">
                                      {item.icon}
                                      <span className="ml-3 font-medium">{item.label}</span>
                                    </span>
                                  </Button>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Seller Navigation */}
                  {role === "seller" && (
                    <div className="relative">
                      <Button
                        variant="ghost"
                        onClick={() => setSellerDropdownOpen(!sellerDropdownOpen)}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-green-50 hover:text-green-600 transition-all"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                          <Store className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold">Seller</p>
                          <p className="text-xs text-gray-500">My Store</p>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform ${sellerDropdownOpen ? "rotate-180" : ""}`} />
                      </Button>

                      <AnimatePresence>
                        {sellerDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                          >
                            <div className="p-2">
                              {sellerNavItems.map((item) => (
                                <Link key={item.href} href={item.href}>
                                  <Button
                                    variant="ghost"
                                    className={`w-full justify-start px-3 py-3 rounded-lg mb-1 ${
                                      isActive(item.href)
                                        ? "bg-green-50 text-green-600"
                                        : "hover:bg-gray-100"
                                    }`}
                                  >
                                    <span className="flex items-center">
                                      {item.icon}
                                      <span className="ml-3 font-medium">{item.label}</span>
                                    </span>
                                  </Button>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* User Profile Dropdown - Simplified */}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all"
                    >
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        {role === "admin" && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-white flex items-center justify-center">
                            <Crown className="w-2 h-2 text-white" />
                          </div>
                        )}
                        {role === "seller" && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                            <Shield className="w-2 h-2 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="text-left hidden lg:block">
                        <p className="text-sm font-semibold">
                          {user.email?.split('@')[0]}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">{role}</p>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform ${userDropdownOpen ? "rotate-180" : ""}`} />
                    </Button>

                    <AnimatePresence>
                      {userDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                          onMouseLeave={() => setUserDropdownOpen(false)}
                        >
                          {/* User Info */}
                          <div className="p-4 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold">{user.email?.split('@')[0]}</p>
                                <div className="flex items-center">
                                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                                    role === "admin" 
                                      ? "bg-red-100 text-red-700" 
                                      : role === "seller"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-blue-100 text-blue-700"
                                  }`}>
                                    {role}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Logout Only */}
                          <div className="p-2">
                            <Button
                              variant="ghost"
                              onClick={handleLogout}
                              className="w-full justify-start px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              <span className="flex items-center">
                                <LogOut className="w-4 h-4" />
                                <span className="ml-3 font-medium">Logout</span>
                              </span>
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                // Auth Buttons
                <div className="flex items-center space-x-2">
                  <Link href="/auth/login">
                    <Button
                      variant="ghost"
                      className="px-5 py-2 rounded-lg hover:bg-gray-100 transition-all"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2 rounded-lg shadow hover:shadow-md transition-all duration-300"
                    >
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white z-50 shadow-2xl md:hidden overflow-y-auto"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900">Et.Shoes</h2>
                      <p className="text-sm text-gray-500">Direct Marketplace</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* User Info */}
                {user && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        {role === "admin" && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-white flex items-center justify-center">
                            <Crown className="w-3 h-3 text-white" />
                          </div>
                        )}
                        {role === "seller" && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                            <Shield className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {user.email?.split('@')[0]}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                          role === "admin" 
                            ? "bg-red-100 text-red-700" 
                            : role === "seller"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {role}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <div className="p-4">
                {/* Main Navigation */}
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                    Navigation
                  </h3>
                  <div className="space-y-1">
                    {navItems.map((item) => (
                      <Link key={item.href} href={item.href}>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start px-3 py-3 rounded-lg ${
                            isActive(item.href)
                              ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <span className="flex items-center">
                            {item.icon}
                            <span className="ml-3 font-medium">{item.label}</span>
                          </span>
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Admin Navigation */}
                {user && role === "admin" && (
                  <div className="mb-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                      Admin Panel
                    </h3>
                    <div className="space-y-1">
                      {adminNavItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <Button
                            variant="ghost"
                            className={`w-full justify-start px-3 py-3 rounded-lg ${
                              isActive(item.href)
                                ? "bg-red-50 text-red-600"
                                : "hover:bg-gray-100"
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <span className="flex items-center">
                              {item.icon}
                              <span className="ml-3 font-medium">{item.label}</span>
                            </span>
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Seller Navigation */}
                {user && role === "seller" && (
                  <div className="mb-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                      Seller Panel
                    </h3>
                    <div className="space-y-1">
                      {sellerNavItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <Button
                            variant="ghost"
                            className={`w-full justify-start px-3 py-3 rounded-lg ${
                              isActive(item.href)
                                ? "bg-green-50 text-green-600"
                                : "hover:bg-gray-100"
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <span className="flex items-center">
                              {item.icon}
                              <span className="ml-3 font-medium">{item.label}</span>
                            </span>
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Auth Buttons */}
                {!user && (
                  <div className="space-y-3">
                    <Link href="/auth/login">
                      <Button
                        variant="outline"
                        className="w-full py-3 rounded-lg border-gray-300 hover:border-gray-400"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Register
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Logout Button */}
                {user && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full justify-center text-red-600 hover:bg-red-50 hover:text-red-700 py-3"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
    </>
  );
}