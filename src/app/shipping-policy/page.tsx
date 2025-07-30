import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ShippingPolicyPage() {
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
          <h1 className="text-3xl font-bold text-white mb-6">📄 Shipping Policy</h1>
          
          <p className="text-gray-300 mb-6">
            <strong>Effective Date:</strong> July 30, 2025
          </p>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Nature of the Product</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>We offer digital-only services. No physical shipping is required.</li>
                <li>All features are accessible via your dashboard after successful login and subscription.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. Delivery Timeline</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>Access is typically granted instantly after payment confirmation.</li>
                <li>In rare cases of delay, access will be provided within 24 hours.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">3. Contact</h2>
              <p>
                For delivery issues, contact us at: 📧{' '}
                <a href="mailto:adarshkumar1711@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors">
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