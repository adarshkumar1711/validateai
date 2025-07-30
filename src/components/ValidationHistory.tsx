'use client'

import { useState } from 'react'
import { useValidationHistory } from '@/hooks/useValidationHistory'
import { formatDate, truncateText } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { ValidationResults } from './ValidationResults'
import { 
  History, 
  Calendar, 
  ChevronRight, 
  FileText, 
  BarChart3,
  RefreshCw
} from 'lucide-react'

export function ValidationHistory() {
  const { validations, loading, error, refreshValidations } = useValidationHistory()
  const [selectedValidation, setSelectedValidation] = useState<any>(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-300">Loading history...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">{error}</p>
        <Button onClick={refreshValidations} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  if (selectedValidation) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setSelectedValidation(null)}
            variant="ghost"
            className="text-gray-300 hover:text-white"
          >
            ← Back to History
          </Button>
          <div className="text-sm text-gray-400">
            {formatDate(selectedValidation.created_at)}
          </div>
        </div>
        
        <ValidationResults 
          result={{
            analysis: selectedValidation.gemini_analysis,
            searchResults: selectedValidation.search_results
          }}
        />
      </div>
    )
  }

  if (validations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <History className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No Validations Yet</h3>
        <p className="text-gray-300 mb-4">
          Start validating your startup ideas to see them here.
        </p>
        <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Validate Your First Idea
        </Button>
      </div>
    )
  }

  return (
          <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <History className="h-6 w-6 mr-2 text-blue-400" />
            Validation History
          </h2>
          <Button
            onClick={refreshValidations}
            variant="outline"
            size="sm"
            className="text-gray-300 border-gray-600 hover:bg-gray-800"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

      <div className="grid gap-4">
        {validations.map((validation) => (
          <div
            key={validation.id}
            className="dark-card rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer card-hover"
            onClick={() => setSelectedValidation(validation)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <FileText className="h-4 w-4 text-blue-400 mr-2" />
                  <span className="text-sm text-gray-400 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(validation.created_at)}
                  </span>
                </div>
                
                <h3 className="font-medium text-white mb-2 line-clamp-2">
                  {validation.gemini_analysis?.oneLiner || 'Startup Idea Analysis'}
                </h3>
                
                <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                  {truncateText(validation.idea_description, 200)}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    {validation.gemini_analysis?.viabilityScore && (
                      <div className="flex items-center">
                        <BarChart3 className="h-3 w-3 mr-1" />
                        Score: {validation.gemini_analysis.viabilityScore}
                      </div>
                    )}
                    {validation.search_results?.length > 0 && (
                      <div>
                        {validation.search_results.length} market sources
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center text-blue-400 text-sm font-medium">
                    View Details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}