import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function CancellationRefundPage() {
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
          <h1 className="text-3xl font-bold text-white mb-6">📄 Cancellation and Refund Policy</h1>
          
          <p className="text-gray-300 mb-6">
            <strong>Effective Date:</strong> July 30, 2025
          </p>

          <p className="text-gray-300 mb-8">
            We believe in transparency and fair usage. Please read the following carefully.
          </p>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">1. Cancellation Policy</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>You may cancel your subscription anytime before the next billing cycle via the Razorpay dashboard or by contacting us at adarshkumar1711@gmail.com.</li>
                <li>Cancellation does not result in immediate refund but will stop future billing.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">2. Refund Policy</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>Refunds are only available within 7 days of the subscription purchase and only if you haven't used the service (no validation requests submitted).</li>
                <li>Refunds will be processed back to the original payment method within 7–10 working days, if approved.</li>
                <li>
                  To request a refund, email us at{' '}
                  <a href="mailto:adarshkumar1711@gmail.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                    adarshkumar1711@gmail.com
                  </a>{' '}
                  with your payment ID.
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}