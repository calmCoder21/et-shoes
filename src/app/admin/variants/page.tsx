"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Image as ImageIcon,
  Plus,
  X,
  Upload,
  Package,
  Grid,
  RefreshCw,
  ChevronDown,
  Filter,
  Eye,
  Trash2,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Camera,
  Layers
} from "lucide-react";

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

type Product = { id: string; name: string };
type Variant = {
  id: string;
  product_id: string;
  color: string;
  images: string[];
};

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

export default function ProductVariants() {
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [color, setColor] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchVariants();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("id, name");
    setProducts(data || []);
  };

  const fetchVariants = async () => {
    setLoading(true);
    const { data } = await supabase.from("product_variants").select("*");
    setVariants(data || []);
    setLoading(false);
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  /* ---------------- Cloudinary Upload ---------------- */
  const uploadImages = async (files: FileList | null) => {
    if (!files) return;

    if (files.length > 10) {
      showToast("Maximum 10 images allowed per upload", 'error');
      return;
    }

    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          showToast(`File ${file.name} is too large (max 5MB)`, 'error');
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!res.ok) {
          throw new Error(`Upload failed for ${file.name}`);
        }

        const data = await res.json();
        uploadedUrls.push(data.secure_url);
      }

      if (uploadedUrls.length > 0) {
        setImages((prev) => [...prev, ...uploadedUrls]);
        showToast(`Uploaded ${uploadedUrls.length} image${uploadedUrls.length !== 1 ? 's' : ''} successfully`, 'success');
      }
    } catch (error: any) {
      showToast("Error uploading images: " + error.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  /* ---------------- Remove Image ---------------- */
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  /* ---------------- Create Variant ---------------- */
  const handleCreate = async () => {
    if (!selectedProduct) {
      showToast("Please select a product", 'error');
      return;
    }

    if (!color) {
      showToast("Please enter a color name", 'error');
      return;
    }

    if (images.length === 0) {
      showToast("Please upload at least one image", 'error');
      return;
    }

    setUploading(true);

    try {
      const { error } = await supabase.from("product_variants").insert({
        product_id: selectedProduct,
        color,
        images,
      });

      if (error) {
        showToast("Error creating variant: " + error.message, 'error');
        return;
      }

      // Success
      showToast(`Variant "${color}" created successfully!`, 'success');
      
      // Reset form
      setColor("");
      setImages([]);
      
      // Refresh variants
      fetchVariants();
    } catch (error: any) {
      showToast("Error: " + error.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const getSelectedProductName = () => {
    return products.find(p => p.id === selectedProduct)?.name || "Select Product";
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
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
                      <Palette className="w-6 h-6" />
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold">Product Variants</h1>
                      <p className="text-blue-100">Manage color variants and images</p>
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
                    onClick={fetchVariants}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Create Variant Form */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <Plus className="w-5 h-5 mr-2 text-blue-600" />
                      Create New Variant
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Add a new color variant with images for a product
                    </p>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {/* Product Selection */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        <Package className="inline w-4 h-4 mr-2 text-blue-500" />
                        Select Product *
                      </label>
                      <div className="relative">
                        <select
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all appearance-none bg-white"
                          value={selectedProduct}
                          onChange={(e) => setSelectedProduct(e.target.value)}
                        >
                          <option value="">Choose a product</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                        <Grid className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                      </div>
                    </div>

                    {/* Color Input */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        <Palette className="inline w-4 h-4 mr-2 text-purple-500" />
                        Color Name *
                      </label>
                      <div className="relative">
                        <Palette className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          placeholder="e.g., Red, Black, Navy Blue"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="pl-10 py-3 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        <Camera className="inline w-4 h-4 mr-2 text-green-500" />
                        Upload Images *
                      </label>
                      
                      {/* Upload Button */}
                      <div className="relative">
                        <Input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => uploadImages(e.target.files)}
                          className="pl-10 py-3 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all cursor-pointer"
                        />
                        <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>

                      {uploading && (
                        <div className="flex items-center text-blue-600">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                          <span className="text-sm">Uploading images...</span>
                        </div>
                      )}

                      {/* Upload Info */}
                      <div className="p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                        <div className="flex items-center text-sm text-gray-600">
                          <Sparkles className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                          <span>Upload up to 10 images per variant • Max 5MB per image</span>
                        </div>
                      </div>

                      {/* Image Preview */}
                      {images.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-700">
                              Preview ({images.length} image{images.length !== 1 ? 's' : ''})
                            </p>
                            <button
                              onClick={() => setImages([])}
                              className="text-sm text-red-600 hover:text-red-700 font-medium"
                            >
                              Clear All
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                            {images.map((img, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="relative group"
                              >
                                <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 group-hover:border-blue-300 transition-colors">
                                  <img
                                    src={img}
                                    alt={`Upload ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <button
                                  onClick={() => removeImage(index)}
                                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md z-10"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Create Button */}
                    <Button
                      onClick={handleCreate}
                      disabled={uploading || !selectedProduct || !color || images.length === 0}
                      className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Creating...
                        </div>
                      ) : (
                        <>
                          <Plus className="w-5 h-5 mr-2" />
                          Create Variant
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Existing Variants */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="rounded-2xl border border-gray-200 shadow-lg overflow-hidden h-full">
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                          <Layers className="w-5 h-5 mr-2 text-purple-600" />
                          Existing Variants ({variants.length})
                        </h2>
                        <p className="text-gray-600 mt-1">
                          All color variants across products
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                            <div className="flex gap-2">
                              <div className="w-20 h-20 bg-gray-200 rounded"></div>
                              <div className="w-20 h-20 bg-gray-200 rounded"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : variants.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                          <Palette className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No variants yet</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                          Create your first color variant by filling the form on the left.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                        {variants.map((variant) => {
                          const product = products.find(p => p.id === variant.product_id);
                          
                          return (
                            <motion.div
                              key={variant.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-4 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all duration-200"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                  <div 
                                    className="w-6 h-6 rounded-full border-2 border-white shadow mr-3"
                                    style={{ backgroundColor: variant.color.toLowerCase() }}
                                    title={variant.color}
                                  />
                                  <div>
                                    <h3 className="font-bold text-gray-900">{variant.color}</h3>
                                    <p className="text-sm text-gray-500">
                                      Product: {product?.name || "Unknown Product"}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500">
                                  ID: {variant.id.slice(0, 8)}...
                                </div>
                              </div>
                              
                              <div className="flex gap-2 overflow-x-auto pb-2">
                                {variant.images.map((img, index) => (
                                  <div
                                    key={index}
                                    className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-gray-200 group"
                                  >
                                    <img
                                      src={img}
                                      alt={`${variant.color} ${index + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                    <button
                                      onClick={() => window.open(img, '_blank')}
                                      className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center"
                                    >
                                      <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                              
                              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                <div className="text-sm text-gray-500">
                                  {variant.images.length} image{variant.images.length !== 1 ? 's' : ''}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                    Variant
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                    
                    {variants.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">
                            Total: <span className="font-bold text-gray-900">{variants.length}</span> variants across{" "}
                            <span className="font-bold text-gray-900">
                              {new Set(variants.map(v => v.product_id)).size}
                            </span> products
                          </p>
                        </div>
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