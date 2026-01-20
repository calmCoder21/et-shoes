"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute";
import { motion } from "framer-motion";
import {
  Package,
  Palette,
  TrendingUp,
  Layers,
  DollarSign,
  Upload,
  CheckCircle,
  AlertCircle,
  ShoppingBag,
  Grid,
  Filter,
  Plus,
  RefreshCw,
  ArrowRight,
  Shield,
  Clock,
  Eye,
  ChevronDown,
  Check,
  Search,
  X
} from "lucide-react";

type Product = { id: string; name: string };
type Variant = { id: string; color: string };

type Offer = {
  id: string;
  product_id: string;
  variant_id: string;
  size: number;
  price: number;
  stock: number;
};

type Seller = {
  id: string;
  status: "pending" | "active" | "blocked";
  is_verified: boolean;
  phone: string;
  whatsapp: string;
};

// Define shoe sizes 39-45
const SHOE_SIZES = [39, 40, 41, 42, 43, 44, 45];

export default function SellerOffersPage() {
  const [seller, setSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [productId, setProductId] = useState("");
  const [variantId, setVariantId] = useState("");
  const [price, setPrice] = useState<number | "">("");
  
  // State for size selection and stock
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [sizeStocks, setSizeStocks] = useState<Record<number, number | "">>({});

  // State for search
  const [productSearch, setProductSearch] = useState("");
  const [variantSearch, setVariantSearch] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showVariantDropdown, setShowVariantDropdown] = useState(false);

  // State for toast notifications
  const [toasts, setToasts] = useState<Array<{
    id: number;
    type: 'success' | 'error' | 'info';
    message: string;
  }>>([]);

  // Filtered products and variants based on search
  const filteredProducts = useMemo(() => {
    if (!productSearch) return products;
    return products.filter(product =>
      product.name.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [products, productSearch]);

  const filteredVariants = useMemo(() => {
    if (!variantSearch) return variants;
    return variants.filter(variant =>
      variant.color.toLowerCase().includes(variantSearch.toLowerCase())
    );
  }, [variants, variantSearch]);

  // Function to show toast
  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    
    // Auto remove toast after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch seller data
        const { data: sellerData } = await supabase
          .from("sellers")
          .select("*")
          .eq("id", user.id)
          .single();
        setSeller(sellerData);

        // Fetch products
        const { data: productData } = await supabase.from("products").select("*");
        setProducts(productData || []);

        // Fetch offers
        await fetchOffers(user.id);
      } catch (error) {
        console.error("Error initializing:", error);
        showToast('error', 'Error initializing: ' + (error as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const fetchOffers = async (sellerId: string) => {
    try {
      const { data, error } = await supabase
        .from("seller_offers")
        .select("*")
        .eq("seller_id", sellerId);
      
      if (error) throw error;
      setOffers(data || []);
    } catch (error) {
      console.error("Error fetching offers:", error);
      showToast('error', 'Error fetching offers: ' + (error as Error).message);
    }
  };

  const fetchVariants = async (pid: string) => {
    try {
      const { data, error } = await supabase
        .from("product_variants")
        .select("id, color")
        .eq("product_id", pid);
      
      if (error) throw error;
      setVariants(data || []);
    } catch (error) {
      console.error("Error fetching variants:", error);
      showToast('error', 'Error fetching variants: ' + (error as Error).message);
    }
  };

  // Handle size checkbox change
  const handleSizeChange = (size: number) => {
    if (selectedSizes.includes(size)) {
      // Remove size if already selected
      setSelectedSizes(prev => prev.filter(s => s !== size));
      
      // Remove stock data for this size
      setSizeStocks(prev => {
        const updated = { ...prev };
        delete updated[size];
        return updated;
      });
    } else {
      // Add size if not selected
      setSelectedSizes(prev => [...prev, size]);
      setSizeStocks(prev => ({ ...prev, [size]: "" }));
    }
  };

  // Handle stock input change for a specific size
  const handleStockChange = (size: number, value: string) => {
    setSizeStocks(prev => ({
      ...prev,
      [size]: value === "" ? "" : Number(value)
    }));
  };

  const submitOffer = async () => {
    if (!seller) {
      showToast('error', "Seller information not found");
      return;
    }

    if (!productId || !variantId || !price || selectedSizes.length === 0) {
      showToast('error', "Please fill all fields and select at least one size");
      return;
    }

    // Check if all selected sizes have stock values
    const hasEmptyStocks = selectedSizes.some(size => 
      sizeStocks[size] === "" || sizeStocks[size] === undefined
    );
    
    if (hasEmptyStocks) {
      showToast('error', "Please enter stock quantity for all selected sizes");
      return;
    }

    const contact_info = `Phone: ${seller.phone}, WhatsApp: ${seller.whatsapp}`;

    try {
      // Create an array of offers for each selected size
      const offersToSubmit = selectedSizes.map(size => ({
        seller_id: seller.id,
        product_id: productId,
        variant_id: variantId,
        size: size,
        price: Number(price),
        stock: Number(sizeStocks[size]),
        contact_info,
      }));

      // Submit each offer
      const errors = [];
      for (const offer of offersToSubmit) {
        const { error } = await supabase.from("seller_offers").upsert(offer);
        if (error) {
          errors.push(error.message);
        }
      }

      if (errors.length > 0) {
        showToast('error', "Error creating some offers: " + errors.join(", "));
        return;
      }
      
      // Success - reset form and refresh offers
      showToast('success', `✅ ${offersToSubmit.length} offer(s) saved successfully!`);
      setProductId("");
      setVariantId("");
      setPrice("");
      setSelectedSizes([]);
      setSizeStocks({});
      setVariants([]);
      setProductSearch("");
      setVariantSearch("");
      setShowProductDropdown(false);
      setShowVariantDropdown(false);
      fetchOffers(seller.id);
    } catch (error: any) {
      showToast('error', "Error: " + error.message);
    }
  };

  const getSelectedProduct = () => products.find(p => p.id === productId);
  const getSelectedVariant = () => variants.find(v => v.id === variantId);

  // Handle product selection
  const handleProductSelect = (product: Product) => {
    setProductId(product.id);
    setProductSearch(product.name);
    setShowProductDropdown(false);
    setVariantId("");
    setVariantSearch("");
    setSelectedSizes([]);
    setSizeStocks({});
    fetchVariants(product.id);
  };

  // Handle variant selection
  const handleVariantSelect = (variant: Variant) => {
    setVariantId(variant.id);
    setVariantSearch(variant.color);
    setShowVariantDropdown(false);
  };

  // Clear product selection
  const clearProductSelection = () => {
    setProductId("");
    setProductSearch("");
    setVariantId("");
    setVariantSearch("");
    setVariants([]);
    setSelectedSizes([]);
    setSizeStocks({});
    setShowVariantDropdown(false);
  };

  // Clear variant selection
  const clearVariantSelection = () => {
    setVariantId("");
    setVariantSearch("");
    setSelectedSizes([]);
    setSizeStocks({});
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={["seller"]}>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600">Loading seller dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (seller && (seller.status !== "active" || !seller.is_verified)) {
    return (
      <ProtectedRoute allowedRoles={["seller"]}>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-8 rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Account Verification Required
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-center space-x-4">
                      <div className={`px-4 py-2 rounded-full ${seller.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        <span className="font-semibold">Status: {seller.status}</span>
                      </div>
                      <div className={`px-4 py-2 rounded-full ${seller.is_verified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        <span className="font-semibold">Verified: {seller.is_verified ? "✅ Yes" : "❌ No"}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 max-w-md mx-auto">
                      Your seller account is currently under review. Once approved by our admin team, 
                      you'll be able to create and manage offers. This usually takes 24-48 hours.
                    </p>
                    
                    <div className="flex items-center justify-center text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">Please check back later</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Status
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["seller"]}>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Toast Notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`rounded-lg shadow-lg p-4 min-w-[300px] max-w-md border-l-4 ${
                toast.type === 'success' 
                  ? 'bg-green-50 border-green-500 text-green-800' 
                  : toast.type === 'error'
                  ? 'bg-red-50 border-red-500 text-red-800'
                  : 'bg-blue-50 border-blue-500 text-blue-800'
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {toast.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : toast.type === 'error' ? (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{toast.message}</p>
                </div>
                <button
                  onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                  className="ml-auto pl-3"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

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
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold">Upload Offers</h1>
                      <p className="text-blue-100">Add or update your product offers</p>
                    </div>
                  </div>
                  
                  {seller && (
                    <div className="flex items-center space-x-2 mt-3">
                      <div className="px-3 py-1 bg-green-500/20 rounded-full">
                        <span className="text-sm font-medium">Verified Seller ✅</span>
                      </div>
                      <div className="px-3 py-1 bg-blue-500/20 rounded-full">
                        <span className="text-sm">Status: Active</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-4 md:mt-0"
                >
                  <Button
                    onClick={() => window.location.reload()}
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
            {/* Left Column - Form */}
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
                      Create New Offer
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Fill in the details below to add or update your offer
                    </p>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {/* Product Selection with Search */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        <ShoppingBag className="inline w-4 h-4 mr-2 text-blue-500" />
                        Select Product
                      </label>
                      <div className="relative">
                        <div className="relative">
                          <div className="flex items-center">
                            <Grid className="absolute left-3 w-5 h-5 text-gray-400" />
                            <Input
                              type="text"
                              placeholder="Search or choose a product..."
                              value={productSearch}
                              onChange={(e) => {
                                setProductSearch(e.target.value);
                                if (!showProductDropdown) setShowProductDropdown(true);
                              }}
                              onFocus={() => setShowProductDropdown(true)}
                              className="pl-10 pr-10 py-3 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                            {productId && (
                              <button
                                onClick={clearProductSelection}
                                className="absolute right-3 text-gray-400 hover:text-gray-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {/* Product Dropdown */}
                        {showProductDropdown && (
                          <div className="absolute z-10 mt-1 w-full bg-white rounded-xl border border-gray-300 shadow-lg max-h-60 overflow-y-auto">
                            <div className="p-2 border-b border-gray-200">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                  type="text"
                                  placeholder="Search products..."
                                  value={productSearch}
                                  onChange={(e) => setProductSearch(e.target.value)}
                                  className="pl-10 border-0 focus:ring-0"
                                  autoFocus
                                />
                              </div>
                            </div>
                            <div className="py-1">
                              {filteredProducts.length === 0 ? (
                                <div className="px-4 py-3 text-gray-500 text-sm">
                                  No products found
                                </div>
                              ) : (
                                filteredProducts.map(product => (
                                  <button
                                    key={product.id}
                                    onClick={() => handleProductSelect(product)}
                                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                                      productId === product.id ? 'bg-blue-50 text-blue-700' : ''
                                    }`}
                                  >
                                    <div className="flex items-center">
                                      {productId === product.id && (
                                        <Check className="w-4 h-4 mr-2 text-blue-600" />
                                      )}
                                      {product.name}
                                    </div>
                                  </button>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      {showProductDropdown && (
                        <div 
                          className="fixed inset-0 z-0" 
                          onClick={() => setShowProductDropdown(false)}
                        />
                      )}
                    </div>

                    {/* Variant Selection with Search */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        <Palette className="inline w-4 h-4 mr-2 text-purple-500" />
                        Select Color Variant
                      </label>
                      <div className="relative">
                        <div className="relative">
                          <div className="flex items-center">
                            <Filter className="absolute left-3 w-5 h-5 text-gray-400" />
                            <Input
                              type="text"
                              placeholder={!productId ? "Select a product first" : "Search or choose a color..."}
                              value={variantSearch}
                              onChange={(e) => {
                                setVariantSearch(e.target.value);
                                if (!showVariantDropdown) setShowVariantDropdown(true);
                              }}
                              onFocus={() => {
                                if (productId && variants.length > 0) setShowVariantDropdown(true);
                              }}
                              className="pl-10 pr-10 py-3 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                              disabled={!productId || variants.length === 0}
                            />
                            {variantId && (
                              <button
                                onClick={clearVariantSelection}
                                className="absolute right-3 text-gray-400 hover:text-gray-600"
                                disabled={!productId || variants.length === 0}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {/* Variant Dropdown */}
                        {showVariantDropdown && productId && variants.length > 0 && (
                          <div className="absolute z-10 mt-1 w-full bg-white rounded-xl border border-gray-300 shadow-lg max-h-60 overflow-y-auto">
                            <div className="p-2 border-b border-gray-200">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                  type="text"
                                  placeholder="Search colors..."
                                  value={variantSearch}
                                  onChange={(e) => setVariantSearch(e.target.value)}
                                  className="pl-10 border-0 focus:ring-0"
                                  autoFocus
                                />
                              </div>
                            </div>
                            <div className="py-1">
                              {filteredVariants.length === 0 ? (
                                <div className="px-4 py-3 text-gray-500 text-sm">
                                  No colors found
                                </div>
                              ) : (
                                filteredVariants.map(variant => (
                                  <button
                                    key={variant.id}
                                    onClick={() => handleVariantSelect(variant)}
                                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                                      variantId === variant.id ? 'bg-blue-50 text-blue-700' : ''
                                    }`}
                                  >
                                    <div className="flex items-center">
                                      <div 
                                        className="w-4 h-4 rounded-full mr-3 border border-gray-300"
                                        style={{ backgroundColor: variant.color.toLowerCase() }}
                                      />
                                      {variant.color}
                                      {variantId === variant.id && (
                                        <Check className="w-4 h-4 ml-auto text-blue-600" />
                                      )}
                                    </div>
                                  </button>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      {showVariantDropdown && (
                        <div 
                          className="fixed inset-0 z-0" 
                          onClick={() => setShowVariantDropdown(false)}
                        />
                      )}
                      {productId && variants.length === 0 && (
                        <p className="text-sm text-amber-600">
                          No color variants available for this product
                        </p>
                      )}
                    </div>

                    {/* Size Selector */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        <Package className="inline w-4 h-4 mr-2 text-green-500" />
                        Select Sizes (Shoe Sizes 39-45)
                      </label>
                      <div className="bg-white p-4 rounded-xl border border-gray-300">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                          {SHOE_SIZES.map(size => (
                            <div key={size} className="flex flex-col">
                              <div className="flex items-center mb-1">
                                <div 
                                  className={`w-5 h-5 rounded-md border flex items-center justify-center mr-2 cursor-pointer transition-all ${
                                    selectedSizes.includes(size)
                                      ? "bg-blue-600 border-blue-600"
                                      : "bg-white border-gray-300 hover:border-blue-400"
                                  }`}
                                  onClick={() => handleSizeChange(size)}
                                >
                                  {selectedSizes.includes(size) && (
                                    <Check className="w-3 h-3 text-white" />
                                  )}
                                </div>
                                <span className="font-medium">{size}</span>
                              </div>
                              
                              {selectedSizes.includes(size) && (
                                <div className="relative ml-7">
                                  <Input
                                    type="number"
                                    placeholder="Stock"
                                    value={sizeStocks[size] || ""}
                                    onChange={(e) => handleStockChange(size, e.target.value)}
                                    className="pl-10 py-2 h-9 text-sm rounded-lg border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                                    min="0"
                                  />
                                  <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {selectedSizes.length > 0 && (
                          <div className="pt-4 border-t border-gray-200">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              Selected Sizes: {selectedSizes.sort((a, b) => a - b).join(", ")}
                            </p>
                            <div className="text-xs text-gray-500">
                              <p>• Enter stock quantity for each selected size</p>
                              <p>• Each size will create a separate offer</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price Input */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        <DollarSign className="inline w-4 h-4 mr-2 text-green-500" />
                        Price (ETB)
                      </label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="e.g., 450"
                          value={price}
                          onChange={e => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                          className="pl-10 py-3 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                    </div>

                    {/* Selection Preview */}
                    {(getSelectedProduct() || getSelectedVariant() || selectedSizes.length > 0) && (
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                        <h3 className="font-semibold text-gray-900 mb-2">Offer Preview</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {getSelectedProduct() && (
                            <div className="bg-white p-3 rounded-lg">
                              <p className="text-sm text-gray-500">Product</p>
                              <p className="font-medium">{getSelectedProduct()?.name}</p>
                            </div>
                          )}
                          {getSelectedVariant() && (
                            <div className="bg-white p-3 rounded-lg">
                              <p className="text-sm text-gray-500">Color</p>
                              <div className="flex items-center">
                                <div 
                                  className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                                  style={{ backgroundColor: getSelectedVariant()?.color.toLowerCase() }}
                                />
                                <p className="font-medium">{getSelectedVariant()?.color}</p>
                              </div>
                            </div>
                          )}
                          {price && (
                            <div className="bg-white p-3 rounded-lg">
                              <p className="text-sm text-gray-500">Price</p>
                              <p className="font-medium">{price} ETB</p>
                            </div>
                          )}
                          {selectedSizes.length > 0 && (
                            <div className="bg-white p-3 rounded-lg">
                              <p className="text-sm text-gray-500">Sizes Selected</p>
                              <p className="font-medium">{selectedSizes.length}</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Show detailed size preview */}
                        {selectedSizes.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-blue-100">
                            <p className="text-sm font-medium text-gray-700 mb-2">Size Details:</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {selectedSizes.sort((a, b) => a - b).map(size => (
                                <div key={size} className="bg-white p-2 rounded-lg border border-blue-100">
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium">Size {size}</span>
                                    <span className="text-green-600 font-medium">
                                      Stock: {sizeStocks[size] || 0}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      onClick={submitOffer}
                      disabled={!productId || !variantId || !price || selectedSizes.length === 0}
                      className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      {`Upload ${selectedSizes.length} Offer${selectedSizes.length !== 1 ? 's' : ''}`}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>

                    <p className="text-sm text-gray-500 text-center">
                      This will create {selectedSizes.length > 0 ? selectedSizes.length : 'multiple'} offer(s). Each size will be a separate offer.
                    </p>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Stats & Existing Offers */}
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
                      <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                      Your Offers Summary
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                            <Package className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total Offers</p>
                            <p className="text-2xl font-bold text-gray-900">{offers.length}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Quick Tips</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            <span>Keep stock updated for better visibility</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            <span>Competitive pricing attracts more buyers</span>
                          </li>
                          <li className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            <span>You can select multiple sizes at once</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Existing Offers */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="rounded-2xl border border-gray-200 shadow-lg">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <Eye className="w-5 h-5 mr-2 text-purple-600" />
                        Existing Offers ({offers.length})
                      </h3>
                      <Button
                        onClick={() => seller && fetchOffers(seller.id)}
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {offers.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-600">No offers created yet</p>
                        <p className="text-sm text-gray-500 mt-1">Start by creating your first offer</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {offers.map((offer) => {
                          const product = products.find(p => p.id === offer.product_id);
                          const variant = variants.find(v => v.id === offer.variant_id);
                          
                          return (
                            <div
                              key={offer.id}
                              className="p-3 rounded-lg border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all duration-200"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {product?.name || "Unknown Product"}
                                  </p>
                                  <div className="flex items-center text-sm text-gray-500">
                                    <div 
                                      className="w-3 h-3 rounded-full mr-2 border border-gray-300"
                                      style={{ backgroundColor: variant?.color.toLowerCase() || '#ccc' }}
                                    />
                                    <span>{variant?.color || "Unknown Color"}</span>
                                    <span className="mx-2">•</span>
                                    <span>Size: {offer.size}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-gray-900">{offer.price} ETB</p>
                                  <p className="text-sm text-gray-500">Stock: {offer.stock}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    {offers.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600 text-center">
                          View all offers in your{" "}
                          <a href="/seller" className="text-blue-600 hover:text-blue-700 font-medium">
                            Seller Dashboard
                          </a>
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
