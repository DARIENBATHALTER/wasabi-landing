import { ChevronDown, Zap } from 'lucide-react'
import HeroProfileCard from '../components/HeroProfileCard'

export default function Hero() {
  return (
    <section
      className="relative flex items-center overflow-hidden"
      style={{ minHeight: 'calc(100vh / var(--page-zoom, 1))' }}
    >
      {/* Background — full green-tinted gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-wasabi-dark via-[#0f1f15] to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(0,136,0,0.12),transparent)]" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-wasabi-green/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-emerald-600/6 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #008800 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Florida silhouette — desktop */}
      <div className="hidden md:block absolute z-[5] left-[2%] w-[780px] h-[1092px] opacity-[0.2] pointer-events-none" style={{ top: '50%', transform: 'translateY(calc(-50% + 105px))' }}>
        <img src="/florida.svg" alt="" className="w-full h-full object-contain" />
      </div>
      {/* Florida silhouette — mobile: smaller, centered behind title */}
      <div className="md:hidden absolute z-[5] left-1/2 -translate-x-1/2 top-[12%] w-[280px] h-[392px] opacity-[0.15] pointer-events-none">
        <img src="/florida.svg" alt="" className="w-full h-full object-contain" />
      </div>

      {/* Content */}
      <div className="relative z-10 section-container py-24 md:py-32">
        {/* Title — full width, left aligned */}
        <div className="mb-10 md:mb-12 animate-fade-in">
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-[3.5rem] text-white tracking-tight leading-[1.12]">
            Actionable student insights from{' '}
            <span className="text-wasabi-green underline decoration-wasabi-green/60 underline-offset-4">all</span>{' '}
            of your data sources.
          </h1>
        </div>

        {/* Two columns: subtext + CTAs left, animated card right */}
        <div className="grid md:grid-cols-[5fr_5fr] gap-10 md:gap-8 items-center">
          {/* Left: subtext + CTAs — vertically centered */}
          <div className="animate-fade-in-up">
            <p className="text-base sm:text-lg text-gray-400 max-w-lg mb-8 leading-relaxed">
              <em className="text-gray-300">Built in Florida, for Florida schools.</em>
              <br /><br />
              WASABI isn't another KPI dashboard — it's a home base for everything you know
              about your students. Attendance, grades, assessments, observations, and professional
              development tools, all in one place — plus a fully FERPA-compliant AI assistant,
              Nori, who works as your personal data analyst.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <a
                href="/try"
                className="btn-primary text-lg !px-8 !py-4 shadow-lg shadow-wasabi-green/25 inline-flex items-center gap-2.5 group whitespace-nowrap"
              >
                <Zap className="w-5 h-5" />
                Try WASABI Now
              </a>
              <button
                onClick={() => document.querySelector('#cta')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary text-lg !px-8 !py-4 !border-gray-500 !text-gray-300 hover:!border-wasabi-green hover:!text-green-400 inline-flex items-center gap-2.5 whitespace-nowrap"
              >
                Get in Touch
              </button>
            </div>
          </div>

          {/* Right: Animated profile card — fixed height, card anchored at center */}
          <div className="relative h-[30rem] md:h-[26rem] overflow-hidden md:overflow-visible animate-fade-in">
            <div className="md:absolute md:inset-x-0 md:top-1/2 md:-translate-y-1/2 flex justify-center md:justify-center md:px-12">
              <div className="relative w-full max-w-xs md:max-w-sm">
                <HeroProfileCard />
                {/* Subtle glow behind the card */}
                <div className="absolute -inset-4 bg-wasabi-green/10 rounded-2xl blur-2xl -z-10" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={() => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })}
          className="text-gray-400 hover:text-wasabi-green transition-colors animate-bounce"
          aria-label="Scroll to features"
        >
          <ChevronDown size={32} />
        </button>
      </div>
    </section>
  )
}
