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
  Edit,
  Trash2,
  Save,
  X,
  TrendingUp,
  Layers,
  DollarSign,
  ShoppingBag,
  BarChart3,
  RefreshCw,
  Plus,
  Filter,
  Search,
  Calendar
} from "lucide-react";
import Link from "next/link";

type SellerOffer = {
  id: string;
  product_name: string;
  variant_color: string;
  size: number;
  price: number;
  stock: number;
};

export default function SellerPage() {
  const [offers, setOffers] = useState<SellerOffer[]>([]);
  const [editOfferId, setEditOfferId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOffers = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // Join products and variants to show names/colors - EXACT SAME AS YOUR WORKING CODE
    const { data } = await supabase
      .from("seller_offers")
      .select(`
        id,
        size,
        price,
        stock,
        products(name),
        product_variants(color)
      `)
      .eq("seller_id", user.id);

    if (!data) return;

    // Map to display-friendly structure - EXACT SAME AS YOUR WORKING CODE
    const mapped = data.map((o: any) => ({
      id: o.id,
      product_name: o.products.name,
      variant_color: o.product_variants.color,
      size: o.size,
      price: o.price,
      stock: o.stock,
    }));

    setOffers(mapped);
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const startEdit = (offer: SellerOffer) => {
    setEditOfferId(offer.id);
    setEditPrice(offer.price);
    setEditStock(offer.stock);
  };

  const saveEdit = async () => {
    if (!editOfferId) return;

    const { error } = await supabase
      .from("seller_offers")
      .update({ price: editPrice, stock: editStock })
      .eq("id", editOfferId);

    if (error) alert(error.message);
    else {
      setEditOfferId(null);
      fetchOffers();
    }
  };

  const deleteOffer = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;

    const { error } = await supabase.from("seller_offers").delete().eq("id", id);

    if (error) alert(error.message);
    else fetchOffers();
  };

  // Calculate dashboard stats
  const totalOffers = offers.length;
  const totalStock = offers.reduce((sum, offer) => sum + offer.stock, 0);
  const totalValue = offers.reduce((sum, offer) => sum + (offer.price * offer.stock), 0);
  const averagePrice = totalOffers > 0 
    ? Math.round(offers.reduce((sum, offer) => sum + offer.price, 0) / totalOffers)
    : 0;

  // Filter offers
  const filteredOffers = offers.filter(offer => 
    offer.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.variant_color.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute allowedRoles={["seller"]}>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mr-3">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold">Seller Dashboard</h1>
                      <p className="text-blue-100">Manage your offers and track performance</p>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-4 md:mt-0"
              >
                <Button
                  onClick={fetchOffers}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: "Total Offers",
                value: totalOffers,
                icon: <Package className="w-6 h-6" />,
                color: "from-blue-500 to-cyan-500",
                bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50"
              },
              {
                title: "Total Stock",
                value: totalStock,
                icon: <Layers className="w-6 h-6" />,
                color: "from-green-500 to-emerald-500",
                bgColor: "bg-gradient-to-br from-green-50 to-emerald-50"
              },
              {
                title: "Total Value",
                value: `${totalValue.toLocaleString()} ETB`,
                icon: <DollarSign className="w-6 h-6" />,
                color: "from-purple-500 to-pink-500",
                bgColor: "bg-gradient-to-br from-purple-50 to-pink-50"
              },
              {
                title: "Avg Price",
                value: `${averagePrice.toLocaleString()} ETB`,
                icon: <TrendingUp className="w-6 h-6" />,
                color: "from-amber-500 to-orange-500",
                bgColor: "bg-gradient-to-br from-amber-50 to-orange-50"
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`${stat.bgColor} border-0 rounded-2xl shadow-lg overflow-hidden`}>
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                        {stat.icon}
                      </div>
                    </div>
                    <div className={`h-1 w-full bg-gradient-to-r ${stat.color} mt-4 rounded-full`}></div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <Card className="p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search offers by product or color..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all bg-white"
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

                <div className="flex gap-3">
                  <Link href="/seller/offers">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Offer
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>

          {/* Offers List */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">My Offers</h2>
                <p className="text-gray-600">
                  {filteredOffers.length} offer{filteredOffers.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>

            {filteredOffers.length === 0 ? (
              <Card className="p-12 text-center border-2 border-dashed border-gray-300 bg-gray-50">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                  <Package className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No offers found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchTerm 
                    ? "No offers match your search. Try different keywords."
                    : "You haven't created any offers yet. Start by adding your first offer."
                  }
                </p>
                <Link href="/seller/offers">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Offer
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredOffers.map((offer) => (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="rounded-2xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                      {editOfferId === offer.id ? (
                        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">
                                {offer.product_name} • {offer.variant_color}
                              </h3>
                              <p className="text-gray-600">Size: {offer.size}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                Editing
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">Price (ETB)</label>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                  type="number"
                                  value={editPrice}
                                  onChange={(e) => setEditPrice(parseInt(e.target.value) || 0)}
                                  className="pl-10 py-3 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                  placeholder="Enter price"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">Stock</label>
                              <div className="relative">
                                <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                  type="number"
                                  value={editStock}
                                  onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                                  className="pl-10 py-3 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                  placeholder="Enter stock"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-end space-x-3 mt-6">
                            <Button
                              onClick={() => setEditOfferId(null)}
                              variant="outline"
                              className="border-gray-300 hover:border-gray-400"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancel
                            </Button>
                            <Button
                              onClick={saveEdit}
                              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <div 
                                  className="w-6 h-6 rounded-full border-2 border-white shadow mr-3"
                                  style={{ backgroundColor: offer.variant_color.toLowerCase() }}
                                  title={offer.variant_color}
                                />
                                <h3 className="text-lg font-bold text-gray-900">
                                  {offer.product_name}
                                </h3>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <div className="flex items-center">
                                  <Package className="w-4 h-4 text-blue-500 mr-2" />
                                  <div>
                                    <p className="text-sm text-gray-500">Color</p>
                                    <p className="font-medium">{offer.variant_color}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center">
                                  <ShoppingBag className="w-4 h-4 text-purple-500 mr-2" />
                                  <div>
                                    <p className="text-sm text-gray-500">Size</p>
                                    <p className="font-medium">{offer.size}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center">
                                  <DollarSign className="w-4 h-4 text-green-500 mr-2" />
                                  <div>
                                    <p className="text-sm text-gray-500">Price</p>
                                    <p className="font-medium">{offer.price} ETB</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center">
                                  <Layers className="w-4 h-4 text-amber-500 mr-2" />
                                  <div>
                                    <p className="text-sm text-gray-500">Stock</p>
                                    <p className={`font-medium ${offer.stock > 5 ? 'text-green-600' : 'text-red-600'}`}>
                                      {offer.stock} unit{offer.stock !== 1 ? 's' : ''}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex space-x-2 mt-4 md:mt-0">
                              <Button
                                onClick={() => startEdit(offer)}
                                variant="outline"
                                className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                              <Button
                                onClick={() => deleteOffer(offer.id)}
                                variant="outline"
                                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </div>

                          {/* Stock Level Indicator */}
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-600">Stock Level</span>
                              <span className={`text-sm font-medium ${
                                offer.stock > 10 ? 'text-green-600' :
                                offer.stock > 5 ? 'text-amber-600' : 'text-red-600'
                              }`}>
                                {offer.stock > 10 ? 'Good' : offer.stock > 5 ? 'Low' : 'Very Low'}
                              </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  offer.stock > 10 ? 'bg-green-500' :
                                  offer.stock > 5 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.min(offer.stock * 10, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}