"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Mail, AlertCircle, HelpCircle, Shield, Clock, MapPin } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const phone = "0922429417";
  const whatsappLink = `https://wa.me/251922429417?text=Hello%20I%20need%20help%20with%20ET%20Shoes`;
  const email = "support@etshoes.et";
  
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const contactReasons = [
    {
      icon: <HelpCircle className="h-5 w-5" />,
      title: "Product Questions",
      description: "Need details about size, availability, or condition?"
    },
    {
      icon: <AlertCircle className="h-5 w-5" />,
      title: "Report Issues",
      description: "Problem with a seller or listing? We'll investigate."
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Safety Concerns",
      description: "Report suspicious activity or safety issues"
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: "General Inquiries",
      description: "Partnerships, feedback, or other questions"
    }
  ];

  const faqs = [
    {
      question: "How quickly do you respond?",
      answer: "We aim to respond within 30 minutes during business hours (8AM - 8PM)."
    },
    {
      question: "Is WhatsApp support available 24/7?",
      answer: "WhatsApp messages are answered during business hours. For urgent issues outside hours, please call."
    },
    {
      question: "What information should I provide when reporting a seller?",
      answer: "Include the seller's username, listing link, and specific details about the issue."
    },
    {
      question: "Can I contact sellers directly?",
      answer: "Yes! Each listing has direct contact buttons. We only intervene if there are issues."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <div className="inline-flex items-center justify-center mb-4">
          <div className="text-4xl mr-3">👟</div>
          <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ET Shoes Support
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          We're Here to{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Help You
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
          If you have questions about our store, need to report a rude seller, 
          or need assistance with anything — we're just a message away.
        </p>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-sm font-medium text-red-600">
            Report issues immediately for quick resolution
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Main Contact Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Phone Card */}
          <Card className="p-8 space-y-6 text-center border-2 border-blue-200 hover:border-blue-400 transition-colors">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto">
              <Phone className="h-8 w-8 text-blue-600" />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-bold">Call Us Directly</h3>
              <p className="text-gray-600">
                Perfect for urgent issues or detailed discussions
              </p>
              <div 
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-transform"
                onClick={() => copyToClipboard(phone)}
              >
                {phone}
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  window.location.href = `tel:${phone}`;
                }}
              >
                <Phone className="mr-2 h-4 w-4" />
                Tap to Call Now
              </Button>
              <p className="text-sm text-gray-500">
                Available 8AM - 8PM, Monday to Saturday
              </p>
            </div>
          </Card>

          {/* WhatsApp Card */}
          <Card className="p-8 space-y-6 text-center border-2 border-green-200 hover:border-green-400 transition-colors">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto">
              <MessageCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-bold">WhatsApp Chat</h3>
              <p className="text-gray-600">
                Send photos, get quick answers, and track conversations
              </p>
              <Button
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                onClick={() => window.open(whatsappLink, '_blank')}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Start WhatsApp Chat
              </Button>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Typically replies within 15 minutes</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Email & Other Info */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Mail className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold">Email</h4>
                <p 
                  className="text-sm text-gray-600 cursor-pointer hover:text-purple-600"
                  onClick={() => copyToClipboard(email)}
                >
                  {email}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              For formal inquiries and documentation
            </p>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold">Response Time</h4>
                <p className="text-sm text-gray-600">Under 30 minutes</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              During business hours (8AM - 8PM)
            </p>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold">Based In</h4>
                <p className="text-sm text-gray-600">Addis Ababa, Ethiopia</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Serving customers across Ethiopia
            </p>
          </Card>
        </div>

        {/* When to Contact Us */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">When Should You Reach Out?</h2>
            <p className="text-gray-600">
              Here are common reasons our customers contact us
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactReasons.map((reason, index) => (
              <Card key={index} className="p-6 space-y-3 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    {reason.icon}
                  </div>
                  <h3 className="font-semibold">{reason.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{reason.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Emergency Notice */}
        <Card className="p-6 border-red-300 bg-red-50">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <AlertCircle className="h-8 w-8 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold text-lg text-red-800 mb-1">
                Urgent Safety Issues
              </h3>
              <p className="text-red-700">
                If you're in an unsafe situation or need immediate assistance, 
                please call us directly at <strong>{phone}</strong> or contact local authorities if necessary.
                Your safety is our priority.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => window.location.href = `tel:${phone}`}
              className="whitespace-nowrap"
            >
              Emergency Call
            </Button>
          </div>
        </Card>

        {/* Quick FAQs */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Quick Answers</h2>
            <p className="text-gray-600">
              Common questions about getting help
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6 space-y-3">
                <h3 className="font-semibold text-lg flex items-start gap-2">
                  <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-gray-600 pl-7">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Copy Feedback */}
        {copied && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
            Copied to clipboard! 📋
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}