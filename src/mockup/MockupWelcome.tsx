import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMockupContext } from './MockupApp'
import { Users, BarChart3, Flag, FileText } from 'lucide-react'

interface FeatureCard {
  title: string
  description: string
  icon: React.ReactNode
  path?: string
  tooltip?: string
  color: string
}

export default function MockupWelcome() {
  const { setCurrentView } = useMockupContext()
  const navigate = useNavigate()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [showTooltip, setShowTooltip] = useState<string | null>(null)

  useEffect(() => {
    setCurrentView('welcome')
  }, [setCurrentView])

  const features: FeatureCard[] = [
    {
      title: 'Profile Search',
      description: 'Search and view comprehensive student profiles with attendance, grades, assessments, and behavior data.',
      icon: <Users size={28} />,
      path: '/try/search',
      color: 'from-green-500/20 to-emerald-500/10',
    },
    {
      title: 'Class Analytics',
      description: 'Analyze trends across your classroom with visual charts, performance distributions, and attendance patterns.',
      icon: <BarChart3 size={28} />,
      path: '/try/analytics',
      color: 'from-blue-500/20 to-cyan-500/10',
    },
    {
      title: 'Flagging System',
      description: 'Identify students who need support with automated flag rules for attendance, grades, and behavior.',
      icon: <Flag size={28} />,
      path: '/try/flagging',
      color: 'from-orange-500/20 to-amber-500/10',
    },
    {
      title: 'Student Reports',
      description: 'Generate and export detailed reports for individual students or entire classes.',
      icon: <FileText size={28} />,
      path: '/try/reports',
      color: 'from-purple-500/20 to-violet-500/10',
    },
  ]

  const handleCardClick = (card: FeatureCard) => {
    if (card.path) {
      navigate(card.path)
    } else if (card.tooltip) {
      setShowTooltip(card.title)
      setTimeout(() => setShowTooltip(null), 2000)
    }
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      {/* Logo and title */}
      <div data-tour="welcome" className="text-center mb-10 animate-fade-in">
        <img
          src="/wasabilogo.png"
          alt="WASABI"
          className="w-20 h-20 mx-auto mb-5 animate-float"
        />
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-3">
          Welcome to <span className="text-wasabi-green">WASABI</span>
        </h1>
        <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
          Wide Array Student Analytics and Benchmarking Interface
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 w-full max-w-2xl">
        {features.map((card, index) => (
          <div
            key={card.title}
            className="relative"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <button
              onClick={() => handleCardClick(card)}
              onMouseEnter={() => setHoveredCard(card.title)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`
                w-full text-left p-5 rounded-xl
                backdrop-blur-md bg-white/70 dark:bg-gray-800/70
                border border-gray-200/50 dark:border-gray-700/50
                shadow-lg hover:shadow-xl
                transition-all duration-300 ease-out
                ${hoveredCard === card.title ? 'scale-[1.02] -translate-y-1' : 'scale-100'}
                ${!card.path ? 'opacity-75' : ''}
                group animate-fade-in-up
              `}
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <div className="relative">
                <div className={`
                  w-12 h-12 rounded-lg flex items-center justify-center mb-3
                  ${card.path
                    ? 'bg-wasabi-green/10 text-wasabi-green'
                    : 'bg-gray-200/50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500'
                  }
                  transition-colors duration-200
                `}>
                  {card.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1.5 flex items-center gap-2">
                  {card.title}
                  {!card.path && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded">
                      FULL VERSION
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </button>

            {/* Tooltip popup */}
            {showTooltip === card.title && card.tooltip && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
                <div className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                  {card.tooltip}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Hint text */}
      <p className="mt-8 text-xs text-gray-400 dark:text-gray-500 text-center animate-fade-in">
        This is a live demo with sample data. Explore freely — no account needed.
      </p>
    </div>
  )
}
