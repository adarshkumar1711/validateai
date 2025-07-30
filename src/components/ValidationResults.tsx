'use client'

import { useState } from 'react'
import { 
  TrendingUp, 
  Target, 
  DollarSign, 
  Users, 
  Shield, 
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Star,
  BarChart3
} from 'lucide-react'

interface ValidationResultsProps {
  result: {
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
}

export function ValidationResults({ result }: ValidationResultsProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']))

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const { analysis, searchResults } = result

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Overview Section */}
      <div className="dark-card rounded-lg shadow-lg overflow-hidden">
        <button
          onClick={() => toggleSection('overview')}
          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center">
            <Star className="h-5 w-5 text-blue-400 mr-3" />
            <h2 className="text-xl font-semibold text-white">Overview</h2>
          </div>
          {expandedSections.has('overview') ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>
        
        {expandedSections.has('overview') && (
          <div className="px-6 pb-6 space-y-4">
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-4 rounded-lg border border-blue-700/30">
              <h3 className="font-medium text-white mb-2">One-Liner Pitch</h3>
              <p className="text-gray-300">{analysis.oneLiner}</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h3 className="font-medium text-white mb-2 flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2 text-green-400" />
                  Viability Score
                </h3>
                <p className="text-gray-300">{analysis.viabilityScore}</p>
              </div>
              
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h3 className="font-medium text-white mb-2 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-blue-400" />
                  Market Size
                </h3>
                <p className="text-gray-300">{analysis.marketSize}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Market Analysis */}
      <div className="dark-card rounded-lg shadow-lg overflow-hidden">
        <button
          onClick={() => toggleSection('market')}
          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center">
            <Target className="h-5 w-5 text-green-400 mr-3" />
            <h2 className="text-xl font-semibold text-white">Market Analysis</h2>
          </div>
          {expandedSections.has('market') ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>
        
        {expandedSections.has('market') && (
          <div className="px-6 pb-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-white mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-400" />
                  Target Audience
                </h3>
                <p className="text-gray-300">{analysis.targetAudience}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-white mb-2 flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-purple-400" />
                  Competitive Moat
                </h3>
                <p className="text-gray-300">{analysis.moat}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-white mb-2">Key Competitors</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.competitors.map((competitor, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm border border-gray-600"
                  >
                    {competitor}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Business Model */}
      <div className="dark-card rounded-lg shadow-lg overflow-hidden">
        <button
          onClick={() => toggleSection('business')}
          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-green-400 mr-3" />
            <h2 className="text-xl font-semibold text-white">Business Model</h2>
          </div>
          {expandedSections.has('business') ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>
        
        {expandedSections.has('business') && (
          <div className="px-6 pb-6 space-y-4">
            <div>
              <h3 className="font-medium text-white mb-2">Monetization Models</h3>
              <ul className="space-y-2">
                {analysis.monetization.map((model, index) => (
                  <li key={index} className="flex items-start">
                    <span className="block w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{model}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-700/30">
              <h3 className="font-medium text-white mb-2">Investor Fit</h3>
              <p className="text-gray-300">{analysis.investorFit}</p>
            </div>
          </div>
        )}
      </div>

      {/* SWOT Analysis */}
      <div className="dark-card rounded-lg shadow-lg overflow-hidden">
        <button
          onClick={() => toggleSection('swot')}
          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center">
            <BarChart3 className="h-5 w-5 text-purple-400 mr-3" />
            <h2 className="text-xl font-semibold text-white">SWOT Analysis</h2>
          </div>
          {expandedSections.has('swot') ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>
        
        {expandedSections.has('swot') && (
          <div className="px-6 pb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="p-4 bg-green-900/30 rounded-lg border border-green-700/30">
                  <h3 className="font-medium text-green-300 mb-2">Strengths</h3>
                  <ul className="space-y-1">
                    {analysis.swotAnalysis.strengths.map((strength, index) => (
                      <li key={index} className="text-green-200 text-sm">• {strength}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-4 bg-blue-900/30 rounded-lg border border-blue-700/30">
                  <h3 className="font-medium text-blue-300 mb-2">Opportunities</h3>
                  <ul className="space-y-1">
                    {analysis.swotAnalysis.opportunities.map((opportunity, index) => (
                      <li key={index} className="text-blue-200 text-sm">• {opportunity}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-amber-900/30 rounded-lg border border-amber-700/30">
                  <h3 className="font-medium text-amber-300 mb-2">Weaknesses</h3>
                  <ul className="space-y-1">
                    {analysis.swotAnalysis.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-amber-200 text-sm">• {weakness}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-4 bg-red-900/30 rounded-lg border border-red-700/30">
                  <h3 className="font-medium text-red-300 mb-2">Threats</h3>
                  <ul className="space-y-1">
                    {analysis.swotAnalysis.threats.map((threat, index) => (
                      <li key={index} className="text-red-200 text-sm">• {threat}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Risks & Next Steps */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="dark-card rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
            Key Risks
          </h2>
          <ul className="space-y-2">
            {analysis.risks.map((risk, index) => (
              <li key={index} className="flex items-start">
                <span className="block w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-gray-300 text-sm">{risk}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="dark-card rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 text-green-400 mr-3" />
            Next Steps
          </h2>
          <ul className="space-y-2">
            {analysis.nextSteps.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="flex items-center justify-center w-6 h-6 bg-green-800 text-green-300 rounded-full text-xs font-medium mr-3 flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-gray-300 text-sm">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Market Research */}
      {searchResults && searchResults.length > 0 && (
        <div className="dark-card rounded-lg shadow-lg overflow-hidden">
          <button
            onClick={() => toggleSection('research')}
            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex items-center">
              <ExternalLink className="h-5 w-5 text-indigo-400 mr-3" />
              <h2 className="text-xl font-semibold text-white">
                Market Research ({searchResults.length} results)
              </h2>
            </div>
            {expandedSections.has('research') ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </button>
          
          {expandedSections.has('research') && (
            <div className="px-6 pb-6">
              <div className="space-y-4">
                {searchResults.map((result, index) => (
                  <div key={index} className="border border-gray-700 rounded-lg p-4 hover:bg-gray-800/50 transition-colors bg-gray-800/30">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-white mb-1 line-clamp-2">
                          {result.title}
                        </h3>
                        <p className="text-sm text-gray-300 mb-2 line-clamp-3">
                          {result.snippet}
                        </p>
                        <div className="flex items-center text-xs text-gray-400">
                          <span>{result.displayLink}</span>
                        </div>
                      </div>
                      <a
                        href={result.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 p-2 text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}