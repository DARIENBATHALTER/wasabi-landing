import { useState, useEffect, useRef } from 'react'
import {
  ChevronRight,
  AlertTriangle,
} from 'lucide-react'
import StudentAvatar from './StudentAvatar'

// ---------------------------------------------------------------------------
// Demo steps — each opens one section with a tooltip
// ---------------------------------------------------------------------------
const DEMO_STEPS = [
  {
    section: 'attendance',
    tooltip:
      'Real-time attendance tracking with automatic rate calculations and color-coded status indicators.',
    callout: 'School-specific data views that match your needs.',
  },
  {
    section: 'grades',
    tooltip:
      'Quarter-by-quarter grades with auto-calculated GPA. Spot declining subjects before report cards go home.',
    callout: 'Track every metric, across every grading period.',
  },
  {
    section: 'iready',
    tooltip:
      'Diagnostic trend graphs across testing windows. Red highlights flag declining performance for early intervention.',
    callout: 'Works with any data source your school already uses.',
  },
  {
    section: 'fast',
    tooltip:
      'State assessment benchmarks imported directly from FAST exports, with three testing windows.',
    callout: 'Customizable flags and live alerts for at-risk students.',
  },
  {
    section: 'discipline',
    tooltip:
      'Behavioral records and patterns at a glance. Green means no concerns — focus where it matters.',
    callout: 'The full picture — so nothing falls through the cracks.',
  },
]

const DEMO_STUDENTS = [
  { first: 'Maya', last: 'Rodriguez', gender: 'female' as const, grade: 4, teacher: 'Mr. Thompson', id: '10045698' },
  { first: 'Jaylen', last: 'Thomas', gender: 'male' as const, grade: 3, teacher: 'Ms. Davis', id: '10038421' },
  { first: 'Sofia', last: 'Martinez', gender: 'female' as const, grade: 5, teacher: 'Mrs. Kim', id: '10052117' },
  { first: 'Marcus', last: 'Williams', gender: 'male' as const, grade: 2, teacher: 'Ms. Chen', id: '10041389' },
  { first: 'Aaliyah', last: 'Johnson', gender: 'female' as const, grade: 1, teacher: 'Mrs. Rodriguez', id: '10029764' },
]

// Flags only shown for steps with highlighted sections
const STEP_FLAGS: Record<number, { text: string; color: 'red' | 'yellow' }> = {
  0: { text: 'Attendance below 90%', color: 'yellow' },
  2: { text: 'iReady Reading — declining', color: 'red' },
  4: { text: 'Behavioral referral — Nov 2025', color: 'yellow' },
}

type Phase = 'initial' | 'holding' | 'closing' | 'flip-out' | 'flip-in'

// Approximate vertical center of each section header (px from card top)
const SECTION_TOPS: Record<string, number> = {
  attendance: 130,
  grades: 170,
  iready: 210,
  fast: 250,
  discipline: 290,
}

// ---------------------------------------------------------------------------
// Mini trend graph (SVG)
// ---------------------------------------------------------------------------
function MiniTrendGraph({
  points,
  color,
  id,
}: {
  points: number[]
  color: string
  id: string
}) {
  const w = 110,
    h = 32,
    pad = 4
  const min = Math.min(...points) - 10
  const max = Math.max(...points) + 10
  const toX = (i: number) => pad + (i / (points.length - 1)) * (w - pad * 2)
  const toY = (v: number) =>
    pad + (1 - (v - min) / (max - min)) * (h - pad * 2)
  const line = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(p)}`)
    .join(' ')
  const area =
    line +
    ` L ${toX(points.length - 1)} ${h - pad} L ${toX(0)} ${h - pad} Z`

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="flex-shrink-0"
    >
      <defs>
        <linearGradient id={`hero-tg-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#hero-tg-${id})`} />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map((p, i) => (
        <circle
          key={i}
          cx={toX(i)}
          cy={toY(p)}
          r="3"
          fill={color}
          stroke="white"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Animated collapsible section (controlled externally, no user interaction)
// ---------------------------------------------------------------------------
function AnimatedSection({
  title,
  isOpen,
  statusColor,
  borderClass,
  children,
}: {
  title: string
  isOpen: boolean
  statusColor: string
  borderClass?: string
  children: React.ReactNode
}) {
  return (
    <div className={`border rounded-lg overflow-hidden ${borderClass || 'border-gray-200 dark:border-gray-700'}`}>
      {/* Header */}
      <div className={`flex items-center gap-2 px-3 py-2 ${
        statusColor === 'bg-red-500' ? 'bg-red-50 dark:bg-red-950/30'
        : statusColor === 'bg-yellow-500' ? 'bg-yellow-50 dark:bg-yellow-950/30'
        : 'bg-gray-50 dark:bg-gray-800/50'
      }`}>
        <span
          className={`w-2 h-2 rounded-full flex-shrink-0 ${statusColor}`}
        />
        <span className="flex-1 text-xs font-semibold text-gray-900 dark:text-white">
          {title}
        </span>
        <span
          className="transition-transform duration-300"
          style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          <ChevronRight size={12} className="text-gray-400" />
        </span>
      </div>

      {/* Animated content */}
      <div
        className="transition-[grid-template-rows] duration-500 ease-in-out"
        style={{ display: 'grid', gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div
            className={`px-3 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/30 transition-opacity duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Trading card back
// ---------------------------------------------------------------------------
function CardBack() {
  return (
    <div
      className="absolute inset-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
    >
      {/* Center content — logo only */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src="/wasabilogo.png"
          alt="WASABI"
          className="w-20 h-20 drop-shadow-[0_0_30px_rgba(0,136,0,0.3)]"
        />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function HeroProfileCard() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [flipCount, setFlipCount] = useState(0)
  const [phase, setPhase] = useState<Phase>('initial')
  const [showTooltip, setShowTooltip] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [studentIndex, setStudentIndex] = useState(0)
  const stepRef = useRef(0)

  const rotation = -5 + flipCount * 180

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    const delay = (ms: number, fn: () => void) => {
      timers.push(setTimeout(fn, ms))
    }

    switch (phase) {
      case 'initial':
        delay(2000, () => {
          setActiveSection(DEMO_STEPS[0].section)
          setShowTooltip(true)
          setPhase('holding')
        })
        break

      case 'holding':
        delay(5000, () => {
          setShowTooltip(false)
          setPhase('closing')
        })
        break

      case 'closing':
        // Tooltip fades for 300ms, then close section
        delay(300, () => setActiveSection(null))
        // After section fully closes, flip
        delay(900, () => setPhase('flip-out'))
        break

      case 'flip-out':
        setFlipCount((f) => f + 2) // full 360: flip out + back in one go
        // Change student info + section colors mid-flip when card is face-down
        delay(500, () => {
          setStudentIndex((s) => (s + 1) % DEMO_STUDENTS.length)
          const next = (stepRef.current + 1) % DEMO_STEPS.length
          stepRef.current = next
          setCurrentStep(next)
        })
        // Open the section and show tooltips after flip completes
        delay(1200, () => {
          setActiveSection(DEMO_STEPS[stepRef.current].section)
          setShowTooltip(true)
          setPhase('holding')
        })
        break
    }

    return () => timers.forEach(clearTimeout)
  }, [phase])

  const isActive = (section: string) => activeSection === section

  const sectionTop = (activeSection ? SECTION_TOPS[activeSection] ?? 200 : 200) + 25

  return (
    <div className="relative">
      <div style={{ perspective: '1200px' }}>
        <div
          className="relative"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(2deg) rotateY(${rotation}deg)`,
            transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
        {/* ====== FRONT FACE ====== */}
        <div
          className="backdrop-blur-md bg-white/90 dark:bg-gray-800/90 shadow-2xl rounded-xl border-2 border-yellow-300/70 dark:border-yellow-400/40 p-4 sm:p-5"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Student header */}
          {(() => {
            const s = DEMO_STUDENTS[studentIndex]
            const flag = STEP_FLAGS[currentStep]
            return (
              <div className="flex items-center gap-3 mb-3.5">
                <StudentAvatar
                  firstName={s.first}
                  lastName={s.last}
                  gender={s.gender}
                  size="lg"
                  className="flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">
                    {s.last}, {s.first}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Grade {s.grade} &middot; {s.teacher} &middot; #{s.id}
                  </p>
                  {flag && (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium border ${
                      flag.color === 'red'
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
                    }`}>
                      <AlertTriangle size={10} />
                      {flag.text}
                    </span>
                  )}
                </div>
              </div>
            )
          })()}

          {/* Collapsible sections */}
          <div className="space-y-1.5">
            {/* ATTENDANCE */}
            <AnimatedSection
              title="Attendance"
              isOpen={isActive('attendance')}
              statusColor={currentStep === 0 ? 'bg-yellow-500' : 'bg-green-500'}
              borderClass={currentStep === 0 ? 'border-yellow-300 dark:border-yellow-600' : undefined}
            >
              <div className="space-y-2">
                {/* Bar chart — last 45 school days */}
                <div>
                  <p className="text-[9px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Daily Attendance — Last 45 School Days
                  </p>
                  <div className="flex h-8 rounded border border-gray-200 dark:border-gray-600 overflow-hidden">
                    {/* P=present, T=tardy, A=absent */}
                    {'PPPPPPPTPPPPAPPPPPPPPTPPPPPAPPPPPPAAPPPPPTPPA'.split('').map((code, i) => (
                      <div
                        key={i}
                        className={`flex-1 ${
                          code === 'P' ? 'bg-green-200 dark:bg-green-500/30'
                          : code === 'T' ? 'bg-yellow-200 dark:bg-yellow-500/30'
                          : 'bg-red-200 dark:bg-red-500/30'
                        }`}
                        style={{ borderRight: i < 44 ? '0.5px solid rgba(0,0,0,0.05)' : 'none' }}
                      />
                    ))}
                  </div>
                </div>
                {/* Legend */}
                <div className="flex justify-center gap-3 text-[8px] text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-green-200 dark:bg-green-500/30 border border-gray-300 dark:border-gray-600" />Present</span>
                  <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-yellow-200 dark:bg-yellow-500/30 border border-gray-300 dark:border-gray-600" />Tardy</span>
                  <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-200 dark:bg-red-500/30 border border-gray-300 dark:border-gray-600" />Absent</span>
                </div>
                {/* Stats */}
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { label: 'Rate', value: '87.4%', color: 'text-yellow-600' },
                    { label: 'Present', value: '131', color: 'text-green-600' },
                    { label: 'Absent', value: '16', color: 'text-red-600' },
                    { label: 'Tardy', value: '7', color: 'text-yellow-600' },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="bg-gray-50 dark:bg-gray-700/30 rounded p-1.5 text-center"
                    >
                      <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
                      <p className="text-[9px] text-gray-500">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* GRADES */}
            <AnimatedSection
              title="Grades (GPA: 3.40)"
              isOpen={isActive('grades')}
              statusColor="bg-green-500"
            >
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-1 px-1.5 text-gray-500 font-semibold">
                      Course
                    </th>
                    <th className="text-center py-1 px-1.5 text-gray-500 font-semibold">
                      Q1
                    </th>
                    <th className="text-center py-1 px-1.5 text-gray-500 font-semibold">
                      Q2
                    </th>
                    <th className="text-center py-1 px-1.5 text-gray-500 font-semibold">
                      Q3
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {[
                    { course: 'Math', q1: 'A', q2: 'B', q3: 'A' },
                    { course: 'ELA', q1: 'B', q2: 'B', q3: 'A' },
                    { course: 'Science', q1: 'A', q2: 'A', q3: 'B' },
                    { course: 'Soc. Studies', q1: 'B', q2: 'A', q3: 'B' },
                  ].map((g) => (
                    <tr key={g.course}>
                      <td className="py-1 px-1.5 font-medium text-gray-900 dark:text-white">
                        {g.course}
                      </td>
                      <td
                        className={`py-1 px-1.5 text-center font-bold ${g.q1 === 'A' ? 'text-green-600' : 'text-lime-600'}`}
                      >
                        {g.q1}
                      </td>
                      <td
                        className={`py-1 px-1.5 text-center font-bold ${g.q2 === 'A' ? 'text-green-600' : 'text-lime-600'}`}
                      >
                        {g.q2}
                      </td>
                      <td
                        className={`py-1 px-1.5 text-center font-bold ${g.q3 === 'A' ? 'text-green-600' : 'text-lime-600'}`}
                      >
                        {g.q3}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </AnimatedSection>

            {/* iREADY — red indicator */}
            <AnimatedSection
              title="iReady"
              isOpen={isActive('iready')}
              statusColor={currentStep === 2 ? 'bg-red-500' : 'bg-green-500'}
              borderClass={currentStep === 2 ? 'border-red-300 dark:border-red-700' : undefined}
            >
              <div className="space-y-2">
                {/* Reading — DANGER */}
                <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 p-2 -mx-0.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertTriangle size={11} className="text-red-500" />
                    <p className="text-[10px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
                      Reading
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-sm font-bold text-red-600 dark:text-red-400">
                          415
                        </span>
                        <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-semibold bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300">
                          Below Grade Level
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-500">
                        <span>458</span>
                        <span className="text-gray-300">&rarr;</span>
                        <span>438</span>
                        <span className="text-gray-300">&rarr;</span>
                        <span className="font-semibold text-red-500">
                          415 &darr;
                        </span>
                      </div>
                    </div>
                    <MiniTrendGraph
                      points={[458, 438, 415]}
                      color="#dc2626"
                      id="reading"
                    />
                  </div>
                </div>
                {/* Math — OK */}
                <div className="pt-2 border-t border-gray-100 dark:border-gray-700/50">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Math
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          512
                        </span>
                        <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          On Grade Level
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-500">
                        <span>478</span>
                        <span className="text-gray-300">&rarr;</span>
                        <span>495</span>
                        <span className="text-gray-300">&rarr;</span>
                        <span className="font-semibold text-wasabi-green">
                          512
                        </span>
                      </div>
                    </div>
                    <MiniTrendGraph
                      points={[478, 495, 512]}
                      color="#7c3aed"
                      id="math"
                    />
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* FAST */}
            <AnimatedSection
              title="FAST"
              isOpen={isActive('fast')}
              statusColor="bg-green-500"
            >
              <div className="space-y-2">
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    ELA
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          401
                        </span>
                        <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          On Grade Level
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-500">
                        <span>368</span>
                        <span className="text-gray-300">&rarr;</span>
                        <span>385</span>
                        <span className="text-gray-300">&rarr;</span>
                        <span className="font-semibold text-wasabi-green">
                          401
                        </span>
                      </div>
                    </div>
                    <MiniTrendGraph
                      points={[368, 385, 401]}
                      color="#059669"
                      id="fast-ela"
                    />
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-100 dark:border-gray-700/50">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Math
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          422
                        </span>
                        <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          On Grade Level
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-500">
                        <span>390</span>
                        <span className="text-gray-300">&rarr;</span>
                        <span>408</span>
                        <span className="text-gray-300">&rarr;</span>
                        <span className="font-semibold text-wasabi-green">
                          422
                        </span>
                      </div>
                    </div>
                    <MiniTrendGraph
                      points={[390, 408, 422]}
                      color="#d97706"
                      id="fast-math"
                    />
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* DISCIPLINE */}
            <AnimatedSection
              title="Discipline"
              isOpen={isActive('discipline')}
              statusColor={currentStep === 4 ? 'bg-yellow-500' : 'bg-green-500'}
              borderClass={currentStep === 4 ? 'border-yellow-300 dark:border-yellow-600' : undefined}
            >
              <div className="space-y-2">
                <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/40 p-2 -mx-0.5">
                  <p className="text-[10px] font-semibold text-yellow-700 dark:text-yellow-400 mb-0.5">11/25/2025</p>
                  <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed">
                    Student throwing paper airplanes instead of following along with instruction. Called mom and requested parent meeting.
                  </p>
                </div>
                <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/40 p-2 -mx-0.5">
                  <p className="text-[10px] font-semibold text-yellow-700 dark:text-yellow-400 mb-0.5">01/08/2026</p>
                  <p className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed">
                    Disrupting group activity during math stations. Verbal warning issued, moved to separate desk.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>

          {/* ====== BACK FACE — Trading Card ====== */}
          <CardBack />
        </div>
      </div>

      {/* ====== SIDE TOOLTIPS — outside 3D container ====== */}
      {/* Left tooltip (green) — top-aligned, arrow points right */}
      <div
        className={`hidden md:block absolute w-44 transition-all duration-500 ${
          showTooltip
            ? 'opacity-100'
            : 'opacity-0 pointer-events-none'
        }`}
        style={{ right: 'calc(100% - 10px)', top: sectionTop }}
      >
        <div className="relative">
          {/* Arrow — rotated square peeking out from right edge */}
          <div className="absolute top-3 -right-[7px] w-3.5 h-3.5 bg-emerald-100 dark:bg-emerald-900 border-r border-t border-emerald-300 dark:border-emerald-600 rotate-45 z-0" />
          {/* Tooltip box */}
          <div className="relative z-10 bg-emerald-100 dark:bg-emerald-900 border border-emerald-300 dark:border-emerald-600 rounded-lg px-3 py-2 shadow-md">
            <p className="text-[11px] font-medium text-emerald-800 dark:text-emerald-200 leading-relaxed">
              {DEMO_STEPS[currentStep].tooltip}
            </p>
          </div>
        </div>
      </div>

      {/* Right tooltip (amber) — bottom-aligned, arrow points left */}
      <div
        className={`hidden md:block absolute w-44 transition-all duration-500 ${
          showTooltip
            ? 'opacity-100'
            : 'opacity-0 pointer-events-none'
        }`}
        style={{ left: 'calc(100% - 10px)', top: sectionTop, transform: 'translateY(-100%)' }}
      >
        <div className="relative">
          {/* Arrow — rotated square peeking out from left edge */}
          <div className="absolute bottom-3 -left-[7px] w-3.5 h-3.5 bg-amber-100 dark:bg-amber-800 border-l border-b border-amber-300 dark:border-amber-600 rotate-45 z-0" />
          {/* Tooltip box */}
          <div className="relative z-10 bg-amber-100 dark:bg-amber-800 border border-amber-300 dark:border-amber-600 rounded-lg px-3 py-2 shadow-md">
            <p className="text-[11px] font-semibold text-amber-800 dark:text-amber-200 leading-relaxed">
              {DEMO_STEPS[currentStep].callout}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
