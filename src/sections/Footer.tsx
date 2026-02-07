import { Heart } from 'lucide-react'

const footerLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Demo', href: '/wasabi-landing/try' },
  { label: 'About', href: '#about' },
]

export default function Footer() {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const el = document.querySelector(href)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <footer className="bg-wasabi-dark border-t border-gray-800">
      <div className="section-container py-12">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Left: Logo + Tagline */}
          <div className="flex items-center gap-3 md:justify-start justify-center">
            <img
              src="/wasabi-landing/wasabilogo.png"
              alt="WASABI Logo"
              className="w-8 h-8"
            />
            <div>
              <p className="font-display font-semibold text-white text-sm">WASABI</p>
              <p className="text-xs text-gray-400">Built with care for educators</p>
            </div>
          </div>

          {/* Center: Links */}
          <div className="flex items-center justify-center gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right: Copyright */}
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-400">
              &copy; 2025 WASABI. All rights reserved.
            </p>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-1.5">
            Made with{' '}
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />{' '}
            by educators who believe every student's story matters.
          </p>
        </div>
      </div>
    </footer>
  )
}
