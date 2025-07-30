import Link from 'next/link'
import { ArrowLeft, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'

export default function ContactUsPage() {
  return (
    <div className="min-h-screen dark-gradient-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to ValidateAI
        </Link>

        {/* Content */}
        <div className="dark-card rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-6">📄 Contact Us</h1>
          
          <p className="text-gray-300 mb-8">
            If you have any questions about our policies, services, or payments, reach out to:
          </p>

          <div className="space-y-8">
            {/* Contact Info Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center mb-4">
                  <Mail className="h-6 w-6 text-blue-400 mr-3" />
                  <h3 className="text-lg font-semibold text-white">Email</h3>
                </div>
                <a 
                  href="mailto:adarshkumar1711@gmail.com"
                  className="text-blue-400 hover:text-blue-300 transition-colors text-lg"
                >
                  adarshkumar1711@gmail.com
                </a>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center mb-4">
                  <MapPin className="h-6 w-6 text-green-400 mr-3" />
                  <h3 className="text-lg font-semibold text-white">Location</h3>
                </div>
                <p className="text-gray-300">
                  India<br />
                  <span className="text-sm text-gray-400">(Online-only product)</span>
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center mb-4">
                  <Clock className="h-6 w-6 text-purple-400 mr-3" />
                  <h3 className="text-lg font-semibold text-white">Response Time</h3>
                </div>
                <p className="text-gray-300">Within 48 hours</p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center mb-4">
                  <MessageCircle className="h-6 w-6 text-orange-400 mr-3" />
                  <h3 className="text-lg font-semibold text-white">Support Hours</h3>
                </div>
                <p className="text-gray-300">
                  10 AM to 6 PM IST<br />
                  <span className="text-sm text-gray-400">Monday to Friday</span>
                </p>
              </div>
            </div>

            {/* Company Info */}
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-6 border border-blue-700/30">
              <h3 className="text-xl font-semibold text-white mb-4">Startup Idea Validator</h3>
              <p className="text-gray-300 mb-4">
                We're here to help you validate your startup ideas with AI-powered insights. 
                Whether you have questions about our service, need technical support, or want to 
                provide feedback, we're always happy to hear from you.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <span>✅ Service Questions</span>
                <span>✅ Payment Support</span>
                <span>✅ Technical Issues</span>
                <span>✅ Feature Requests</span>
                <span>✅ General Feedback</span>
              </div>
            </div>

            {/* Quick Contact */}
            <div className="text-center">
              <a
                href="mailto:adarshkumar1711@gmail.com?subject=ValidateAI Support Request"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all transform hover:scale-105"
              >
                <Mail className="h-5 w-5 mr-2" />
                Send us an Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}