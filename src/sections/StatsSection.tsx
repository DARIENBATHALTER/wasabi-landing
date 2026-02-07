import { useScrollAnimation } from '../hooks/useScrollAnimation'
import AnimatedCounter from '../components/AnimatedCounter'

const stats = [
  {
    end: 12,
    suffix: '+',
    label: 'Data Sources Supported',
  },
  {
    end: 500,
    suffix: '+',
    label: 'Data Points Per Student',
  },
  {
    end: 100,
    suffix: '%',
    label: 'FERPA Compliant',
  },
  {
    end: 1,
    suffix: '',
    label: 'Local Team, One Call Away',
  },
]

export default function StatsSection() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-wasabi-dark via-gray-900 to-gray-800" />
      {/* Green accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-wasabi-green to-transparent" />
      {/* Subtle pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #008800 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div
        ref={ref}
        className={`section-container relative z-10 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white mb-2">
                <AnimatedCounter
                  end={stat.end}
                  suffix={stat.suffix}
                  isVisible={isVisible}
                  duration={stat.end > 100 ? 2000 : 1200}
                />
              </div>
              <p className="text-sm sm:text-base text-gray-400 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
