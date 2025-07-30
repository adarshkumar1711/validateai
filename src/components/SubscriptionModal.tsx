'use client'

import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useSubscription } from '@/hooks/useSubscription'
import { Check, Crown, Zap, TrendingUp, Shield } from 'lucide-react'

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function SubscriptionModal({ isOpen, onClose, onSuccess }: SubscriptionModalProps) {
  const { handlePayment, loading, error, setError } = useSubscription()
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => setRazorpayLoaded(true)
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleSubscribe = async () => {
    if (!razorpayLoaded) {
      setError('Payment system is loading. Please try again.')
      return
    }

    setError(null)
    const success = await handlePayment()
    if (success) {
      onSuccess?.()
      onClose()
    }
  }

  const features = [
    {
      icon: <Zap className="h-5 w-5 text-yellow-500" />,
      title: "Unlimited Validations",
      description: "Validate as many startup ideas as you want"
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-green-500" />,
      title: "Advanced Market Research",
      description: "Deep market insights and competitor analysis"
    },
    {
      icon: <Shield className="h-5 w-5 text-blue-500" />,
      title: "Priority Support",
      description: "Get help when you need it most"
    },
    {
      icon: <Crown className="h-5 w-5 text-purple-500" />,
      title: "Detailed Reports",
      description: "Export and save your validation reports"
    }
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
      <div className="text-center">
        {/* Header */}
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Upgrade to ValidateAI Pro
          </h2>
          <p className="text-gray-300">
            You've reached your free validation limit. Upgrade for unlimited access.
          </p>
        </div>

        {/* Pricing */}
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-6 mb-6 border border-blue-700/30">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">
              ₹1,228
              <span className="text-lg font-normal text-gray-300">/month</span>
            </div>
            <div className="text-sm text-gray-400 mb-4">
              That's just ₹40 per day for unlimited validations
            </div>
            <div className="inline-flex items-center px-3 py-1 bg-green-900/50 text-green-300 text-sm font-medium rounded-full border border-green-700">
              <Check className="h-4 w-4 mr-1" />
              30-day money-back guarantee
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start text-left">
              <div className="flex-shrink-0 mr-3 mt-0.5">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-medium text-white">{feature.title}</h3>
                <p className="text-sm text-gray-300">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <div className="text-red-300 text-sm space-y-2">
              {error.includes('Setup Required:') ? (
                <div>
                  <p className="font-medium mb-2">{error.split('\n\n')[0]}</p>
                  <div className="bg-red-800/30 p-3 rounded border border-red-600">
                    <p className="font-medium mb-2">Setup Required:</p>
                    <ol className="text-xs space-y-1 list-decimal list-inside">
                      {error.split('Setup Required:\n')[1]?.split('\n').map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              ) : (
                <p>{error}</p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleSubscribe}
            loading={loading}
            disabled={!razorpayLoaded}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 text-lg font-medium"
          >
            {loading ? 'Processing...' : 'Upgrade Now'}
          </Button>
          
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full text-gray-300 hover:text-white"
            disabled={loading}
          >
            Maybe Later
          </Button>
        </div>

        {/* Security Note */}
        <div className="mt-6 pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-400 flex items-center justify-center">
            <Shield className="h-3 w-3 mr-1" />
            Secured by Razorpay. Your payment information is safe.
          </p>
        </div>
      </div>
    </Modal>
  )
}