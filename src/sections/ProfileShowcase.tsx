import { useState } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import StudentAvatar from '../components/StudentAvatar'
import GlassCard from '../components/GlassCard'
import {
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  GraduationCap,
  Calendar,
  Shield,
  BookOpen,
  Calculator,
} from 'lucide-react'

interface SectionProps {
  title: string
  icon: React.ReactNode
  defaultOpen?: boolean
  statusColor: string
  tooltip?: string
  children: React.ReactNode
}

function CollapsibleSection({ title, icon, defaultOpen = false, statusColor, tooltip, children }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2.5 px-4 py-3 bg-gray-50 dark:bg-gray-800/50
          hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
      >
        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusColor}`} />
        <span className="text-wasabi-green">{icon}</span>
        <span className="flex-1 text-sm font-semibold text-gray-900 dark:text-white">{title}</span>
        {isOpen ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
      </button>
      {isOpen && (
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/30">
          {tooltip && (
            <div className="mb-3 px-3 py-2 rounded-lg bg-wasabi-green/10 border border-wasabi-green/20">
              <p className="text-xs text-wasabi-green font-medium leading-relaxed">{tooltip}</p>
            </div>
          )}
          {children}
        </div>
      )}
    </div>
  )
}

/** 3-point SVG trend line for assessment sections */
function MiniTrendGraph({ points, color }: { points: number[]; color: string }) {
  const w = 140
  const h = 44
  const pad = 6
  const min = Math.min(...points) - 10
  const max = Math.max(...points) + 10

  const toX = (i: number) => pad + (i / (points.length - 1)) * (w - pad * 2)
  const toY = (v: number) => pad + (1 - (v - min) / (max - min)) * (h - pad * 2)

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(i)} ${toY(p)}`).join(' ')
  const area = line + ` L ${toX(points.length - 1)} ${h - pad} L ${toX(0)} ${h - pad} Z`

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="flex-shrink-0">
      <defs>
        <linearGradient id={`tg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#tg-${color.replace('#', '')})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={toX(i)} cy={toY(p)} r="3.5" fill={color} stroke="white" strokeWidth="1.5" />
      ))}
    </svg>
  )
}

export default function ProfileShowcase() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-wasabi-green/3 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/3 rounded-full blur-3xl" />

      <div
        ref={ref}
        className={`section-container relative z-10 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Two-column layout: text left, card right */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Text */}
          <div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-gray-900 dark:text-white mb-4">
              Every data point,{' '}
              <span className="gradient-text">one screen</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              No more toggling between 12 systems. WASABI pulls together every piece of student data
              into a single, beautiful profile with collapsible sections you can drill into.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Attendance, grades, assessments, and behavior — unified',
                'Collapsible sections let you focus on what matters',
                'Real-time data from every connected source',
                'Trend charts show growth at a glance',
                'Automatic flags highlight students who need support',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-wasabi-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-wasabi-green" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <a
              href="/wasabi-landing/try"
              className="btn-primary inline-flex items-center gap-2 text-sm"
            >
              See it in action
            </a>
          </div>

          {/* Right: Live profile card */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-xl">
              {/* "Live Preview" badge */}
              <div className="absolute -top-3 left-5 z-10">
                <span className="px-3 py-1 bg-wasabi-green text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md">
                  Live Preview
                </span>
              </div>

              <GlassCard className="p-6 pt-8">
                {/* Student header */}
                <div className="flex items-start gap-4 mb-5">
                  <StudentAvatar
                    firstName="Maya"
                    lastName="Rodriguez"
                    gender="female"
                    size="lg"
                    className="flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      Rodriguez, Maya
                    </h3>
                    <div className="grid grid-cols-3 gap-2 mb-2.5">
                      {[
                        { label: 'Grade', value: '4' },
                        { label: 'Homeroom', value: 'Mr. Thompson' },
                        { label: 'ID', value: '#10045698' },
                      ].map(info => (
                        <div key={info.label} className="bg-gray-50 dark:bg-gray-700/40 rounded px-2.5 py-1.5">
                          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{info.label}</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{info.value}</p>
                        </div>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                      <AlertTriangle size={12} />
                      iReady Reading — declining, below grade level
                    </span>
                  </div>
                </div>

                {/* Collapsible sections */}
                <div className="space-y-2.5">
                  {/* ATTENDANCE */}
                  <CollapsibleSection title="Attendance" icon={<Calendar size={16} />} statusColor="bg-green-500" tooltip="Track daily attendance with automatic rate calculations. Color-coded status dots tell you at a glance if a student is on track.">
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: 'Rate', value: '96.2%', color: 'text-green-600' },
                        { label: 'Present', value: '145', color: 'text-green-600' },
                        { label: 'Absent', value: '6', color: 'text-red-600' },
                        { label: 'Tardy', value: '3', color: 'text-yellow-600' },
                      ].map(s => (
                        <div key={s.label} className="bg-gray-50 dark:bg-gray-700/30 rounded p-2 text-center">
                          <p className={`text-base font-bold ${s.color}`}>{s.value}</p>
                          <p className="text-xs text-gray-500">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>

                  {/* GRADES */}
                  <CollapsibleSection title="Grades (GPA: 3.40)" icon={<GraduationCap size={16} />} statusColor="bg-green-500" tooltip="Quarter-by-quarter grades with auto-calculated GPA. Spot declining subjects before report cards go home.">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-1.5 px-2 text-gray-500 font-semibold">Course</th>
                          <th className="text-center py-1.5 px-2 text-gray-500 font-semibold">Q1</th>
                          <th className="text-center py-1.5 px-2 text-gray-500 font-semibold">Q2</th>
                          <th className="text-center py-1.5 px-2 text-gray-500 font-semibold">Q3</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                        {[
                          { course: 'Math', q1: 'A', q2: 'B', q3: 'A' },
                          { course: 'ELA', q1: 'B', q2: 'B', q3: 'A' },
                          { course: 'Science', q1: 'A', q2: 'A', q3: 'B' },
                          { course: 'Soc. Studies', q1: 'B', q2: 'A', q3: 'B' },
                        ].map(g => (
                          <tr key={g.course}>
                            <td className="py-1.5 px-2 font-medium text-gray-900 dark:text-white">{g.course}</td>
                            <td className={`py-1.5 px-2 text-center font-bold ${g.q1 === 'A' ? 'text-green-600' : 'text-lime-600'}`}>{g.q1}</td>
                            <td className={`py-1.5 px-2 text-center font-bold ${g.q2 === 'A' ? 'text-green-600' : 'text-lime-600'}`}>{g.q2}</td>
                            <td className={`py-1.5 px-2 text-center font-bold ${g.q3 === 'A' ? 'text-green-600' : 'text-lime-600'}`}>{g.q3}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CollapsibleSection>

                  {/* iREADY — red indicator, danger highlighting inside */}
                  <CollapsibleSection title="iReady" icon={<BookOpen size={16} />} statusColor="bg-red-500" tooltip="Diagnostic scores with trend graphs across testing windows. Red highlights flag declining performance so you can intervene early.">
                    <div className="space-y-3">
                      {/* Reading — DANGER: declining scores */}
                      <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 p-3 -mx-1">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle size={14} className="text-red-500" />
                          <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">Reading</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-base font-bold text-red-600 dark:text-red-400">415</span>
                              <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300">
                                Below Grade Level
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>458</span>
                              <span className="text-gray-300">&rarr;</span>
                              <span>438</span>
                              <span className="text-gray-300">&rarr;</span>
                              <span className="font-semibold text-red-500">415 &darr;</span>
                            </div>
                          </div>
                          <MiniTrendGraph points={[458, 438, 415]} color="#dc2626" />
                        </div>
                      </div>
                      {/* Math — OK */}
                      <div className="pt-3 border-t border-gray-100 dark:border-gray-700/50">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Math</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-base font-bold text-gray-900 dark:text-white">512</span>
                              <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                On Grade Level
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>478</span>
                              <span className="text-gray-300">&rarr;</span>
                              <span>495</span>
                              <span className="text-gray-300">&rarr;</span>
                              <span className="font-semibold text-wasabi-green">512</span>
                            </div>
                          </div>
                          <MiniTrendGraph points={[478, 495, 512]} color="#7c3aed" />
                        </div>
                      </div>
                    </div>
                  </CollapsibleSection>

                  {/* FAST */}
                  <CollapsibleSection title="FAST" icon={<Calculator size={16} />} statusColor="bg-green-500" tooltip="State assessment data imported directly from FAST exports. Three testing windows with proficiency tracking built in.">
                    <div className="space-y-3">
                      {/* ELA */}
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">ELA</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-base font-bold text-gray-900 dark:text-white">401</span>
                              <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                On Grade Level
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>368</span>
                              <span className="text-gray-300">&rarr;</span>
                              <span>385</span>
                              <span className="text-gray-300">&rarr;</span>
                              <span className="font-semibold text-wasabi-green">401</span>
                            </div>
                          </div>
                          <MiniTrendGraph points={[368, 385, 401]} color="#059669" />
                        </div>
                      </div>
                      {/* Math */}
                      <div className="pt-3 border-t border-gray-100 dark:border-gray-700/50">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Math</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-base font-bold text-gray-900 dark:text-white">422</span>
                              <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                On Grade Level
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>390</span>
                              <span className="text-gray-300">&rarr;</span>
                              <span>408</span>
                              <span className="text-gray-300">&rarr;</span>
                              <span className="font-semibold text-wasabi-green">422</span>
                            </div>
                          </div>
                          <MiniTrendGraph points={[390, 408, 422]} color="#d97706" />
                        </div>
                      </div>
                    </div>
                  </CollapsibleSection>

                  {/* DISCIPLINE */}
                  <CollapsibleSection title="Discipline" icon={<Shield size={16} />} statusColor="bg-green-500" tooltip="Behavioral records with incident types, actions taken, and patterns over time. Green means no concerns.">
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      No discipline records on file
                    </p>
                  </CollapsibleSection>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
