"use client";

import React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  ShoppingBag,
  Sparkles,
  Bot,
  User,
  Loader2,
  ChevronRight,
  Zap,
  Search,
  Package,
  Palette
} from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string | React.ReactNode;
  timestamp?: Date;
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: ["Hi! I'm your Et.Shoes assistant 👟 Ask me about shoes, sizes, colors, or help finding products!"],
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  // Convert AI response into text + clickable links
  const parseReply = (text: string): React.ReactNode => {
    // Match AI product links in format /product/<uuid>
    const regex = /\/product\/([0-9a-f-]+)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    let match;
    while ((match = regex.exec(text)) !== null) {
      const beforeText = text.slice(lastIndex, match.index);
      if (beforeText) parts.push(<span key={lastIndex}>{beforeText}</span>);

      const productId = match[1];
      parts.push(
        <Link
          key={match.index}
          href={`/shop/product/${productId}`}
          className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1.5 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 ml-1 mr-1"
          onClick={() => setOpen(false)}
        >
          <ShoppingBag className="w-3 h-3 mr-1.5" />
          View Product
          <ChevronRight className="w-3 h-3 ml-1" />
        </Link>
      );

      lastIndex = match.index + match[0].length;
    }

    const remaining = text.slice(lastIndex);
    if (remaining) parts.push(<span key={lastIndex}>{remaining}</span>);

    return parts;
  };

  const simulateTyping = async (text: string): Promise<void> => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate typing delay
    setIsTyping(false);
    return Promise.resolve();
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { 
      role: "user", 
      content: input,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await res.json();
      
      // Simulate typing animation
      await simulateTyping(data.reply);
      
      const parsed = parseReply(data.reply);

      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: parsed,
          timestamp: new Date()
        },
      ]);
    } catch (err) {
      await simulateTyping("Something went wrong. Please try again.");
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: ["Something went wrong. Please try again."],
          timestamp: new Date()
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "Best shoes for running?",
    "Show me size 42 shoes",
    "Black color shoes available?",
    "What's the price range?"
  ];

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"></div>
        
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-7 h-7 text-white relative z-10" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-7 h-7 text-white relative z-10" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Notification dot */}
        {messages.length === 1 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-white"
          >
            <div className="w-full h-full animate-ping bg-red-400 rounded-full opacity-75"></div>
          </motion.div>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-32 right-6 z-50 w-[420px] h-[560px]"
          >
            <Card className="w-full h-full flex flex-col shadow-2xl border-0 overflow-hidden rounded-2xl bg-white">
              {/* Header */}
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">Et.Shoes Assistant</h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-blue-100 text-sm">Online • Ready to help</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div
                ref={scrollRef}
                className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white space-y-4"
              >
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 ${
                        m.role === "user"
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-br-none"
                          : "bg-white border border-gray-200 shadow-sm rounded-bl-none"
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center mr-2 ${
                          m.role === "user" ? "bg-white/20" : "bg-gradient-to-r from-blue-100 to-purple-100"
                        }`}>
                          {m.role === "user" ? (
                            <User className="w-3.5 h-3.5 text-white" />
                          ) : (
                            <Bot className="w-3.5 h-3.5 text-blue-600" />
                          )}
                        </div>
                        <span className={`text-sm font-medium ${m.role === "user" ? "text-white/90" : "text-gray-700"}`}>
                          {m.role === "user" ? "You" : "Shoe Assistant"}
                        </span>
                        {m.timestamp && (
                          <span className={`text-xs ml-auto ${m.role === "user" ? "text-white/70" : "text-gray-500"}`}>
                            {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      
                      <div className={m.role === "user" ? "text-white" : "text-gray-800"}>
                        {Array.isArray(m.content) ? m.content : m.content}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl rounded-bl-none p-4">
                      <div className="flex items-center mb-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mr-2">
                          <Bot className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Shoe Assistant</span>
                      </div>
                      <div className="flex space-x-1">
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Quick Questions */}
                {messages.length === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-2"
                  >
                    <p className="text-sm text-gray-500 font-medium px-2">Try asking:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {quickQuestions.map((question, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setInput(question);
                            setTimeout(() => sendMessage(), 100);
                          }}
                          className="text-left p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                        >
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mr-2">
                              {i === 0 ? <Zap className="w-3 h-3 text-blue-600" /> :
                               i === 1 ? <Package className="w-3 h-3 text-purple-600" /> :
                               i === 2 ? <Palette className="w-3 h-3 text-pink-600" /> :
                               <Search className="w-3 h-3 text-green-600" />}
                            </div>
                            <span className="text-sm text-gray-700 group-hover:text-gray-900">{question}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-100 bg-white">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about shoes, sizes, colors..."
                      onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
                      className="pl-12 pr-4 py-3 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                      disabled={loading}
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <MessageCircle className="w-5 h-5 text-gray-400" />
                    </div>
                    {input && (
                      <button
                        onClick={() => setInput("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  
                  <Button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    className="px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
                
                <div className="mt-3 flex items-center justify-center text-xs text-gray-500">
                  <Sparkles className="w-3 h-3 mr-1.5" />
                  <span>Powered by AI • Responses may take a moment</span>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
