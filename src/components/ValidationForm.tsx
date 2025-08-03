'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useValidation } from '@/hooks/useValidation'
import { useUser } from '@/hooks/useUser'
import { Lightbulb, Sparkles } from 'lucide-react'

interface ValidationFormProps {
  onValidationComplete: (result: any) => void
  onUpgradeRequired: () => void
}

export function ValidationForm({ onValidationComplete, onUpgradeRequired }: ValidationFormProps) {
  const [idea, setIdea] = useState('')
  const { validateIdea, loading, error } = useValidation()
  const { userStatus } = useUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!idea.trim()) return
    
    // Check if user can validate
    if (userStatus && !userStatus.canValidate) {
      onUpgradeRequired()
      return
    }

    const result = await validateIdea(idea)
    if (result) {
      onValidationComplete(result)
    }
  }

  const remainingValidations = userStatus 
    ? (userStatus.isPaid 
        ? userStatus.validationCredits 
        : Math.max(0, 3 - userStatus.validationCount)
      )
    : 3
  
  const showLimitWarning = userStatus && remainingValidations <= 1

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
            <Lightbulb className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">
          ValidateAI
        </h1>
        <p className="text-xl text-gray-300 mb-2">
          Validate your startup idea with AI-powered insights
        </p>
        <p className="text-gray-400">
          Get comprehensive analysis and real-time market research in seconds
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe your startup idea in detail. What problem does it solve? Who is your target audience? What makes it unique?"
            className="w-full min-h-[120px] p-4 text-lg bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all text-white placeholder-gray-400"
            maxLength={1000}
            disabled={loading}
          />
          <div className="absolute bottom-3 right-3 text-sm text-gray-500">
            {idea.length}/1000
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {showLimitWarning && (
          <div className="p-4 bg-amber-900/50 border border-amber-700 rounded-lg">
            <p className="text-amber-300 text-sm">
              ⚠️ You have {remainingValidations} {userStatus?.isPaid ? 'credit' : 'free validation'}{remainingValidations !== 1 ? 's' : ''} remaining. 
              {!userStatus?.isPaid && 'Contact us for more validations.'}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="text-sm text-gray-400">
            {userStatus?.isPaid ? (
              <span className="text-green-400 font-medium">✓ Paid User - {remainingValidations} credits remaining</span>
            ) : (
              <span>
                Free tier: {remainingValidations} validation{remainingValidations !== 1 ? 's' : ''} remaining
              </span>
            )}
          </div>
          
          <Button
            type="submit"
            size="lg"
            loading={loading}
            disabled={!idea.trim() || loading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg font-medium"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            {loading ? 'Analyzing...' : 'Validate Idea'}
          </Button>
        </div>
      </form>
    </div>
  )
}