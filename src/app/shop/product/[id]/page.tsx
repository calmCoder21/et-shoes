"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { 
  Phone, 
  MessageCircle, 
  Shield,
  Users,
  Palette,
  Package,
  Hash,
  Copy,
  Check,
  Filter,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  UserCheck,
  Eye
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  description?: string;
};

type Variant = {
  id: string;
  color: string;
  images: string[];
};

type Offer = {
  id: string;
  seller_id: string;
  variant_id: string;
  size: number;
  price: number;
  stock: number;
  contact_info: string;
};

type Seller = {
  id: string;
  status: "pending" | "active" | "blocked";
  is_verified: boolean;
};

// Helper function to extract phone number from contact_info
const extractPhoneNumber = (contactInfo: string, type: 'phone' | 'whatsapp'): string => {
  const lines = contactInfo.split(',');
  
  for (const line of lines) {
    if (type === 'phone' && line.trim().toLowerCase().startsWith('phone:')) {
      return line.split(':')[1]?.trim() || '';
    }
    if (type === 'whatsapp' && line.trim().toLowerCase().startsWith('whatsapp:')) {
      return line.split(':')[1]?.trim() || '';
    }
  }
  
  // Fallback: try to extract any phone number
  const phoneMatch = contactInfo.match(/(09|07)\d{8}/);
  return phoneMatch ? phoneMatch[0] : '';
};

// Helper function to clean phone number for WhatsApp
const cleanPhoneForWhatsApp = (phone: string): string => {
  // Remove all non-numeric characters except +
  return phone.replace(/\D/g, '');
};

export default function ProductDetailPage() {
  const { id: productId } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [offersByVariant, setOffersByVariant] = useState<Record<string, Offer[]>>(
    {}
  );
  const [activeVariant, setActiveVariant] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [revealedPhone, setRevealedPhone] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"price" | "size" | "stock">("price");
  const [expandedOffers, setExpandedOffers] = useState<boolean>(true);

  useEffect(() => {
    if (!productId) return;

    const loadData = async () => {
      /* Product */
      const { data: productData } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();
      setProduct(productData);

      /* Variants */
      const { data: variantData } = await supabase
        .from("product_variants")
        .select("*")
        .eq("product_id", productId);
      setVariants(variantData || []);
      if (variantData?.[0]) setActiveVariant(variantData[0].id);

      /* Offers */
      const { data: offerData } = await supabase
        .from("seller_offers")
        .select("id, seller_id, variant_id, size, price, stock, contact_info")
        .eq("product_id", productId);

      if (!offerData || offerData.length === 0) return;

      /* Sellers (fetch once) */
      const sellerIds = [...new Set(offerData.map(o => o.seller_id))];

      const { data: sellers } = await supabase
        .from("sellers")
        .select("id, status, is_verified")
        .in("id", sellerIds);

      const sellerMap = new Map<string, Seller>();
      sellers?.forEach(s => sellerMap.set(s.id, s));

      /* Group offers by variant */
      const grouped: Record<string, Offer[]> = {};

      for (const offer of offerData) {
        const seller = sellerMap.get(offer.seller_id);
        if (seller?.status === "active" && seller.is_verified) {
          if (!grouped[offer.variant_id]) grouped[offer.variant_id] = [];
          grouped[offer.variant_id].push(offer);
        }
      }

      setOffersByVariant(grouped);
    };

    loadData();
  }, [productId]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(text);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const openWhatsApp = (contactInfo: string) => {
    const phoneNumber = extractPhoneNumber(contactInfo, 'whatsapp');
    if (!phoneNumber) return;
    
    const cleanedNumber = cleanPhoneForWhatsApp(phoneNumber);
    if (!cleanedNumber) return;
    
    window.open(`https://wa.me/${cleanedNumber}`, '_blank');
  };

  const revealPhoneNumber = (contactInfo: string) => {
    const phoneNumber = extractPhoneNumber(contactInfo, 'phone');
    if (phoneNumber) {
      setRevealedPhone(phoneNumber);
      // Auto-hide after 30 seconds
      setTimeout(() => setRevealedPhone(null), 30000);
    }
  };

  const getVariantOffers = (variantId: string) => {
    const offers = offersByVariant[variantId] || [];
    return [...offers].sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "size") return a.size - b.size;
      return b.stock - a.stock;
    });
  };

  if (!product) return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-600">Finding verified sellers...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">Direct Seller Connection Platform</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-gray-600 mt-1">
                Connect directly with verified sellers via phone and WhatsApp
              </p>
            </div>
            <div className="hidden lg:flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
              <Shield className="w-5 h-5" />
              <span className="font-medium">All Sellers Verified ✅</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Product Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Description */}
            <Card className="p-6 rounded-xl border border-gray-200 bg-white">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Product Details</h2>
                {product.description && (
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {product.description}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <UserCheck className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-semibold">Verified Only</p>
                    <p className="text-sm text-gray-600">Trusted sellers</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <Phone className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-semibold">Direct Contact</p>
                    <p className="text-sm text-gray-600">Phone & WhatsApp</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-amber-50 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-amber-600 mr-3" />
                  <div>
                    <p className="font-semibold">No Commissions</p>
                    <p className="text-sm text-gray-600">Deal directly</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Color Variants */}
            <Card className="p-6 rounded-xl border border-gray-200 bg-white">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Palette className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">Available Colors</h2>
                </div>
                <span className="text-sm text-gray-600">
                  {variants.length} color{variants.length !== 1 ? 's' : ''} available
                </span>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {variants.map((variant) => (
                  <div
                    key={variant.id}
                    className={`p-4 rounded-lg transition-all duration-200 cursor-pointer ${
                      activeVariant === variant.id
                        ? 'bg-blue-50 border-2 border-blue-200'
                        : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                    }`}
                    onClick={() => {
                      setActiveVariant(variant.id);
                      setSelectedImage(0);
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div 
                          className="w-8 h-8 rounded-full border-2 border-white shadow mr-3"
                          style={{ 
                            backgroundColor: variant.color.toLowerCase().includes('white') 
                              ? '#f3f4f6' 
                              : variant.color.toLowerCase()
                          }}
                        />
                        <div>
                          <h3 className="font-bold text-gray-900">{variant.color}</h3>
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-1" />
                            <span>{getVariantOffers(variant.id).length} verified sellers</span>
                          </div>
                        </div>
                      </div>
                      
                      {activeVariant === variant.id && (
                        <div className="flex items-center bg-blue-600 text-white px-3 py-1 rounded-full">
                          <Check className="w-4 h-4 mr-1" />
                          <span className="text-sm font-medium">Selected</span>
                        </div>
                      )}
                    </div>

                    {/* Images - Updated for desktop visibility */}
                    <div className="space-y-3">
                      {variant.images.length > 0 ? (
                        <>
                          <div className="h-auto max-h-[400px] rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                            <img
                              src={variant.images[selectedImage]}
                              alt={variant.color}
                              className="w-full h-full object-contain max-h-[400px]"
                            />
                          </div>
                          
                          {variant.images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                              {variant.images.map((img, i) => (
                                <button
                                  key={i}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedImage(i);
                                  }}
                                  className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden ${
                                    selectedImage === i
                                      ? 'ring-2 ring-blue-600 ring-offset-2'
                                      : 'opacity-70 hover:opacity-100'
                                  }`}
                                >
                                  <img
                                    src={img}
                                    alt={`${variant.color} view ${i + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="h-48 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <Palette className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Seller Offers */}
          <div className="space-y-6">
            {/* Offers Header */}
            <Card className="p-6 rounded-xl border border-gray-200 bg-white">
              <div 
                className="flex items-center justify-between cursor-pointer mb-4"
                onClick={() => setExpandedOffers(!expandedOffers)}
              >
                <div className="flex items-center">
                  <Users className="w-6 h-6 text-blue-600 mr-3" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Verified Sellers</h2>
                    <p className="text-sm text-gray-600">
                      {activeVariant 
                        ? `${getVariantOffers(activeVariant).length} sellers for selected color`
                        : 'Select a color to see sellers'
                      }
                    </p>
                  </div>
                </div>
                {expandedOffers ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>

              {/* Sort Options */}
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Sort by:</span>
                <div className="flex space-x-2">
                  {[
                    { key: "price" as const, label: "Price" },
                    { key: "size" as const, label: "Size" },
                    { key: "stock" as const, label: "Stock" }
                  ].map((option) => (
                    <button
                      key={option.key}
                      onClick={() => setSortBy(option.key)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        sortBy === option.key
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Offers List */}
              {expandedOffers && (
                <>
                  {activeVariant ? (
                    getVariantOffers(activeVariant).length > 0 ? (
                      <div className="space-y-4">
                        {getVariantOffers(activeVariant).map((offer) => {
                          const phoneNumber = extractPhoneNumber(offer.contact_info, 'phone');
                          const isPhoneRevealed = revealedPhone === phoneNumber;
                          
                          return (
                            <div
                              key={offer.id}
                              className="p-4 rounded-lg border border-gray-200 bg-white hover:border-blue-200 transition-colors"
                            >
                              {/* Seller Info Header */}
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                  <span className="font-semibold text-gray-900">Verified Seller</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg font-bold text-blue-600">{offer.price} ETB</span>
                                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium">
                                    Size: {offer.size}
                                  </span>
                                </div>
                              </div>

                              {/* Stock & Contact */}
                              <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center">
                                    <Package className="w-4 h-4 text-gray-500 mr-2" />
                                    <span className="text-gray-700">
                                      {offer.stock} item{offer.stock !== 1 ? 's' : ''} available
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <Hash className="w-4 h-4 text-gray-500 mr-2" />
                                    <span className="font-medium">ID: {offer.id.slice(0, 8)}</span>
                                  </div>
                                </div>

                                {/* Contact Actions */}
                                <div className="pt-3 border-t border-gray-100">
                                  {/* Phone Number Display Area */}
                                  {isPhoneRevealed && phoneNumber ? (
                                    <div className="mb-3 p-3 bg-green-50 rounded-lg border border-green-200">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                          <Phone className="w-5 h-5 text-green-600 mr-2" />
                                          <span className="font-mono text-lg font-bold text-gray-900">
                                            {phoneNumber}
                                          </span>
                                        </div>
                                        <button
                                          onClick={() => copyToClipboard(phoneNumber)}
                                          className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                                        >
                                          {copiedNumber === phoneNumber ? (
                                            <>
                                              <Check className="w-4 h-4 mr-1" />
                                              Copied!
                                            </>
                                          ) : (
                                            <>
                                              <Copy className="w-4 h-4 mr-1" />
                                              Copy
                                            </>
                                          )}
                                        </button>
                                      </div>
                                      <p className="text-xs text-green-700 mt-1">
                                        This number will be hidden in 30 seconds
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                      <div className="flex items-center">
                                        <Eye className="w-5 h-5 text-blue-600 mr-2" />
                                        <span className="text-gray-700">
                                          Phone number hidden for privacy. Click "Call Now" to reveal.
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                  {/* Action Buttons */}
                                  <div className="flex space-x-3">
                                    <button
                                      onClick={() => revealPhoneNumber(offer.contact_info)}
                                      className="flex-1 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors"
                                    >
                                      <Phone className="w-4 h-4 mr-2" />
                                      {isPhoneRevealed ? 'View Number' : 'Call Now'}
                                    </button>
                                    <button
                                      onClick={() => openWhatsApp(offer.contact_info)}
                                      className="flex-1 flex items-center justify-center bg-[#25D366] hover:bg-[#128C7E] text-white font-medium py-2.5 rounded-lg transition-colors"
                                    >
                                      <MessageCircle className="w-4 h-4 mr-2" />
                                      WhatsApp
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600 font-medium">No verified sellers for this color</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Try selecting a different color variant
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-8">
                      <Palette className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600 font-medium">Select a color variant</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Choose a color above to see available sellers
                      </p>
                    </div>
                  )}
                </>
              )}
            </Card>

            {/* Platform Info */}
            <Card className="p-6 rounded-xl border border-gray-200 bg-blue-50/50">
              <div className="flex items-start mb-4">
                <Shield className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">How It Works</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>1. <span className="font-medium">Browse</span> verified seller offers</p>
                    <p>2. <span className="font-medium">Select</span> your preferred price and size</p>
                    <p>3. <span className="font-medium">Contact</span> seller directly via phone or WhatsApp</p>
                    <p>4. <span className="font-medium">Negotiate</span> and arrange delivery directly</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-blue-100">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Note:</span> All communication and transactions happen directly between you and the seller. 
                  We only verify seller authenticity.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}