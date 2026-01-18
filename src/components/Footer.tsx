"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Shield, CreditCard, ArrowRight } from "lucide-react";

export default function Footer() {
  const footerLinks = [
    {
      title: "Shop",
      links: [
        { href: "/shop", label: "Browse Products" },
        { href: "/shop?category=men", label: "Men's Shoes" },
        { href: "/shop?category=women", label: "Women's Shoes" },
        { href: "/shop?category=kids", label: "Kids' Shoes" },
      ],
    },
    {
      title: "Sellers",
      links: [
        { href: "/auth/login", label: "Seller Login" },
        { href: "/auth/register", label: "Become a Seller" },
        { href: "/seller", label: "Dashboard" },
        { href: "/seller/offers", label: "Upload Offers" },
      ],
    },
    {
      title: "Support",
      links: [
        { href: "/about", label: "About Us" },
        { href: "/contact", label: "Contact" },
        { href: "/privacy", label: "Privacy" },
        { href: "/terms", label: "Terms" },
      ],
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-white to-gray-50 border-t border-gray-200 overflow-hidden">
      {/* Floating shapes (SSR safe) */}
      <motion.div
        className="absolute top-[-50px] left-[-50px] w-24 h-24 rounded-full bg-blue-100 opacity-50"
        animate={{ y: ["0vh", "5vh", "0vh"], x: ["0vw", "2vw", "0vw"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-40px] right-[-40px] w-32 h-32 rounded-full bg-purple-100 opacity-40"
        animate={{ y: ["0vh", "-5vh", "0vh"], x: ["0vw", "-2vw", "0vw"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column - brand + badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ET Shoes
                </h2>
                <p className="text-sm text-gray-600">Direct Seller Marketplace</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:scale-105 transition-transform">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Verified Sellers Only</p>
                  <p className="text-sm text-gray-600">100% Trusted</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100 hover:scale-105 transition-transform">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">0% Commission</p>
                  <p className="text-sm text-gray-600">Direct Contact</p>
                </div>
              </div>
            </div>

            {/* Contact Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <a
                href="tel:0922429417"
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-center hover:bg-blue-700 transition-colors"
              >
                Call: 0922429417
              </a>
              <a
                href="https://wa.me/0922429417"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-500 text-white rounded-xl text-center hover:bg-green-600 transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </motion.div>

          {/* Right column - links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {footerLinks.map((col) => (
              <motion.div
                key={col.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">{col.title}</h3>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex items-center text-gray-600 hover:text-purple-600 transition-colors"
                      >
                        <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Copyright Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-600">
                © {currentYear} ET Shoes. All rights reserved.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Direct Seller Marketplace for Authentic Shoes
              </p>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-gray-800 text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-500 hover:text-gray-800 text-sm transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/contact"
                className="text-gray-500 hover:text-gray-800 text-sm transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
          
          {/* Optional: Additional disclaimer */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">
              ET Shoes is a platform connecting buyers with verified sellers. 
              We do not own the products listed on our marketplace.
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}