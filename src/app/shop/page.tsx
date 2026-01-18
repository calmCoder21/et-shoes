"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { 
  ShoppingBag, 
  Filter, 
  Search, 
  Star, 
  Shield, 
  TrendingUp, 
  Sparkles,
  ChevronRight,
  Zap,
  Package,
  Users,
  Clock,
  Eye,
  Heart,
  ShoppingCart,
  Grid,
  List,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Product = {
  id: string;
  name: string;
  created_at?: string;
};

type Variant = {
  id: string;
  color: string;
  images: string[];
  product_id: string;
};

type Offer = {
  id: string;
  seller_id: string;
  product_id: string;
  variant_id: string;
  size: number;
  price: number;
  stock: number;
};

type ProductStats = {
  minPrice: number;
  sellerCount: number;
  variantCount: number;
};

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<Record<string, Variant[]>>({});
  const [offers, setOffers] = useState<Offer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "price" | "popular">("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  // Calculate product statistics
  const getProductStats = (productId: string): ProductStats => {
    const productOffers = offers.filter(o => o.product_id === productId);
    const productVariants = variants[productId] || [];
    
    return {
      minPrice: productOffers.length > 0 
        ? Math.min(...productOffers.map(o => o.price))
        : 0,
      sellerCount: new Set(productOffers.map(o => o.seller_id)).size,
      variantCount: productVariants.length
    };
  };

  // Fetch all data
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // Fetch products
      const { data: productData } = await supabase.from("products").select("*");
      if (productData) setProducts(productData);

      // Fetch variants
      const { data: variantData } = await supabase.from("product_variants").select("*");
      if (variantData) {
        const grouped: Record<string, Variant[]> = {};
        variantData.forEach((v: any) => {
          if (!grouped[v.product_id]) grouped[v.product_id] = [];
          grouped[v.product_id].push(v);
        });
        setVariants(grouped);
      }

      // Fetch offers
      const { data: offerData } = await supabase.from("seller_offers").select("*");
      if (offerData) setOffers(offerData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Filter and sort products
  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
      if (sortBy === "price") {
        return getProductStats(a.id).minPrice - getProductStats(b.id).minPrice;
      }
      return getProductStats(b.id).sellerCount - getProductStats(a.id).sellerCount;
    });

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header skeleton */}
          <div className="animate-pulse mb-8">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-64"></div>
          </div>
          
          {/* Filter skeleton */}
          <div className="animate-pulse mb-8">
            <div className="h-12 bg-gray-200 rounded-lg mb-4"></div>
            <div className="flex gap-4">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          
          {/* Products skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-48 translate-y-48"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto lg:mx-0"
            >
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Sparkles className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Direct Seller Marketplace</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Shop Verified
                <span className="block text-blue-200">Products Directly</span>
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 max-w-2xl">
                Connect with trusted sellers. No middlemen, no commissions. 
                Browse, contact, and deal directly.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Shield className="w-6 h-6 mr-3 text-green-300" />
                  <div>
                    <p className="font-semibold">Verified Sellers Only</p>
                    <p className="text-sm text-blue-200">100% Authentic</p>
                  </div>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <Users className="w-6 h-6 mr-3 text-purple-300" />
                  <div>
                    <p className="font-semibold">Direct Contact</p>
                    <p className="text-sm text-blue-200">Phone & WhatsApp</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 100C120 80 240 40 360 30C480 20 600 40 720 50C840 60 960 60 1080 40C1200 20 1320 0 1380 0H1440V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl mr-4">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                <p className="text-gray-600">Verified Products</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl mr-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(offers.map(o => o.seller_id)).size}
                </p>
                <p className="text-gray-600">Active Sellers</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl mr-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{offers.length}</p>
                <p className="text-gray-600">Available Offers</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all bg-white shadow-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* View Toggle and Sort */}
            <div className="flex gap-3">
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
                >
                  <Grid className={`w-5 h-5 ${viewMode === "grid" ? "text-blue-600" : "text-gray-500"}`} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
                >
                  <List className={`w-5 h-5 ${viewMode === "list" ? "text-blue-600" : "text-gray-500"}`} />
                </button>
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pl-12 pr-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none shadow-sm w-full"
                >
                  <option value="newest">Newest First</option>
                  <option value="price">Lowest Price</option>
                  <option value="popular">Most Sellers</option>
                </select>
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filter</p>
            <button
              onClick={() => setSearchTerm("")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <AnimatePresence>
            {viewMode === "grid" ? (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredProducts.map((product, index) => {
                  const stats = getProductStats(product.id);
                  const productVariants = variants[product.id] || [];
                  const primaryImage = productVariants[0]?.images[0];
                  
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      layoutId={`product-${product.id}`}
                      onMouseEnter={() => setHoveredProduct(product.id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                    >
                      <Card className="group overflow-hidden rounded-2xl border border-gray-200 bg-white hover:shadow-xl hover:border-blue-200 transition-all duration-300 h-full flex flex-col">
                        {/* Product Image */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 aspect-square">
                          {primaryImage ? (
                            <motion.img
                              src={primaryImage}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              initial={{ scale: 1 }}
                              animate={{ scale: hoveredProduct === product.id ? 1.05 : 1 }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-16 h-16 text-gray-400" />
                            </div>
                          )}
                          
                          {/* Overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-4 left-4 right-4">
                              <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ 
                                  y: hoveredProduct === product.id ? 0 : 20, 
                                  opacity: hoveredProduct === product.id ? 1 : 0 
                                }}
                                transition={{ duration: 0.2 }}
                              >
                                <Link
                                  href={`/shop/product/${product.id}`}
                                  className="block w-full bg-white text-blue-600 font-semibold py-3 rounded-xl text-center hover:bg-blue-50 transition-colors"
                                >
                                  View Details
                                </Link>
                              </motion.div>
                            </div>
                          </div>
                          
                          {/* Stats badge */}
                          <div className="absolute top-4 left-4">
                            <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm">
                              <Shield className="w-4 h-4 text-green-600 mr-1.5" />
                              <span className="text-sm font-semibold text-gray-900">
                                {stats.sellerCount} seller{stats.sellerCount !== 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                          
                          {/* Color variants */}
                          {productVariants.length > 0 && (
                            <div className="absolute top-4 right-4 flex space-x-1">
                              {productVariants.slice(0, 3).map((variant, i) => (
                                <div
                                  key={variant.id}
                                  className="w-6 h-6 rounded-full border-2 border-white shadow"
                                  style={{ backgroundColor: variant.color.toLowerCase() }}
                                  title={variant.color}
                                />
                              ))}
                              {productVariants.length > 3 && (
                                <div className="w-6 h-6 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center border-2 border-white shadow">
                                  +{productVariants.length - 3}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                              {product.name}
                            </h3>
                            
                            <div className="space-y-3 mb-4">
                              <div className="flex items-center text-gray-600">
                                <Package className="w-4 h-4 mr-2 flex-shrink-0" />
                                <span className="text-sm">{stats.variantCount} color{stats.variantCount !== 1 ? 's' : ''}</span>
                              </div>
                              
                              {stats.minPrice > 0 && (
                                <div className="flex items-center text-gray-600">
                                  <TrendingUp className="w-4 h-4 mr-2 flex-shrink-0" />
                                  <span className="text-sm">From {stats.minPrice} ETB</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Price and Action */}
                          <div className="pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                              <div>
                                {stats.minPrice > 0 ? (
                                  <>
                                    <p className="text-xs text-gray-500 mb-1">Starting from</p>
                                    <p className="text-xl font-bold text-gray-900">{stats.minPrice} ETB</p>
                                  </>
                                ) : (
                                  <p className="text-gray-500 text-sm">No offers yet</p>
                                )}
                              </div>
                              
                              <Link
                                href={`/shop/product/${product.id}`}
                                className="flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
                              >
                                <span>View</span>
                                <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div layout className="space-y-4">
                {filteredProducts.map((product, index) => {
                  const stats = getProductStats(product.id);
                  const productVariants = variants[product.id] || [];
                  const primaryImage = productVariants[0]?.images[0];
                  
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="group overflow-hidden rounded-2xl border border-gray-200 bg-white hover:shadow-lg hover:border-blue-200 transition-all duration-300">
                        <div className="flex">
                          {/* Product Image */}
                          <div className="w-48 relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                            {primaryImage ? (
                              <img
                                src={primaryImage}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-12 h-12 text-gray-400" />
                              </div>
                            )}
                            
                            {/* Verified badge */}
                            <div className="absolute top-3 left-3">
                              <div className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                Verified
                              </div>
                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 p-6">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                  {product.name}
                                </h3>
                                <p className="text-gray-600">
                                  {productVariants.length} color variant{productVariants.length !== 1 ? 's' : ''} available
                                </p>
                              </div>
                              
                              <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900 mb-1">
                                  {stats.minPrice > 0 ? `${stats.minPrice} ETB` : '--'}
                                </p>
                                <p className="text-sm text-gray-500">Starting price</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-6 mb-4">
                              <div className="flex items-center">
                                <Users className="w-5 h-5 text-green-600 mr-2" />
                                <span className="text-gray-700">{stats.sellerCount} verified sellers</span>
                              </div>
                              
                              <div className="flex items-center">
                                <Package className="w-5 h-5 text-blue-600 mr-2" />
                                <span className="text-gray-700">{stats.variantCount} variants</span>
                              </div>
                              
                              <div className="flex items-center">
                                <Clock className="w-5 h-5 text-purple-600 mr-2" />
                                <span className="text-gray-700">Updated recently</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex space-x-2">
                                {productVariants.slice(0, 5).map((variant) => (
                                  <div
                                    key={variant.id}
                                    className="w-8 h-8 rounded-full border-2 border-white shadow"
                                    style={{ backgroundColor: variant.color.toLowerCase() }}
                                    title={variant.color}
                                  />
                                ))}
                              </div>
                              
                              <Link
                                href={`/shop/product/${product.id}`}
                                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors group"
                              >
                                <Eye className="w-5 h-5 mr-2" />
                                View Product Details
                                <ChevronRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Footer Stats */}
        {filteredProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 pt-8 border-t border-gray-200"
          >
            <div className="text-center">
              <div className="inline-flex items-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl px-6 py-4">
                <Sparkles className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-gray-700">
                  Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> of{" "}
                  <span className="font-bold text-gray-900">{products.length}</span> verified products
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}