'use client'

import { useState, useEffect } from 'react'
import { useUser } from './useUser'

interface ValidationHistory {
  id: string
  idea_description: string
  gemini_analysis: any
  search_results: any
  created_at: string
}

export function useValidationHistory() {
  const { anonymousId } = useUser()
  const [validations, setValidations] = useState<ValidationHistory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchValidations = async () => {
    if (!anonymousId) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/user/validations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ anonymousId }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch validation history')
      }

      const data = await response.json()
      setValidations(data.validations)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (anonymousId) {
      fetchValidations()
    }
  }, [anonymousId])

  return {
    validations,
    loading,
    error,
    refreshValidations: fetchValidations,
  }
}