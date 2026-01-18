"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Search, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function NotFound() {
  // Simulate popular products - in reality you'd fetch these
  const popularProducts = [
    { id: 1, name: "Nike Air Max", category: "Running" },
    { id: 2, name: "Adidas Ultraboost", category: "Lifestyle" },
    { id: 3, name: "New Balance 990", category: "Classic" },
    { id: 4, name: "Converse Chuck 70", category: "Casual" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4 py-12">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-100 to-transparent rounded-full opacity-50" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-l from-orange-100 to-transparent rounded-full opacity-50" />
      </div>

      <Card className="max-w-2xl w-full p-8 md:p-10 text-center space-y-8 shadow-2xl border border-gray-200 relative overflow-hidden">
        {/* Shoe pattern background */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500" />
        
        <div className="relative">
          <div className="text-8xl mb-4">👟</div>
          <div className="absolute -top-2 -right-2 text-4xl animate-bounce">🔥</div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Page Not Found
          </h1>
          
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Oops! The shoe you're looking for seems to have walked away. 
            Let's find you the perfect pair instead.
          </p>
        </div>

        {/* Search bar for immediate action */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="search"
            placeholder="Search for shoes, brands, or categories..."
            className="pl-10 py-6 text-base rounded-xl"
          />
        </div>

        {/* Popular suggestions */}
        <div className="text-left space-y-4">
          <h3 className="font-semibold text-gray-800">Popular Shoes You Might Like:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {popularProducts.map((product) => (
              <Link
                key={product.id}
                href={`/shop?search=${encodeURIComponent(product.name)}`}
                className="group"
              >
                <div className="p-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group-hover:shadow-md">
                  <div className="font-medium text-gray-900 group-hover:text-blue-600">
                    {product.name}
                  </div>
                  <div className="text-sm text-gray-500">{product.category}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link href="/" className="flex-1">
            <Button className="w-full h-12 text-base gap-2">
              <Home className="h-5 w-5" />
              Back to Home
            </Button>
          </Link>
          
          <Link href="/shop" className="flex-1">
            <Button variant="outline" className="w-full h-12 text-base gap-2 border-2">
              <ShoppingBag className="h-5 w-5" />
              Browse All Shoes
            </Button>
          </Link>
          
          <Link href="/contact" className="flex-1">
            <Button variant="ghost" className="w-full h-12 text-base">
              Need Help?
            </Button>
          </Link>
        </div>

        {/* Stats / Social proof */}
        <div className="pt-6 border-t border-gray-100">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-900">10K+</span>
              <span>Shoes Available</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-900">500+</span>
              <span>Trusted Sellers</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-gray-900">24/7</span>
              <span>Support</span>
            </div>
          </div>
        </div>

        {/* Footer branding */}
        <div className="pt-6">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center gap-2">
              <div className="text-2xl">👟</div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                ET Shoes
              </span>
            </div>
          </Link>
          <p className="text-xs text-gray-400 mt-2">
            Find your perfect pair from trusted local sellers • Free shipping on orders over $50
          </p>
        </div>
      </Card>

      {/* Animation for engagement */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .text-8xl {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}