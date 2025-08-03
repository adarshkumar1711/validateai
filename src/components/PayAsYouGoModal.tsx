'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Mail, X } from 'lucide-react'

interface PayAsYouGoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PayAsYouGoModal({ isOpen, onClose }: PayAsYouGoModalProps) {
  const [isOpening, setIsOpening] = useState(false)

  const handleContactUs = () => {
    setIsOpening(true)
    
    // Gmail compose URL with pre-filled data
    const gmailComposeUrl = `https://mail.google.com/mail/u/0/?fs=1&to=adarshkumar1711@gmail.com&su=Subscription&body=How many estimated number of queries do you want in a month?&tf=cm`
    
    // Open Gmail in new tab
    window.open(gmailComposeUrl, '_blank')
    
    // Close modal after opening Gmail
    setTimeout(() => {
      setIsOpening(false)
      onClose()
    }, 1000)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Content */}
        <div className="text-center p-6">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-6">
            <Mail className="h-8 w-8 text-white" />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-white mb-4">
            Free Trial Exhausted
          </h3>

          {/* Description */}
          <div className="space-y-4 mb-8">
            <p className="text-gray-300 text-lg leading-relaxed">
              You have exhausted your <span className="font-semibold text-blue-400">free trial</span> and we have a{' '}
              <span className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                pay as you go model
              </span>
            </p>
            
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <p className="text-gray-400 text-sm">
                Get in touch with us to discuss your validation needs and we'll create a custom plan for you.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="space-y-4">
            <Button
              onClick={handleContactUs}
              disabled={isOpening}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              {isOpening ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Opening Gmail...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Us
                </div>
              )}
            </Button>
            
            <p className="text-xs text-gray-500">
              This will open Gmail with a pre-filled message
            </p>
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-lg pointer-events-none" />
      </div>
    </Modal>
  )
}