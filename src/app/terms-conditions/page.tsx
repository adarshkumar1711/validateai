import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsConditionsPage() {
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
          <h1 className="text-3xl font-bold text-white mb-6">📄 Terms and Conditions</h1>
          
          <p className="text-gray-300 mb-6">
            <strong>Effective Date:</strong> July 30, 2025
          </p>

          <p className="text-gray-300 mb-8">
            By accessing or using our platform (Startup Idea Validator), you agree to the following terms:
          </p>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Eligibility</h2>
              <p>You must be 18 years or older to use this service.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. Use of Service</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>You agree not to upload illegal, harmful, or infringing content.</li>
                <li>You are solely responsible for any decisions based on AI-generated feedback.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. Subscriptions</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>The service operates on a monthly subscription model.</li>
                <li>Payment is processed securely through Razorpay.</li>
                <li>Access is restricted if your subscription expires or fails.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">4. Intellectual Property</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>You retain full ownership of your submitted ideas.</li>
                <li>We only store ideas to deliver results; we do not reuse or share them.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">5. Limitation of Liability</h2>
              <p>The feedback provided is based on AI models and does not guarantee startup success.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">6. Changes to Terms</h2>
              <p>We reserve the right to modify these terms. Updated terms will be available on the website.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">7. Contact</h2>
              <p>
                For queries: 📧 <a href="mailto:adarshkumar1711@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors">
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