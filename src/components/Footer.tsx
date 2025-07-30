import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  const footerLinks = [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms-conditions', label: 'Terms & Conditions' },
    { href: '/cancellation-refund', label: 'Cancellations and Refunds' },
    { href: '/shipping-policy', label: 'Shipping Policy' },
    { href: '/contact-us', label: 'Contact Us' },
  ]

  return (
    <footer className="border-t border-gray-800 bg-black/50 backdrop-blur-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {/* Logo/Brand */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">ValidateAI</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              AI-powered startup idea validation to help entrepreneurs make data-driven decisions
            </p>
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
            {footerLinks.map((link, index) => (
              <div key={link.href} className="flex items-center">
                <Link
                  href={link.href}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  {link.label}
                </Link>
                {index < footerLinks.length - 1 && (
                  <span className="ml-6 text-gray-600">•</span>
                )}
              </div>
            ))}
          </div>

          {/* Contact Info */}
          <div className="mb-8 space-y-2">
            <p className="text-gray-400 text-sm">
              📧 <a href="mailto:adarshkumar1711@gmail.com" className="hover:text-white transition-colors">
                adarshkumar1711@gmail.com
              </a>
            </p>
            <p className="text-gray-500 text-xs">
              Response time: Within 48 hours | Support: 10 AM - 6 PM IST (Mon-Fri)
            </p>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-6">
            <p className="text-gray-500 text-sm">
              © {currentYear} ValidateAI. All rights reserved. Made with ❤️ for entrepreneurs.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}