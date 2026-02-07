import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMockupContext } from './MockupApp'
import { students } from '../data/students'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface TourStep {
  target: string           // data-tour attribute value
  title: string
  description: string
  preNavigate?: string     // auto-navigate to this path before showing
  selectStudent?: boolean  // auto-select first student
}

const tourSteps: TourStep[] = [
  {
    target: 'welcome',
    title: 'Welcome to WASABI!',
    description: 'This interactive demo is loaded with realistic sample data so you can explore every feature. Use the sidebar to navigate, search for students, and see how WASABI brings all your data together. Let\'s take a quick tour!',
    preNavigate: '/try',
  },
  {
    target: 'search',
    title: 'Search for Students',
    description: 'Find any student instantly by name, ID, or grade. WASABI searches across all enrolled students.',
  },
  {
    target: 'sidebar',
    title: 'Navigate Your Data',
    description: 'Access student profiles, analytics, flagging, observations, and AI assistance from the sidebar.',
  },
  {
    target: 'results',
    title: 'Student Results',
    description: 'See all your students at a glance. Click any name to view their complete profile.',
    preNavigate: '/try/search',
  },
  {
    target: 'profile',
    title: 'Student Profiles',
    description: 'Every data point in one place. Attendance, grades, assessments, and behavioral data \u2014 all unified.',
    preNavigate: '/try/profile',
    selectStudent: true,
  },
  {
    target: 'profile',
    title: 'Drill Into the Data',
    description: 'Expand any section to see detailed trends, charts, and historical data.',
  },
  {
    target: 'sidebar',
    title: 'Analytics & Flagging',
    description: 'Analyze class-wide trends and identify at-risk students before they fall behind.',
  },
  {
    target: 'nori',
    title: 'Meet Nori',
    description: 'Your AI teaching assistant can answer questions about student data, identify trends, and help you make data-driven decisions.',
  },
]

interface SpotlightRect {
  top: number
  left: number
  width: number
  height: number
}

export default function MockupTour() {
  const { setShowTour, setSelectedStudents } = useMockupContext()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number; placement: 'above' | 'below' } | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const step = tourSteps[currentStep]

  // Locate the target element and compute spotlight + tooltip position
  const positionElements = useCallback(() => {
    const el = document.querySelector(`[data-tour="${step.target}"]`)
    if (!el) {
      // If element not found, center the tooltip
      setSpotlight(null)
      setTooltipPos({
        top: window.innerHeight / 2 - 80,
        left: window.innerWidth / 2 - 160,
        placement: 'below',
      })
      return
    }

    const rect = el.getBoundingClientRect()
    const padding = 8

    const spot: SpotlightRect = {
      top: rect.top - padding,
      left: rect.left - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2,
    }
    setSpotlight(spot)

    // Tooltip width
    const tooltipW = 320
    const tooltipH = 160

    // Prefer below if there's space, otherwise above
    const spaceBelow = window.innerHeight - (spot.top + spot.height)
    const spaceAbove = spot.top

    let tTop: number
    let placement: 'above' | 'below'

    if (spaceBelow > tooltipH + 20) {
      tTop = spot.top + spot.height + 12
      placement = 'below'
    } else if (spaceAbove > tooltipH + 20) {
      tTop = spot.top - tooltipH - 12
      placement = 'above'
    } else {
      // Fallback: place in center
      tTop = window.innerHeight / 2 - tooltipH / 2
      placement = 'below'
    }

    // Center horizontally relative to spotlight, clamped to viewport
    let tLeft = spot.left + spot.width / 2 - tooltipW / 2
    tLeft = Math.max(12, Math.min(window.innerWidth - tooltipW - 12, tLeft))

    setTooltipPos({ top: tTop, left: tLeft, placement })
  }, [step])

  // Handle navigation and positioning when step changes
  useEffect(() => {
    setIsTransitioning(true)

    const doStep = async () => {
      // Auto-select student if needed
      if (step.selectStudent) {
        setSelectedStudents([students[0]])
      }

      // Auto-navigate if needed
      if (step.preNavigate) {
        navigate(step.preNavigate)
      }

      // Wait for DOM to update after navigation
      await new Promise(resolve => setTimeout(resolve, 300))
      positionElements()
      setIsTransitioning(false)
    }

    doStep()

    // Re-position on resize
    const handleResize = () => positionElements()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentStep, step, navigate, positionElements, setSelectedStudents])

  // Also reposition periodically to handle lazy-rendered elements
  useEffect(() => {
    const interval = setInterval(positionElements, 500)
    return () => clearInterval(interval)
  }, [positionElements])

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      setShowTour(false)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSkip = () => {
    setShowTour(false)
    navigate('/try')
  }

  return (
    <div className="fixed inset-0 z-[100]">
      {/* SVG backdrop with spotlight cutout */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      >
        <defs>
          <mask id="tour-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {spotlight && (
              <rect
                x={spotlight.left}
                y={spotlight.top}
                width={spotlight.width}
                height={spotlight.height}
                rx="12"
                ry="12"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.6)"
          mask="url(#tour-mask)"
          style={{ pointerEvents: 'all' }}
        />
      </svg>

      {/* Spotlight border ring */}
      {spotlight && (
        <div
          className="absolute border-2 border-wasabi-green/60 rounded-xl pointer-events-none transition-all duration-300 ease-out"
          style={{
            top: spotlight.top,
            left: spotlight.left,
            width: spotlight.width,
            height: spotlight.height,
            boxShadow: '0 0 0 4px rgba(0, 136, 0, 0.15), 0 0 20px rgba(0, 136, 0, 0.1)',
          }}
        />
      )}

      {/* Tooltip card */}
      {tooltipPos && !isTransitioning && (
        <div
          className="absolute z-10 transition-all duration-300 ease-out animate-fade-in"
          style={{
            top: tooltipPos.top,
            left: tooltipPos.left,
            width: 320,
          }}
        >
          {/* Arrow */}
          {spotlight && tooltipPos.placement === 'below' && (
            <div className="flex justify-center -mb-1">
              <div className="w-3 h-3 bg-gray-800 rotate-45 border-l border-t border-gray-600" />
            </div>
          )}

          <div className="bg-gray-800 border border-gray-600 rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-4 pt-4 pb-2">
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-sm font-bold text-white pr-6">{step.title}</h3>
                <button
                  onClick={handleSkip}
                  className="absolute top-3 right-3 p-1 text-gray-400 hover:text-white transition-colors rounded"
                >
                  <X size={14} />
                </button>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{step.description}</p>
            </div>

            {/* Footer */}
            <div className="px-4 pb-3 pt-2 flex items-center justify-between">
              {/* Step indicator */}
              <div className="flex items-center gap-1.5">
                {tourSteps.map((_, i) => (
                  <span
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      i === currentStep ? 'bg-wasabi-green' : i < currentStep ? 'bg-wasabi-green/40' : 'bg-gray-600'
                    }`}
                  />
                ))}
                <span className="text-[10px] text-gray-500 ml-1.5">
                  {currentStep + 1}/{tourSteps.length}
                </span>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleSkip}
                  className="px-2.5 py-1.5 text-[11px] text-gray-400 hover:text-white transition-colors rounded"
                >
                  Skip
                </button>
                {currentStep > 0 && (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-0.5 px-2.5 py-1.5 text-[11px] text-gray-300 hover:text-white
                      bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
                  >
                    <ChevronLeft size={12} />
                    Back
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="flex items-center gap-0.5 px-3 py-1.5 text-[11px] font-medium text-white
                    bg-wasabi-green hover:bg-wasabi-green/80 rounded-md transition-colors"
                >
                  {currentStep === tourSteps.length - 1 ? 'Done' : 'Next'}
                  {currentStep < tourSteps.length - 1 && <ChevronRight size={12} />}
                </button>
              </div>
            </div>
          </div>

          {/* Arrow below */}
          {spotlight && tooltipPos.placement === 'above' && (
            <div className="flex justify-center -mt-1">
              <div className="w-3 h-3 bg-gray-800 rotate-45 border-r border-b border-gray-600" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
