'use client'

import { useState } from 'react'
import { useUser } from './useUser'

interface ValidationResult {
  analysis: {
    oneLiner: string
    marketSize: string
    monetization: string[]
    competitors: string[]
    moat: string
    targetAudience: string
    risks: string[]
    swotAnalysis: {
      strengths: string[]
      weaknesses: string[]
      opportunities: string[]
      threats: string[]
    }
    investorFit: string
    nextSteps: string[]
    viabilityScore: string
  }
  searchResults: Array<{
    title: string
    link: string
    snippet: string
    displayLink: string
  }>
}

export function useValidation() {
  const { anonymousId, refreshUserStatus } = useUser()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ValidationResult | null>(null)

  const validateIdea = async (idea: string) => {
    if (!anonymousId || !idea.trim()) {
      setError('Please provide a valid idea description')
      return null
    }

    try {
      setLoading(true)
      setError(null)
      setResult(null)

      const response = await fetch('/api/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea: idea.trim(),
          anonymousId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle API errors gracefully
        if (data.analysis && data.searchResults) {
          // API returned structured error data, show it to user
          setResult(data)
          setError(data.error || 'Validation completed with warnings')
          return data
        } else {
          throw new Error(data.error || 'Validation failed')
        }
      }

      setResult(data)
      refreshUserStatus() // Refresh user status after validation
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    validateIdea,
    loading,
    error,
    result,
    setError,
    setResult,
  }
}