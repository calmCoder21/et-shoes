import { Card } from "@/components/ui/card";
import { CheckCircle, Users, Shield, ShoppingBag, Target, Heart, Globe, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  const features = [
    {
      icon: <ShoppingBag className="h-6 w-6" />,
      title: "Verified Local Sellers",
      description: "Every seller is verified to ensure genuine products and reliable service"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "No Fake Listings",
      description: "We manually verify each listing to maintain platform integrity"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Direct Communication",
      description: "Connect directly with sellers via WhatsApp or phone call"
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Simple & Transparent",
      description: "No forced accounts, no hidden fees, just real shoes & real prices"
    }
  ];

  const stats = [
    { value: "500+", label: "Trusted Sellers" },
    { value: "10K+", label: "Shoes Listed" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "24/7", label: "Platform Access" }
  ];

  const values = [
    {
      title: "Local Focus",
      description: "Built specifically for Ethiopian buying habits and preferences",
      icon: "🇪🇹"
    },
    {
      title: "Seller Growth",
      description: "Helping local businesses reach more customers",
      icon: "📈"
    },
    {
      title: "Customer Trust",
      description: "Creating a safe, reliable marketplace for everyone",
      icon: "🤝"
    },
    {
      title: "Community First",
      description: "Supporting local economy and entrepreneurship",
      icon: "👥"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 pt-16 pb-24">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-300/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="text-4xl mr-3">👟</div>
            <span className="text-3xl font-bold text-white">ET Shoes</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            More Than Just
            <span className="block bg-gradient-to-r from-orange-300 to-yellow-300 bg-clip-text text-transparent">
              A Marketplace
            </span>
          </h1>
          
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            We're revolutionizing how Ethiopia discovers and buys shoes — connecting genuine local sellers with passionate buyers in a trusted community.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/shop">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Start Shopping
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline" className="border-white text-black hover:bg-white/10 hover:text-white">
                Become a Seller
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative -mt-8 max-w-6xl mx-auto px-4">
        <Card className="p-8 shadow-2xl border border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-600 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16 space-y-16">
        {/* Our Story */}
        <section className="space-y-6">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">OUR MISSION</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">The ET Shoes Story</h2>
          </div>

          <Card className="p-8 md:p-10 space-y-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl mt-2">✨</div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Born from a Simple Idea</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  <strong className="text-gray-900">ET Shoes</strong> was founded on a simple realization: 
                  Finding the perfect pair of shoes in Ethiopia shouldn't require visiting dozens of shops 
                  or endlessly scrolling through social media. We saw the gap between dedicated local sellers 
                  and eager buyers, and decided to build a bridge.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  For Buyers
                </h3>
                <p className="text-gray-700">
                  We bring together thousands of shoe options from verified local sellers — 
                  complete with real photos, accurate sizes, transparent prices, and direct contact details. 
                  No more guesswork, just great shoes.
                </p>
                <ul className="space-y-2">
                  {[
                    "Browse shoes from multiple sellers in one place",
                    "Compare prices and styles easily",
                    "Contact sellers directly via WhatsApp or phone",
                    "No account required to browse"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  For Sellers
                </h3>
                <p className="text-gray-700">
                  We provide local shoe sellers with a dedicated platform to showcase their inventory, 
                  reach more customers, and grow their business — all without complicated fees or 
                  restrictive requirements.
                </p>
                <ul className="space-y-2">
                  {[
                    "Reach customers across Ethiopia",
                    "Showcase your entire inventory",
                    "Get direct customer inquiries",
                    "Simple listing process, no technical skills needed"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </section>

        {/* Features */}
        <section className="space-y-6">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">WHY CHOOSE US</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Built Differently for Ethiopia</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 space-y-4 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-blue-600">{feature.icon}</div>
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
              <Heart className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">OUR VALUES</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">What Drives Us Forward</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="p-6 text-center space-y-4 hover:border-blue-300 transition-colors duration-300">
                <div className="text-4xl">{value.icon}</div>
                <h3 className="font-bold text-xl">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <Card className="p-10 text-center space-y-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100">
          <div className="text-5xl">👟</div>
          <h2 className="text-3xl font-bold">Ready to Step Into</h2>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            The Future of Shoe Shopping?
          </h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Join thousands of Ethiopians who've found their perfect pair through ET Shoes.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/shop">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Explore Shoes
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600">
                Contact Us
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}