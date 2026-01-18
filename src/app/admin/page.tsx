"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute";
import { motion } from "framer-motion";
import {
  Users,
  Shield,
  CheckCircle,
  XCircle,
  PauseCircle,
  PlayCircle,
  Building,
  Phone,
  MessageCircle,
  MapPin,
  Home,
  BarChart3,
  Filter,
  Search,
  RefreshCw,
  Crown,
  Eye,
  MoreVertical,
  TrendingUp,
  UserCheck,
  AlertCircle,
  ChevronRight,
  Mail,
  Globe
} from "lucide-react";

type Seller = {
  id: string;
  shop_name: string;
  status: "pending" | "active" | "blocked";
  is_verified: boolean;
  phone: string;
  whatsapp: string;
  city: string;
  address: string;
};

export default function AdminPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "pending" | "blocked">("all");

  const fetchSellers = async () => {
    setLoading(true);
    const { data } = await supabase.from("sellers").select("*");
    if (data) setSellers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const toggleStatus = async (seller: Seller) => {
    let newStatus: Seller["status"] =
      seller.status === "active" ? "blocked" : "active";

    await supabase
      .from("sellers")
      .update({ status: newStatus })
      .eq("id", seller.id);

    fetchSellers();
  };

  const toggleVerified = async (seller: Seller) => {
    await supabase
      .from("sellers")
      .update({ is_verified: !seller.is_verified })
      .eq("id", seller.id);

    fetchSellers();
  };

  // Calculate stats
  const totalSellers = sellers.length;
  const activeSellers = sellers.filter(s => s.status === "active").length;
  const pendingSellers = sellers.filter(s => s.status === "pending").length;
  const verifiedSellers = sellers.filter(s => s.is_verified).length;

  // Filter and search sellers
  const filteredSellers = sellers.filter(seller => {
    const matchesSearch = 
      seller.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.phone.includes(searchTerm);
    
    const matchesFilter = 
      filter === "all" || 
      seller.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: Seller["status"]) => {
    switch(status) {
      case "active": return "bg-green-500";
      case "pending": return "bg-amber-500";
      case "blocked": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: Seller["status"]) => {
    switch(status) {
      case "active": return <PlayCircle className="w-4 h-4 text-green-600" />;
      case "pending": return <PauseCircle className="w-4 h-4 text-amber-600" />;
      case "blocked": return <XCircle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
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
                      <Crown className="w-6 h-6" />
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
                      <p className="text-blue-100">Manage sellers and platform operations</p>
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
                    onClick={fetchSellers}
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

        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: "Total Sellers",
                value: totalSellers,
                icon: <Users className="w-6 h-6" />,
                color: "from-blue-500 to-cyan-500",
                bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
                change: "+2 this week"
              },
              {
                title: "Active Sellers",
                value: activeSellers,
                icon: <PlayCircle className="w-6 h-6" />,
                color: "from-green-500 to-emerald-500",
                bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
                change: `${Math.round((activeSellers / totalSellers) * 100)}% of total`
              },
              {
                title: "Verified Sellers",
                value: verifiedSellers,
                icon: <Shield className="w-6 h-6" />,
                color: "from-purple-500 to-pink-500",
                bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
                change: `${Math.round((verifiedSellers / totalSellers) * 100)}% verified`
              },
              {
                title: "Pending Review",
                value: pendingSellers,
                icon: <AlertCircle className="w-6 h-6" />,
                color: "from-amber-500 to-orange-500",
                bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
                change: "Needs attention"
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
                        <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-md`}>
                        {stat.icon}
                      </div>
                    </div>
                    <div className={`h-1 w-full bg-gradient-to-r ${stat.color} mt-4 rounded-full`}></div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-8">
            <Card className="p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search sellers by name, city, or phone..."
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
                  <div className="flex bg-gray-100 p-1 rounded-xl">
                    {[
                      { key: "all", label: "All", icon: <Globe className="w-4 h-4" /> },
                      { key: "active", label: "Active", icon: <PlayCircle className="w-4 h-4" /> },
                      { key: "pending", label: "Pending", icon: <PauseCircle className="w-4 h-4" /> },
                      { key: "blocked", label: "Blocked", icon: <XCircle className="w-4 h-4" /> }
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => setFilter(item.key as any)}
                        className={`flex items-center px-3 py-2 rounded-lg transition-all ${
                          filter === item.key 
                            ? 'bg-white shadow-sm text-blue-600' 
                            : 'hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {item.icon}
                        <span className="ml-2 font-medium">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sellers List */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Seller Management</h2>
                <p className="text-gray-600">
                  {filteredSellers.length} seller{filteredSellers.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-6 animate-pulse">
                    <div className="space-y-4">
                      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : filteredSellers.length === 0 ? (
              <Card className="p-12 text-center border-2 border-dashed border-gray-300 bg-gray-50">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                  <Users className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No sellers found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchTerm 
                    ? "No sellers match your search. Try different keywords."
                    : "No sellers are registered yet. They will appear here once registered."
                  }
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setFilter("all");
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset Filters
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredSellers.map((seller, index) => (
                  <motion.div
                    key={seller.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="rounded-2xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                      <div className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                          {/* Seller Info */}
                          <div className="flex-1">
                            <div className="flex items-center mb-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mr-3">
                                <Building className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="flex items-center">
                                  <h3 className="text-lg font-bold text-gray-900">{seller.shop_name}</h3>
                                  {seller.is_verified && (
                                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center">
                                      <Shield className="w-3 h-3 mr-1" />
                                      Verified
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center mt-1">
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                                    seller.status === 'active' ? 'bg-green-100 text-green-700' :
                                    seller.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                    'bg-red-100 text-red-700'
                                  }`}>
                                    {getStatusIcon(seller.status)}
                                    <span className="ml-1.5 capitalize">{seller.status}</span>
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                                <div>
                                  <p className="text-sm text-gray-500">City</p>
                                  <p className="font-medium">{seller.city}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center">
                                <Phone className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                                <div>
                                  <p className="text-sm text-gray-500">Phone</p>
                                  <p className="font-medium">{seller.phone}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center">
                                <MessageCircle className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                                <div>
                                  <p className="text-sm text-gray-500">WhatsApp</p>
                                  <p className="font-medium">{seller.whatsapp}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center">
                                <Home className="w-4 h-4 text-gray-500 mr-2 flex-shrink-0" />
                                <div>
                                  <p className="text-sm text-gray-500">Address</p>
                                  <p className="font-medium truncate max-w-[200px]">{seller.address}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col space-y-2 mt-4 lg:mt-0 lg:ml-6">
                            <Button
                              onClick={() => toggleStatus(seller)}
                              variant="outline"
                              className={`justify-start ${
                                seller.status === 'active' 
                                  ? 'border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700' 
                                  : 'border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700'
                              }`}
                            >
                              {seller.status === 'active' ? (
                                <>
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Block Seller
                                </>
                              ) : (
                                <>
                                  <PlayCircle className="w-4 h-4 mr-2" />
                                  Activate Seller
                                </>
                              )}
                            </Button>
                            
                            <Button
                              onClick={() => toggleVerified(seller)}
                              variant="outline"
                              className={`justify-start ${
                                seller.is_verified 
                                  ? 'border-amber-200 text-amber-600 hover:bg-amber-50 hover:text-amber-700' 
                                  : 'border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700'
                              }`}
                            >
                              {seller.is_verified ? (
                                <>
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Remove Verification
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Verify Seller
                                </>
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Status Indicator */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(seller.status)}`}></div>
                                <span className="text-sm text-gray-600 capitalize">{seller.status}</span>
                              </div>
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-2 ${seller.is_verified ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span className="text-sm text-gray-600">
                                  {seller.is_verified ? 'Verified seller' : 'Not verified'}
                                </span>
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {seller.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Admin Notes */}
            {filteredSellers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-8 pt-8 border-t border-gray-200"
              >
                <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1 flex items-center">
                        <Crown className="w-5 h-5 mr-2 text-blue-600" />
                        Admin Panel Guidelines
                      </h3>
                      <p className="text-gray-600">
                        Verify sellers carefully and monitor their activity regularly. 
                        Block sellers only for policy violations.
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{activeSellers}</div>
                        <div className="text-sm text-gray-600">Active Sellers</div>
                      </div>
                      <div className="h-10 w-px bg-gray-300"></div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{verifiedSellers}</div>
                        <div className="text-sm text-gray-600">Verified</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}