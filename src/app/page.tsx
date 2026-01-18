"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Shield, 
  Users, 
  TrendingUp, 
  Phone, 
  MessageCircle, 
  ShoppingBag, 
  Star, 
  CheckCircle,
  Zap,
  Sparkles,
  Target,
  BarChart3,
  Handshake,
  BadgeCheck,
  Lock,
  Eye
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* HERO SECTION - Enhanced */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-white/10 rounded-full"
              initial={{ y: -100 }}
              animate={{ 
                y: window.innerHeight + 100,
                x: Math.sin(i) * 100
              }}
              transition={{
                duration: 15 + i * 2,
                repeat: Infinity,
                delay: i * 2
              }}
              style={{
                left: `${20 + i * 15}%`,
                width: `${10 + i * 4}px`,
                height: `${10 + i * 4}px`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Direct Seller Marketplace</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                Connect <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Directly</span>
                <br />
                With Verified Sellers
              </h1>

              <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
                No middlemen, no commissions. Browse authentic products, compare verified seller offers, 
                and contact directly via phone or WhatsApp for the best deals.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/shop">
                  <Button 
                    size="lg" 
                    className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <ShoppingBag className="mr-3 w-5 h-5" />
                    Browse Products
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-2 border-white/30 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white px-8 py-6 rounded-xl text-lg font-semibold"
                  >
                    <Users className="mr-3 w-5 h-5" />
                    Become a Seller
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">100%</div>
                  <div className="text-sm text-gray-400">Verified Sellers</div>
                </div>
                <div className="text-center border-x border-white/20">
                  <div className="text-3xl font-bold text-white">0%</div>
                  <div className="text-sm text-gray-400">Commission Fee</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">Direct</div>
                  <div className="text-sm text-gray-400">Contact Only</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* 3D Card Stack */}
              <div className="relative h-[500px]">
                {/* Card 1 */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 1, -1, 0]
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="absolute top-0 left-0 w-full max-w-md bg-gradient-to-br from-white to-gray-100 rounded-2xl shadow-2xl p-6 transform rotate-3"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div className="ml-3">
                        <div className="font-bold text-gray-900">Verified Seller</div>
                        <div className="text-sm text-gray-600">⭐ 4.8/5 Rating</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">450 ETB</div>
                  </div>
                  <div className="h-48 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 mb-4"></div>
                  <div className="flex justify-between">
                    <Button className="bg-green-500 hover:bg-green-600 text-white">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                    <Button className="bg-[#25D366] hover:bg-[#128C7E] text-white">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </motion.div>

                {/* Card 2 */}
                <motion.div
                  animate={{ 
                    y: [0, 10, 0],
                    rotate: [0, -1, 1, 0]
                  }}
                  transition={{ 
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 1
                  }}
                  className="absolute bottom-0 right-0 w-full max-w-md bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl p-6 transform -rotate-3 border border-gray-800"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div className="ml-3">
                        <div className="font-bold text-white">Price Comparison</div>
                        <div className="text-sm text-gray-400">3 sellers available</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-white">From 380 ETB</div>
                  </div>
                  <div className="space-y-2 mb-4">
                    {[380, 420, 450].map((price, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-green-500' : 'bg-gray-500'} mr-3`}></div>
                          <div>
                            <div className="font-medium text-white">Seller {i + 1}</div>
                            <div className="text-sm text-gray-400">Size: 42</div>
                          </div>
                        </div>
                        <div className="text-xl font-bold text-white">{price} ETB</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - Enhanced */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 rounded-full px-4 py-2 mb-4">
              <Zap className="w-4 h-4" />
              <span className="font-semibold">Simple Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three simple steps to connect with verified sellers and get the best deals
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>

            {[
              {
                step: "01",
                icon: <Eye className="w-8 h-8" />,
                title: "Browse Products",
                description: "Explore authentic products uploaded by verified sellers with multiple color variants and detailed images.",
                color: "from-blue-500 to-blue-600",
                bgColor: "bg-blue-50",
                iconBg: "bg-blue-100"
              },
              {
                step: "02",
                icon: <BarChart3 className="w-8 h-8" />,
                title: "Compare Offers",
                description: "View multiple verified seller offers side-by-side. Compare prices, sizes, and availability in real-time.",
                color: "from-purple-500 to-purple-600",
                bgColor: "bg-purple-50",
                iconBg: "bg-purple-100"
              },
              {
                step: "03",
                icon: <Handshake className="w-8 h-8" />,
                title: "Contact Directly",
                description: "Reach sellers directly via phone or WhatsApp. No middlemen, no commissions, just direct communication.",
                color: "from-green-500 to-green-600",
                bgColor: "bg-green-50",
                iconBg: "bg-green-100"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Card className={`${item.bgColor} border-0 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full`}>
                  <CardContent className="p-8">
                    <div className="flex flex-col items-center text-center">
                      {/* Step Number */}
                      <div className={`w-16 h-16 rounded-full ${item.iconBg} flex items-center justify-center mb-6`}>
                        <span className={`text-2xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                          {item.step}
                        </span>
                      </div>

                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-full ${item.iconBg} flex items-center justify-center mb-4`}>
                        <div className={`bg-gradient-to-r ${item.color} p-2 rounded-full`}>
                          {item.icon}
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>

                      {/* Step Indicator */}
                      <div className="mt-8 pt-6 border-t border-gray-200/50 w-full">
                        <div className="flex items-center justify-center">
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.color}`}></div>
                          <div className="h-0.5 w-8 bg-gradient-to-r from-gray-200 to-gray-300 mx-2"></div>
                          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                          <div className="h-0.5 w-8 bg-gradient-to-r from-gray-200 to-gray-300 mx-2"></div>
                          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST SECTION - Enhanced */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-600 rounded-full px-4 py-2 mb-4">
              <Shield className="w-4 h-4" />
              <span className="font-semibold">Why Trust Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Built on <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Trust & Transparency</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We ensure every transaction is secure, transparent, and direct
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BadgeCheck className="w-8 h-8" />,
                title: "Verified Sellers Only",
                description: "Every seller undergoes strict verification by admins before listing offers.",
                features: ["Background verification", "Document validation", "Regular audits"],
                color: "from-green-500 to-emerald-500",
                bgColor: "bg-gradient-to-br from-green-50 to-emerald-50"
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "Transparent Prices",
                description: "Compare real-time prices from multiple verified sellers with no hidden fees.",
                features: ["No commissions", "Direct pricing", "Price history"],
                color: "from-blue-500 to-cyan-500",
                bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50"
              },
              {
                icon: <Lock className="w-8 h-8" />,
                title: "Direct Contact",
                description: "Communicate directly with sellers via phone or WhatsApp. No middlemen involved.",
                features: ["Phone & WhatsApp", "Secure messaging", "Direct negotiation"],
                color: "from-purple-500 to-pink-500",
                bgColor: "bg-gradient-to-br from-purple-50 to-pink-50"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`${item.bgColor} border-0 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full`}>
                  <div className={`h-2 bg-gradient-to-r ${item.color}`}></div>
                  <CardContent className="p-8">
                    <div className={`w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center mb-6`}>
                      <div className={`bg-gradient-to-r ${item.color} p-2 rounded-full`}>
                        {item.icon}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                    <p className="text-gray-600 mb-6">{item.description}</p>
                    
                    <ul className="space-y-3">
                      {item.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <CheckCircle className={`w-5 h-5 mr-3 ${item.color.replace('from-', 'text-').replace(' to-', '-')}`} />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SELLER CTA - Enhanced */}
      <section className="relative overflow-hidden py-24 bg-gradient-to-r from-gray-900 via-black to-blue-900">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">For Sellers</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Grow Your Business?</span>
                </h2>
                
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Join our verified seller community. Get access to real buyers, manage your offers effortlessly, 
                  and grow your business with zero commission fees.
                </p>
                
                <div className="space-y-4 mb-8">
                  {[
                    "Zero commission fees",
                    "Direct buyer contact",
                    "Verified seller badge",
                    "Real-time offer management"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-white">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-white to-gray-100 rounded-2xl p-8 shadow-2xl transform rotate-1">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Start Selling Today</h3>
                    <p className="text-gray-600 mb-8">
                      Register once, get verified, and start connecting with buyers immediately.
                    </p>
                    
                    <Link href="/auth/register">
                      <Button 
                        size="lg" 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Users className="mr-3 w-5 h-5" />
                        Register as Seller
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    
                    <p className="text-sm text-gray-500 mt-6">
                      Verification typically takes 24-48 hours
                    </p>
                  </div>
                </div>
                
                {/* Floating elements */}
                <motion.div
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-xl shadow-lg"
                >
                  <div className="font-bold">0% Commission</div>
                </motion.div>
                
                <motion.div
                  animate={{ 
                    y: [0, 15, 0],
                    rotate: [0, -3, 3, 0]
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: 1
                  }}
                  className="absolute -bottom-4 -left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg"
                >
                  <div className="font-bold">Verified ✅</div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12 shadow-xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Find Your Perfect Deal?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Start browsing verified products and connect directly with trusted sellers today.
            </p>
            <Link href="/shop">
              <Button 
                size="lg" 
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <ShoppingBag className="mr-3 w-5 h-5" />
                Start Shopping Now
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
            <p className="text-gray-500 mt-6">
              No registration required to browse • 100% free for buyers
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}