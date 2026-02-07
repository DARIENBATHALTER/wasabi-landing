import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Demo', href: '/try' },
  { label: 'About', href: '#about' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileOpen])

  const handleLinkClick = (href: string) => {
    setIsMobileOpen(false)
    if (href.startsWith('#')) {
      const el = document.querySelector(href)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass-effect py-3 shadow-lg'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="section-container flex items-center justify-between">
          {/* Logo + Name */}
          <a href="/" className="flex items-center gap-2.5 group">
            <img
              src="/wasabilogo.png"
              alt="WASABI Logo"
              className={`transition-all duration-300 ${
                isScrolled ? 'w-8 h-8' : 'w-9 h-9'
              }`}
            />
            <span className="font-display font-bold text-xl text-gray-900 dark:text-white group-hover:text-wasabi-green transition-colors">
              WASABI
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith('#')) {
                    e.preventDefault()
                    handleLinkClick(link.href)
                  }
                }}
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-wasabi-green dark:hover:text-green-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="/try"
              className="btn-primary text-sm !px-5 !py-2.5"
            >
              Try WASABI
            </a>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Slide-in Menu */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <span className="font-display font-bold text-lg text-gray-900 dark:text-white">
            Menu
          </span>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex flex-col p-4 gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                if (link.href.startsWith('#')) {
                  e.preventDefault()
                  handleLinkClick(link.href)
                } else {
                  setIsMobileOpen(false)
                }
              }}
              className="px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <a
              href="/try"
              className="btn-primary block text-center"
              onClick={() => setIsMobileOpen(false)}
            >
              Try WASABI
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
