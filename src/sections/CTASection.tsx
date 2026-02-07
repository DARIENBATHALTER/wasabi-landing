import { ArrowRight, Mail } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

export default function CTASection() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="cta" className="py-24 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-wasabi-green/5 rounded-full blur-3xl" />

      <div
        ref={ref}
        className={`section-container relative z-10 text-center transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-gray-900 dark:text-white mb-6 leading-tight">
          Ready to see your students'{' '}
          <span className="gradient-text">full story</span>?
        </h2>

        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-4">
          WASABI is built and supported in Florida by educators who know your
          systems, your challenges, and your students. When you work with us,
          you're not a ticket number — you're a partner.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 max-w-lg mx-auto mb-10">
          Try the interactive demo — no signup required.
        </p>

        <div className="flex flex-col items-center gap-4">
          <a
            href="/try"
            className="btn-primary text-xl !px-10 !py-5 shadow-lg shadow-wasabi-green/25 inline-flex items-center gap-3 group"
          >
            Try WASABI
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="mailto:hello@wasabi.education?subject=WASABI%20Demo%20Request"
            className="btn-secondary text-lg !px-10 !py-4 inline-flex items-center gap-2.5 group"
          >
            <Mail className="w-5 h-5" />
            Schedule a Live Demo
          </a>

          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            Or email us directly at{' '}
            <a
              href="mailto:hello@wasabi.education"
              className="text-wasabi-green hover:text-green-700 dark:hover:text-green-400 font-medium transition-colors"
            >
              hello@wasabi.education
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
