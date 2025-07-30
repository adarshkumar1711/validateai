import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPolicyPage() {
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
          <h1 className="text-3xl font-bold text-white mb-6">📄 Privacy Policy</h1>
          
          <p className="text-gray-300 mb-6">
            <strong>Effective Date:</strong> July 30, 2025
          </p>

          <p className="text-gray-300 mb-8">
            This Privacy Policy describes how we collect, use, and protect your information when you use our service, Startup Idea Validator.
          </p>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Information We Collect</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>Personal Information:</strong> Your email address is collected during signup.</li>
                <li><strong>Payment Information:</strong> Razorpay processes all payments. We do not store any card or bank details.</li>
                <li><strong>Idea Submissions:</strong> Your idea inputs are stored to provide personalized feedback.</li>
                <li><strong>Analytics:</strong> We collect anonymized data for improving the platform.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. Use of Collected Information</h2>
              <p className="mb-2">We use your information to:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Authenticate users via Supabase</li>
                <li>Provide AI-generated feedback on your ideas</li>
                <li>Process and verify payment status</li>
                <li>Improve platform performance and experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. Data Sharing</h2>
              <p className="mb-2">We only share your data with:</p>
              <ul className="space-y-2 list-disc list-inside mb-4">
                <li>Razorpay for processing payments</li>
                <li>OpenAI or Gemini APIs for AI-powered analysis</li>
              </ul>
              <p>We do not sell or share your personal data with advertisers or third parties.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Data Security</h2>
              <p>We use secure systems including Supabase and HTTPS to protect your data.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Changes to Policy</h2>
              <p>This policy may be updated periodically. Continued use of the service implies acceptance of changes.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Contact</h2>
              <p>For questions about this policy, contact us at:</p>
              <p className="mt-2">
                📧 <a href="mailto:adarshkumar1711@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                  adarshkumar1711@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}