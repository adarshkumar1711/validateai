'use client'

import { useState, useEffect } from 'react'
import { getAnonymousId } from '@/lib/utils'

interface UserStatus {
  validationCount: number
  isPaid: boolean
  subscriptionExpires: string | null
  canValidate: boolean
  hasActiveSubscription: boolean
}

export function useUser() {
  const [anonymousId, setAnonymousId] = useState<string>('')
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const id = getAnonymousId()
    setAnonymousId(id)
  }, [])

  const fetchUserStatus = async () => {
    if (!anonymousId) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/user/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ anonymousId }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user status')
      }

      const data = await response.json()
      setUserStatus(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (anonymousId) {
      fetchUserStatus()
    }
  }, [anonymousId])

  const refreshUserStatus = () => {
    fetchUserStatus()
  }

  return {
    anonymousId,
    userStatus,
    loading,
    error,
    refreshUserStatus,
  }
}