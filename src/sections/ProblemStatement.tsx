import { Layers, Clock, AlertTriangle } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import GlassCard from '../components/GlassCard'

const painPoints = [
  {
    icon: Layers,
    title: 'Scattered Data',
    description:
      'Assessment scores in FOCUS, diagnostics in iReady, state results in FAST. Your students\u2019 stories are fragmented across platforms that weren\u2019t designed to work together.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Clock,
    title: 'Hours of Manual Work',
    description:
      'Teachers and admins at small and charter schools spend countless hours compiling reports, matching spreadsheets, and chasing down numbers — without the district-level analytics team to help.',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  {
    icon: AlertTriangle,
    title: 'Students Fall Through the Cracks',
    description:
      'Without a unified view, at-risk students go unnoticed until it\u2019s too late. Early warning signs get lost in the noise.',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
]

export default function ProblemStatement() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section
      id="about"
      className="py-14 md:py-24 bg-gray-50 dark:bg-gray-900 relative overflow-hidden"
    >
      {/* Subtle background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/3 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/3 rounded-full blur-3xl" />

      <div
        ref={ref}
        className={`section-container relative z-10 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Heading */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-[2.75rem] text-gray-900 dark:text-white mb-6 leading-tight">
            Your students' data shouldn't live in<br />
            <span className="text-red-500">12 different spreadsheets</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            Between FOCUS, iReady, FAST, STAR, and every other platform your school depends
            on — your most critical student data is scattered across systems that don't talk
            to each other. We work with these Florida systems every day, so we know the full
            picture matters — and that building it takes hours you don't have.
          </p>
        </div>

        {/* Pain Point Cards — desktop */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 mb-16">
          {painPoints.map((point, index) => (
            <GlassCard
              key={point.title}
              className={`p-8 text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div
                className={`w-16 h-16 rounded-2xl ${point.bgColor} flex items-center justify-center mx-auto mb-5`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <point.icon className={`w-8 h-8 ${point.color}`} />
              </div>
              <h3 className="font-display font-semibold text-xl text-gray-900 dark:text-white mb-3">
                {point.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {point.description}
              </p>
            </GlassCard>
          ))}
        </div>

        {/* Pain Points — mobile bullet list */}
        <div className="md:hidden space-y-4 mb-10">
          {painPoints.map((point) => (
            <div key={point.title} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg ${point.bgColor} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <point.icon className={`w-4 h-4 ${point.color}`} />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{point.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{point.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Transition Line + mobile logo bridge */}
        <div className="text-center">
          <p className="font-display font-semibold text-2xl sm:text-3xl text-gray-900 dark:text-white">
            There's a{' '}
            <span className="gradient-text glow-green inline-block px-1">
              better way
            </span>
            .
          </p>
          <img src="/wasabilogo.png" alt="" className="md:hidden w-12 h-12 mx-auto mt-6 opacity-80" />
        </div>
      </div>
    </section>
  )
}
