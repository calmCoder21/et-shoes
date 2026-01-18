"use client";

import { motion } from "framer-motion";
import { 
  Shield, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Scale, 
  TrendingUp,
  Lock,
  Globe,
  Calendar,
  ArrowRight
} from "lucide-react";

export default function TermsPage() {
  const termsSections = [
    {
      number: "01",
      icon: <Globe className="w-6 h-6" />,
      title: "About ET Shoes",
      content: "ET Shoes is an online marketplace that connects shoe sellers with customers. We do not sell shoes directly and we do not process payments on behalf of sellers.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50"
    },
    {
      number: "02",
      icon: <Users className="w-6 h-6" />,
      title: "User Accounts",
      content: "Sellers must register an account to list offers. All seller accounts are reviewed by our admin team before being approved. We reserve the right to approve, suspend, or remove accounts at our discretion.",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50"
    },
    {
      number: "03",
      icon: <Scale className="w-6 h-6" />,
      title: "Seller & Buyer Responsibility",
      content: "Buyers and sellers are responsible for all communication, transactions, and agreements made between them. ET Shoes is not responsible for disputes, losses, or damages arising from these interactions.",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50"
    },
    {
      number: "04",
      icon: <AlertCircle className="w-6 h-6" />,
      title: "Acceptable Use",
      content: "Users agree not to misuse the platform, provide false information, or engage in fraudulent or illegal activities.",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-50"
    },
    {
      number: "05",
      icon: <Shield className="w-6 h-6" />,
      title: "Limitation of Liability",
      content: "ET Shoes is provided 'as is'. We make no guarantees regarding product quality, availability, or seller behavior.",
      color: "from-red-500 to-rose-500",
      bgColor: "bg-gradient-to-br from-red-50 to-rose-50"
    },
    {
      number: "06",
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Changes to These Terms",
      content: "We may update these Terms of Service at any time. Continued use of the platform means you accept the updated terms.",
      color: "from-indigo-500 to-blue-500",
      bgColor: "bg-gradient-to-br from-indigo-50 to-blue-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-gray-900 via-black to-blue-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Legal Document</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Service</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Welcome to <strong className="text-white">ET Shoes</strong>. By accessing or using our platform,
              you agree to be bound by these Terms of Service.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Calendar className="w-5 h-5 text-blue-300 mr-3" />
                <div>
                  <p className="font-semibold">Last Updated</p>
                  <p className="text-sm text-blue-200">{new Date().getFullYear()}</p>
                </div>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Shield className="w-5 h-5 text-green-300 mr-3" />
                <div>
                  <p className="font-semibold">6 Key Sections</p>
                  <p className="text-sm text-green-200">Important to read</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 100C120 80 240 40 360 30C480 20 600 40 720 50C840 60 960 60 1080 40C1200 20 1320 0 1380 0H1440V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Quick Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-xl">
            <div className="p-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Important Notice</h3>
                  <p className="text-gray-700 text-lg">
                    This document outlines the rules and guidelines for using our platform. 
                    Please read these terms carefully before using ET Shoes.
                  </p>
                </div>
                <div className="flex items-center text-blue-600 font-semibold">
                  <span>Scroll to read all sections</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Terms Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {termsSections.map((section, index) => (
            <motion.div
              key={section.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className={`${section.bgColor} border-0 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full overflow-hidden`}>
                <div className="p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${section.color} flex items-center justify-center`}>
                        <div className="text-white">
                          {section.icon}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-1">Section {section.number}</div>
                      <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-6">{section.content}</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-gray-200/50">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${section.color}`}></div>
                      <div className="h-0.5 w-8 bg-gradient-to-r from-gray-200 to-gray-300 mx-2"></div>
                      <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                      <div className="h-0.5 w-8 bg-gradient-to-r from-gray-200 to-gray-300 mx-2"></div>
                      <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    </div>
                    <span className="text-2xl font-bold text-gray-300">{section.number}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Final Notice */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-br from-gray-900 to-black text-white border-0 shadow-2xl overflow-hidden">
            <div className="p-10">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-10 h-10 text-white" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-4">Your Agreement Matters</h3>
                  <p className="text-gray-300 mb-6">
                    By continuing to use ET Shoes, you acknowledge that you have read, understood, 
                    and agree to be bound by these Terms of Service. If you do not agree with any 
                    part of these terms, please discontinue use of our platform immediately.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">Read all sections carefully</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">Contact us with questions</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">Check for updates regularly</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="px-10 py-6 bg-gradient-to-r from-white/5 to-transparent border-t border-white/10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-400">
                    This document is legally binding. Please read it carefully.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">
                    Last updated: {new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <Card className="border border-gray-200 rounded-2xl shadow-sm">
            <div className="p-8 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Questions About Our Terms?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                If you have any questions or concerns about these Terms of Service, 
                please contact our support team before using the platform.
              </p>
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full">
                <span className="text-sm text-gray-700">For support:</span>
                <span className="font-semibold text-blue-600">support@etshoes.com</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// Card Component
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl ${className}`}>
    {children}
  </div>
);