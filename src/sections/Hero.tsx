import { useState, useEffect, useCallback, useRef } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'

const HERO_COUNT = 16
const START_IMAGE = 12 // always start on the colorful one

// Build and shuffle hero images, but always start on #9
const heroImages = (() => {
  const imgs = Array.from({ length: HERO_COUNT }, (_, i) =>
    `/wasabi-landing/hero/hero-${String(i + 1).padStart(2, '0')}.png`
  )
  const starter = imgs.splice(START_IMAGE - 1, 1)[0]
  // Shuffle the rest
  for (let i = imgs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [imgs[i], imgs[j]] = [imgs[j], imgs[i]]
  }
  // Put #9 at the front
  imgs.unshift(starter)
  return imgs
})()

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(1)
  const [isFading, setIsFading] = useState(false)
  const [modalIndex, setModalIndex] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval>>(null)

  // Preload the next image so there's no grey flash
  useEffect(() => {
    const upcoming = (activeIndex + 1) % heroImages.length
    const img = new Image()
    img.src = heroImages[upcoming]
  }, [activeIndex])

  const advanceSlide = useCallback(() => {
    const next = (activeIndex + 1) % heroImages.length
    setNextIndex(next)
    setIsFading(true)
  }, [activeIndex])

  // When fade-out completes, swap active to next
  const handleTransitionEnd = useCallback(() => {
    if (isFading) {
      setActiveIndex(nextIndex)
      setIsFading(false)
    }
  }, [isFading, nextIndex])

  // Auto-advance every 5 seconds, pause when modal is open
  useEffect(() => {
    if (modalIndex !== null) return
    timerRef.current = setInterval(advanceSlide, 5000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [advanceSlide, modalIndex])

  // Modal navigation
  const modalPrev = useCallback(() => {
    setModalIndex(prev => prev === null ? null : (prev - 1 + heroImages.length) % heroImages.length)
  }, [])
  const modalNext = useCallback(() => {
    setModalIndex(prev => prev === null ? null : (prev + 1) % heroImages.length)
  }, [])

  // Keyboard nav for modal
  useEffect(() => {
    if (modalIndex === null) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalIndex(null)
      if (e.key === 'ArrowLeft') modalPrev()
      if (e.key === 'ArrowRight') modalNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [modalIndex, modalPrev, modalNext])

  const scrollToFeatures = () => {
    const el = document.querySelector('#features')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
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

      {/* Content */}
      <div className="relative z-10 section-container py-24 lg:py-32">
        <div className="grid lg:grid-cols-[5fr_8fr] gap-10 lg:gap-12 items-center">
          {/* Left: Text content (compact) */}
          <div className="text-left">
            <div className="flex items-center gap-3 mb-5">
              <img
                src="/wasabi-landing/wasabilogo.png"
                alt="WASABI Logo"
                className="w-12 h-12 drop-shadow-[0_0_20px_rgba(0,136,0,0.3)]"
              />
            </div>

            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-2 tracking-tight animate-fade-in">
              WASABI
            </h1>

            <p className="font-display font-semibold text-base sm:text-lg text-gray-300 mb-5 animate-fade-in tracking-wide">
              Wide Array Student Analytic &amp; Benchmark Interface
            </p>

            <p className="text-sm sm:text-base text-gray-400 max-w-md mb-7 animate-fade-in-up leading-relaxed">
              The all-in-one analytics platform built for charter schools. Bring together
              attendance, grades, assessments, and behavioral data into a single dashboard —
              so you can see every student's full story and act before it's too late.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-3 animate-fade-in-up">
              <a
                href="/wasabi-landing/try"
                className="btn-primary text-base !px-7 !py-3.5 shadow-lg shadow-wasabi-green/20"
              >
                Try WASABI
              </a>
              <button
                onClick={scrollToFeatures}
                className="btn-secondary text-base !px-7 !py-3.5 !border-gray-500 !text-gray-300 hover:!border-wasabi-green hover:!text-green-400"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right: Hero screenshot slideshow — 35% larger */}
          <div className="flex justify-center lg:justify-end animate-fade-in">
            <div
              className="relative w-full max-w-[48rem]"
              style={{ perspective: '1200px' }}
            >
              <div
                className="relative rounded-xl overflow-hidden shadow-2xl shadow-black/40 border border-gray-700/50 group"
                style={{
                  transform: 'rotateY(-6deg) rotateX(2deg)',
                  transformOrigin: 'center center',
                  cursor: 'zoom-in',
                }}
                onClick={() => setModalIndex(activeIndex)}
              >
                {/* 16:9 aspect ratio container */}
                <div className="relative w-full" style={{ paddingBottom: '57.8%' }}>
                  <div className="absolute inset-0 bg-gray-800">
                    {/* Back layer: next image (always visible underneath) */}
                    <img
                      src={heroImages[nextIndex]}
                      alt={`WASABI screenshot ${nextIndex + 1}`}
                      className="absolute inset-0 w-full h-full object-cover object-top"
                    />
                    {/* Front layer: current image (fades out to reveal next) */}
                    <img
                      src={heroImages[activeIndex]}
                      alt={`WASABI screenshot ${activeIndex + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700 ease-in-out ${
                        isFading ? 'opacity-0' : 'opacity-100'
                      }`}
                      onTransitionEnd={handleTransitionEnd}
                    />
                  </div>
                </div>

                {/* Zoom hint on hover */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors duration-200 pointer-events-none">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/60 rounded-full p-3">
                    <ZoomIn className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Glass reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.08] pointer-events-none" />
              </div>

              {/* Subtle glow behind the "product box" */}
              <div className="absolute -inset-4 bg-wasabi-green/10 rounded-2xl blur-2xl -z-10" />
            </div>
          </div>
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

      {/* Lightbox modal */}
      {modalIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm animate-fade-in"
          onClick={() => setModalIndex(null)}
        >
          {/* Close */}
          <button
            onClick={() => setModalIndex(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
            aria-label="Close"
          >
            <X size={28} />
          </button>

          {/* Prev / Next arrows */}
          <button
            onClick={(e) => { e.stopPropagation(); modalPrev() }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors z-10"
            aria-label="Previous"
          >
            <ChevronLeft size={36} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); modalNext() }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors z-10"
            aria-label="Next"
          >
            <ChevronRight size={36} />
          </button>

          {/* Image */}
          <img
            src={heroImages[modalIndex]}
            alt={`WASABI screenshot ${modalIndex + 1}`}
            className="max-w-[90vw] max-h-[80vh] rounded-lg shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Counter */}
          <p className="text-white/60 text-sm mt-3">
            {modalIndex + 1} / {heroImages.length}
          </p>

          {/* Dot indicators */}
          <div className="flex justify-center gap-1.5 mt-3" onClick={(e) => e.stopPropagation()}>
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setModalIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === modalIndex
                    ? 'bg-wasabi-green w-4'
                    : 'bg-gray-600 hover:bg-gray-400 w-1.5'
                }`}
                aria-label={`View screenshot ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
