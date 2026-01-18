import { 
  Shield, 
  Lock, 
  Eye, 
  Users, 
  Database, 
  FileText,
  CheckCircle,
  AlertTriangle,
  Mail,
  Phone,
  Globe
} from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Shield className="w-8 h-8" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Privacy Policy
          </h1>
          
          <p className="text-xl text-blue-100 text-center max-w-3xl mx-auto">
            Your privacy is important to us. This Privacy Policy explains how{" "}
            <strong className="text-white font-semibold">ET Shoes</strong> collects and uses your information.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Section 1 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mr-4">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">1. Information We Collect</h2>
                    <p className="text-gray-600">What data we gather from you</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 text-lg leading-relaxed">
                  We may collect basic information such as your name, email address,
                  and contact details when you register or use our platform.
                </p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center mb-2">
                      <Mail className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="font-medium text-gray-900">Email Address</span>
                    </div>
                    <p className="text-sm text-gray-600">For account creation and notifications</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <div className="flex items-center mb-2">
                      <Phone className="w-5 h-5 text-purple-600 mr-2" />
                      <span className="font-medium text-gray-900">Contact Details</span>
                    </div>
                    <p className="text-sm text-gray-600">For direct buyer-seller communication</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mr-4">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">2. How We Use Your Information</h2>
                    <p className="text-gray-600">Purpose of data collection</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 text-lg leading-relaxed">
                  Your information is used to manage accounts, display seller contact
                  details, and improve platform functionality.
                </p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Account management and authentication</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Facilitating buyer-seller communication</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Platform improvement and analytics</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Section 3 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">3. Seller Contact Information</h2>
                    <p className="text-gray-600">Visibility of contact details</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 text-lg leading-relaxed">
                  Seller contact information (such as phone or WhatsApp) is visible to
                  customers by design to enable direct communication.
                </p>
                <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0" />
                    <p className="text-amber-800 font-medium">
                      Important: Seller contact information is public by design to facilitate direct transactions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-red-50 to-rose-50 p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 flex items-center justify-center mr-4">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">4. Data Sharing</h2>
                    <p className="text-gray-600">How we handle your data</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 text-lg leading-relaxed">
                  We do not sell or rent user data to third parties. We only share data
                  when required to operate the platform or comply with the law.
                </p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                    <h4 className="font-semibold text-red-800 mb-2">We DO NOT</h4>
                    <ul className="space-y-1 text-sm text-red-700">
                      <li className="flex items-center">
                        <XIcon className="w-4 h-4 mr-2" />
                        Sell user data
                      </li>
                      <li className="flex items-center">
                        <XIcon className="w-4 h-4 mr-2" />
                        Rent user data
                      </li>
                      <li className="flex items-center">
                        <XIcon className="w-4 h-4 mr-2" />
                        Share with advertisers
                      </li>
                    </ul>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                    <h4 className="font-semibold text-green-800 mb-2">We ONLY share</h4>
                    <ul className="space-y-1 text-sm text-green-700">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        For platform operation
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Legal compliance
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        User consent
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-4">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">5. Data Security</h2>
                    <p className="text-gray-600">How we protect your information</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 text-lg leading-relaxed">
                  We use trusted third-party services to securely store
                  and manage user data.
                </p>
                <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                        <Database className="w-6 h-6 text-blue-600" />
                      </div>
                      <p className="font-semibold text-gray-900">Encrypted Storage</p>
                      <p className="text-sm text-gray-600">All data is encrypted</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-green-600" />
                      </div>
                      <p className="font-semibold text-gray-900">Secure Authentication</p>
                      <p className="text-sm text-gray-600">Protected access controls</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-purple-600" />
                      </div>
                      <p className="font-semibold text-gray-900">Regular Audits</p>
                      <p className="text-sm text-gray-600">Security compliance checks</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 6 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-gray-600 to-blue-600 flex items-center justify-center mr-4">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">6. Your Rights</h2>
                    <p className="text-gray-600">Control over your data</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 text-lg leading-relaxed">
                  You may request account deletion or data removal by contacting our
                  support team.
                </p>
                <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-4">You have the right to:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center p-3 bg-white rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="font-medium">Access your data</span>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="font-medium">Update information</span>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="font-medium">Delete account</span>
                    </div>
                    <div className="flex items-center p-3 bg-white rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="font-medium">Data export</span>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
                    <p className="text-blue-700 font-medium">
                      Contact our support team for any data-related requests or questions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Key Points */}
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-600" />
                Key Points
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Seller contacts are public for direct communication</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">We never sell your data to third parties</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Enterprise-grade security measures</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-700">Full control over your data rights</span>
                </li>
              </ul>
            </div>

            {/* Contact Card */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Questions?</h3>
              <p className="text-gray-700 mb-4">
                If you have any questions about our Privacy Policy, please contact us.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <Mail className="w-4 h-4 mr-2 text-blue-600" />
                  <span>support@etshoes.com</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FileText className="w-4 h-4 mr-2 text-blue-600" />
                  <span>Terms of Service</span>
                </div>
              </div>
            </div>

            {/* Update Card */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Last Updated</h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">{new Date().getFullYear()}</div>
              <p className="text-gray-600 text-sm">
                This policy is reviewed and updated regularly to ensure compliance with best practices and regulations.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Our Commitment</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">100%</div>
                  <div className="text-xs text-gray-600">No Data Selling</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">24/7</div>
                  <div className="text-xs text-gray-600">Data Protection</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600">
            By using ET Shoes, you acknowledge that you have read and understood this Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper component for X icon
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);