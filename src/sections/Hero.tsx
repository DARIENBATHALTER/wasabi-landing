import { ChevronDown } from 'lucide-react'

export default function Hero() {
  const scrollToFeatures = () => {
    const el = document.querySelector('#features')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-wasabi-dark via-gray-900 to-gray-900">
        {/* Subtle green tint in corner */}
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-green-900/20 to-transparent" />
        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #008800 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Gradient mesh accent */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-wasabi-green/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 section-container text-center px-4 py-20">
        {/* Logo */}
        <div className="mb-8">
          <img
            src="/wasabi-landing/wasabilogo.png"
            alt="WASABI Logo"
            className="w-20 h-20 mx-auto animate-float drop-shadow-[0_0_30px_rgba(0,136,0,0.3)]"
          />
        </div>

        {/* Title */}
        <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-4 animate-fade-in">
          <span className="gradient-text">W</span>ide{' '}
          <span className="gradient-text">A</span>rray{' '}
          <span className="gradient-text">S</span>tudent{' '}
          <span className="gradient-text">A</span>nalytics &{' '}
          <span className="gradient-text">B</span>enchmarking{' '}
          <span className="gradient-text">I</span>nterface
        </h1>

        {/* Tagline */}
        <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-6 animate-fade-in-up font-medium">
          See every student. Understand every story. Act before it's too late.
        </p>

        {/* Description */}
        <p className="text-base text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in-up leading-relaxed">
          The all-in-one analytics platform that brings together attendance, grades,
          assessments, and behavioral data — so you can focus on what matters most:
          your students.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
          <a
            href="/wasabi-landing/try"
            className="btn-primary text-lg !px-8 !py-4 shadow-lg shadow-wasabi-green/20"
          >
            Try WASABI
          </a>
          <button
            onClick={scrollToFeatures}
            className="btn-secondary text-lg !px-8 !py-4 !border-gray-500 !text-gray-300 hover:!border-wasabi-green hover:!text-green-400"
          >
            Learn More
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={scrollToFeatures}
          className="text-gray-400 hover:text-wasabi-green transition-colors animate-bounce"
          aria-label="Scroll to features"
        >
          <ChevronDown size={32} />
        </button>
      </div>
    </section>
  )
}
