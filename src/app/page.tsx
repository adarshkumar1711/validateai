'use client'

import { useState } from 'react'
import { ValidationForm } from '@/components/ValidationForm'
import { ValidationResults } from '@/components/ValidationResults'
import { ValidationHistory } from '@/components/ValidationHistory'
import { PayAsYouGoModal } from '@/components/PayAsYouGoModal'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { useUser } from '@/hooks/useUser'
import toast, { Toaster } from 'react-hot-toast'
import { History, Home, Sparkles } from 'lucide-react'

type View = 'home' | 'history'

export default function HomePage() {
  const [currentView, setCurrentView] = useState<View>('home')
  const [validationResult, setValidationResult] = useState<any>(null)
  const [showPayAsYouGoModal, setShowPayAsYouGoModal] = useState(false)
  const { userStatus, loading: userLoading } = useUser()

  const handleValidationComplete = (result: any) => {
    setValidationResult(result)
    toast.success('Your startup idea has been validated!')
  }

  const handleUpgradeRequired = () => {
    setShowPayAsYouGoModal(true)
  }

  const handleNewValidation = () => {
    setValidationResult(null)
    setCurrentView('home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-6 w-6 animate-pulse text-blue-500" />
          <span className="text-gray-600">Loading ValidateAI...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen dark-gradient-bg">
      <Toaster position="top-right" />
      
      {/* Navigation */}
      <nav className="bg-black/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold text-white">ValidateAI</span>
              </div>
              
              <div className="hidden md:flex space-x-4">
                <Button
                  onClick={() => {
                    setCurrentView('home')
                    setValidationResult(null)
                  }}
                  variant={currentView === 'home' ? 'default' : 'ghost'}
                  size="sm"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Validate
                </Button>
                <Button
                  onClick={() => setCurrentView('history')}
                  variant={currentView === 'history' ? 'default' : 'ghost'}
                  size="sm"
                >
                  <History className="h-4 w-4 mr-2" />
                  History
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                {userStatus ? (
                  userStatus.isPaid 
                    ? `${userStatus.validationCredits} validation credits remaining`
                    : `${Math.max(0, 3 - userStatus.validationCount)} free validations left`
                ) : (
                  '3 free validations'
                )}
              </div>
              {userStatus?.isPaid && (
                <div className="px-3 py-1 bg-gradient-to-r from-green-900 to-emerald-900 text-green-300 text-sm font-medium rounded-full border border-green-700">
                  Paid User
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16 md:pb-8 mobile-safe-area">
        {currentView === 'home' ? (
          <div className="space-y-12">
            {!validationResult ? (
              <ValidationForm
                onValidationComplete={handleValidationComplete}
                onUpgradeRequired={handleUpgradeRequired}
              />
            ) : (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold text-white">
                    Validation Results
                  </h1>
                  <Button
                    onClick={handleNewValidation}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Validate Another Idea
                  </Button>
                </div>
                <ValidationResults result={validationResult} />
              </div>
            )}
          </div>
        ) : (
          <ValidationHistory />
        )}
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden mobile-nav-fixed bg-black/90 backdrop-blur-sm border-t border-gray-800 px-4 py-3">
        <div className="flex items-center justify-around">
          <Button
            onClick={() => {
              setCurrentView('home')
              setValidationResult(null)
            }}
            variant={currentView === 'home' ? 'default' : 'ghost'}
            size="sm"
          >
            <Home className="h-4 w-4 mr-2" />
            Validate
          </Button>
          <Button
            onClick={() => setCurrentView('history')}
            variant={currentView === 'history' ? 'default' : 'ghost'}
            size="sm"
          >
            <History className="h-4 w-4 mr-2" />
            History
          </Button>
        </div>
      </div>

      {/* Mobile Spacer - ensures content is never hidden */}
      <div className="md:hidden h-24"></div>

      {/* Footer */}
      <Footer />

      {/* Pay As You Go Modal */}
      <PayAsYouGoModal
        isOpen={showPayAsYouGoModal}
        onClose={() => setShowPayAsYouGoModal(false)}
      />
    </div>
  )
}