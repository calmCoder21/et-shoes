"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Plus,
  Tag,
  FileText,
  Building,
  RefreshCw,
  Eye,
  Trash2,
  Edit,
  CheckCircle,
  AlertCircle,
  X,
  Sparkles,
  Grid,
  Search,
  Filter,
  ChevronRight,
  Crown,
  BarChart3
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  brand: string;
  description: string;
  created_at?: string;
};

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

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({ name: "", brand: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order('created_at', { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleCreate = async () => {
    if (!form.name.trim() || !form.brand.trim()) {
      showToast("Product name and brand are required", 'error');
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("products").insert([form]);
    
    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast("Product created successfully!", 'success');
      setForm({ name: "", brand: "", description: "" });
      fetchProducts();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast("Product deleted successfully", 'success');
      fetchProducts();
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mr-3">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold">Product Management</h1>
                      <p className="text-blue-100">Create and manage products for sellers</p>
                    </div>
                  </div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-4 md:mt-0"
                >
                  <Button
                    onClick={fetchProducts}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Create Product Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <Plus className="w-5 h-5 mr-2 text-blue-600" />
                      Create New Product
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Add new products that sellers can offer
                    </p>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {/* Product Name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        <Tag className="inline w-4 h-4 mr-2 text-blue-500" />
                        Product Name *
                      </label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          name="name"
                          placeholder="e.g., Nike Air Max, Adidas Ultraboost"
                          value={form.name}
                          onChange={handleChange}
                          className="pl-10 py-3 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Brand */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        <Building className="inline w-4 h-4 mr-2 text-purple-500" />
                        Brand *
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          name="brand"
                          placeholder="e.g., Nike, Adidas, Puma"
                          value={form.brand}
                          onChange={handleChange}
                          className="pl-10 py-3 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        <FileText className="inline w-4 h-4 mr-2 text-green-500" />
                        Description
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-4 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <textarea
                          name="description"
                          placeholder="Enter product description, features, or specifications..."
                          value={form.description}
                          onChange={handleChange}
                          rows={4}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all resize-none"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Optional: Detailed description helps sellers understand the product better
                      </p>
                    </div>

                    {/* Form Preview */}
                    {(form.name || form.brand || form.description) && (
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                        <h3 className="font-semibold text-gray-900 mb-2">Product Preview</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {form.name && (
                            <div className="bg-white p-3 rounded-lg">
                              <p className="text-sm text-gray-500">Product Name</p>
                              <p className="font-medium">{form.name}</p>
                            </div>
                          )}
                          {form.brand && (
                            <div className="bg-white p-3 rounded-lg">
                              <p className="text-sm text-gray-500">Brand</p>
                              <p className="font-medium">{form.brand}</p>
                            </div>
                          )}
                          {form.description && (
                            <div className="bg-white p-3 rounded-lg md:col-span-2">
                              <p className="text-sm text-gray-500">Description</p>
                              <p className="font-medium truncate">{form.description}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      onClick={handleCreate}
                      disabled={loading || !form.name.trim() || !form.brand.trim()}
                      className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Creating Product...
                        </div>
                      ) : (
                        <>
                          <Plus className="w-5 h-5 mr-2" />
                          Create Product
                          <ChevronRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>

                    <p className="text-sm text-gray-500 text-center">
                      Once created, sellers can add offers for this product
                    </p>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Stats & Product List */}
            <div className="space-y-6">
              {/* Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="rounded-2xl border border-gray-200 shadow-lg">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                      Products Overview
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                            <Package className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total Products</p>
                            <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Quick Actions</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            <span>Add variants after product creation</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            <span>Sellers can offer multiple sizes</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            <span>Each product supports multiple colors</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Product List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="rounded-2xl border border-gray-200 shadow-lg">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <Grid className="w-5 h-5 mr-2 text-purple-600" />
                        All Products ({products.length})
                      </h3>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-sm w-40"
                        />
                      </div>
                    </div>
                    
                    {loading ? (
                      <div className="space-y-3">
                        {[1, 2].map((i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-16 bg-gray-200 rounded-lg"></div>
                          </div>
                        ))}
                      </div>
                    ) : filteredProducts.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-600">No products found</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {searchTerm ? "Try a different search term" : "Create your first product"}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {filteredProducts.map((product) => (
                          <div
                            key={product.id}
                            className="p-3 rounded-lg border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all duration-200"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mr-3">
                                    <Package className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">{product.name}</p>
                                    <div className="flex items-center text-sm text-gray-500">
                                      <Building className="w-3 h-3 mr-1" />
                                      <span>{product.brand}</span>
                                      <span className="mx-2">•</span>
                                      <span className="text-xs">{formatDate(product.created_at)}</span>
                                    </div>
                                  </div>
                                </div>
                                {product.description && (
                                  <p className="text-sm text-gray-600 mt-2 line-clamp-1">
                                    {product.description}
                                  </p>
                                )}
                              </div>
                              
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
                                title="Delete product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {filteredProducts.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600 text-center">
                          Showing {filteredProducts.length} of {products.length} products
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Bottom Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 pt-8 border-t border-gray-200"
          >
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 mb-1 flex items-center">
                    <Crown className="w-5 h-5 mr-2 text-blue-600" />
                    Admin Guidelines
                  </h3>
                  <p className="text-gray-600">
                    Create products with clear names and brands. Each product can have multiple color variants 
                    that sellers can offer in different sizes.
                  </p>
                </div>
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{products.length}</div>
                    <div className="text-sm text-gray-600">Total Products</div>
                  </div>
                  <div className="h-10 w-px bg-gray-300"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {products.filter(p => p.brand).length}
                    </div>
                    <div className="text-sm text-gray-600">With Brands</div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}