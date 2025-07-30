'use client'

import { useState } from 'react'
import { useUser } from './useUser'

declare global {
  interface Window {
    Razorpay: any
  }
}

export function useSubscription() {
  const { anonymousId, refreshUserStatus } = useUser()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createSubscription = async () => {
    if (!anonymousId) {
      setError('User not initialized')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ anonymousId }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle specific error types
        if (data.error === 'Subscription plan not found') {
          setError(`${data.message}\n\nSetup Required:\n${data.instructions?.join('\n') || 'Please contact support.'}`)
        } else if (data.error === 'Payment system not configured') {
          setError(data.message || 'Payment system is not configured yet.')
        } else {
          setError(data.message || 'Failed to create subscription')
        }
        return null
      }

      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async (): Promise<boolean> => {
    return new Promise(async (resolve) => {
      const subscriptionData = await createSubscription()
      if (!subscriptionData) {
        resolve(false)
        return
      }

      const options = {
        key: subscriptionData.razorpayKeyId,
        subscription_id: subscriptionData.subscriptionId,
        name: subscriptionData.name,
        description: subscriptionData.description,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/subscription/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
                anonymousId,
              }),
            })

            if (verifyResponse.ok) {
              refreshUserStatus()
              resolve(true)
            } else {
              throw new Error('Payment verification failed')
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Payment verification failed')
            resolve(false)
          }
        },
        prefill: {
          name: 'ValidateAI User',
          email: '',
        },
        theme: {
          color: '#000000',
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
            resolve(false)
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    })
  }

  return {
    handlePayment,
    loading,
    error,
    setError,
  }
}