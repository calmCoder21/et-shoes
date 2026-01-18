"use client";

import { useEffect, useState } from "react";
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
  Check
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

export default function SellerOffersPage() {
  const [seller, setSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [productId, setProductId] = useState("");
  const [variantId, setVariantId] = useState("");
  const [size, setSize] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");

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
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const fetchOffers = async (sellerId: string) => {
    const { data } = await supabase
      .from("seller_offers")
      .select("*")
      .eq("seller_id", sellerId);
    setOffers(data || []);
  };

  const fetchVariants = async (pid: string) => {
    const { data } = await supabase
      .from("product_variants")
      .select("id, color")
      .eq("product_id", pid);
    setVariants(data || []);
  };

  const submitOffer = async () => {
    if (!seller) {
      alert("Seller information not found");
      return;
    }

    if (!productId || !variantId || !size || !price || !stock) {
      alert("Please fill all fields");
      return;
    }

    const contact_info = `Phone: ${seller.phone}, WhatsApp: ${seller.whatsapp}`;

    try {
      const { error } = await supabase.from("seller_offers").upsert({
        seller_id: seller.id,
        product_id: productId,
        variant_id: variantId,
        size: Number(size),
        price: Number(price),
        stock: Number(stock),
        contact_info,
      });

      if (error) {
        alert("Error: " + error.message);
        return;
      }
      
      // Success - reset form and refresh offers
      alert("✅ Offer saved successfully!");
      setProductId("");
      setVariantId("");
      setSize("");
      setPrice("");
      setStock("");
      setVariants([]);
      fetchOffers(seller.id);
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  const getSelectedProduct = () => products.find(p => p.id === productId);
  const getSelectedVariant = () => variants.find(v => v.id === variantId);

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
                    {/* Product Selection */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        <ShoppingBag className="inline w-4 h-4 mr-2 text-blue-500" />
                        Select Product
                      </label>
                      <div className="relative">
                        <select
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all appearance-none bg-white"
                          value={productId}
                          onChange={(e) => {
                            setProductId(e.target.value);
                            setVariantId("");
                            if (e.target.value) {
                              fetchVariants(e.target.value);
                            } else {
                              setVariants([]);
                            }
                          }}
                        >
                          <option value="">Choose a product</option>
                          {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                        <Grid className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                      </div>
                    </div>

                    {/* Variant Selection */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        <Palette className="inline w-4 h-4 mr-2 text-purple-500" />
                        Select Color Variant
                      </label>
                      <div className="relative">
                        <select
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                          value={variantId}
                          onChange={(e) => setVariantId(e.target.value)}
                          disabled={!productId || variants.length === 0}
                        >
                          <option value="">Choose a color</option>
                          {variants.map(v => (
                            <option key={v.id} value={v.id}>{v.color}</option>
                          ))}
                        </select>
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                      </div>
                      {productId && variants.length === 0 && (
                        <p className="text-sm text-amber-600">
                          No color variants available for this product
                        </p>
                      )}
                    </div>

                    {/* Size, Price, Stock Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          <Package className="inline w-4 h-4 mr-2 text-green-500" />
                          Size
                        </label>
                        <div className="relative">
                          <Input
                            type="number"
                            placeholder="e.g., 42"
                            value={size}
                            onChange={e => setSize(e.target.value === "" ? "" : Number(e.target.value))}
                            className="pl-10 py-3 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          />
                          <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                      </div>

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

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          <Layers className="inline w-4 h-4 mr-2 text-amber-500" />
                          Stock Quantity
                        </label>
                        <div className="relative">
                          <Input
                            type="number"
                            placeholder="e.g., 10"
                            value={stock}
                            onChange={e => setStock(e.target.value === "" ? "" : Number(e.target.value))}
                            className="pl-10 py-3 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          />
                          <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    {/* Selection Preview */}
                    {(getSelectedProduct() || getSelectedVariant()) && (
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
                          {size && (
                            <div className="bg-white p-3 rounded-lg">
                              <p className="text-sm text-gray-500">Size</p>
                              <p className="font-medium">{size}</p>
                            </div>
                          )}
                          {price && (
                            <div className="bg-white p-3 rounded-lg">
                              <p className="text-sm text-gray-500">Price</p>
                              <p className="font-medium">{price} ETB</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      onClick={submitOffer}
                      disabled={!productId || !variantId || !size || !price || !stock}
                      className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      {offers.some(o => o.product_id === productId && o.variant_id === variantId && o.size === Number(size))
                        ? "Update Existing Offer"
                        : "Upload New Offer"
                      }
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>

                    <p className="text-sm text-gray-500 text-center">
                      This will create or update your offer. Buyers will see your contact information.
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
                            <span>Contact info is auto-filled from your profile</span>
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