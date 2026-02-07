import { useState, useEffect, useCallback, useRef } from 'react'
import {
  BarChart3,
  ShieldAlert,
  ClipboardList,
  FileUp,
  TrendingUp,
  AlertCircle,
  MessageSquare,
  CheckCircle,
  FileSpreadsheet,
  Flag,
  Wrench,
} from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import GlassCard from '../components/GlassCard'

interface TabData {
  id: string
  label: string
  icon: React.ElementType
  title: string
  description: string
  bullets: string[]
  visual: React.ReactNode
}

function AnalyticsVisual() {
  const subjects = [
    { label: 'ELA', pct: 72, color: '#008800' },
    { label: 'Math', pct: 58, color: '#3b82f6' },
    { label: 'Science', pct: 85, color: '#7c3aed' },
    { label: 'Soc. Studies', pct: 64, color: '#f59e0b' },
  ]

  return (
    <GlassCard className="p-6 w-full max-w-md mx-auto">
      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
        Grade 3 &mdash; Proficiency Overview
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">Q2 Assessment Results</p>

      <div className="space-y-4">
        {subjects.map((s) => (
          <div key={s.label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{s.label}</span>
              <span className="text-sm font-bold" style={{ color: s.color }}>{s.pct}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${s.pct}%`, backgroundColor: s.color }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">Class Average</span>
          <span className="text-lg font-bold text-wasabi-green">70%</span>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          +4% from Q1 &middot; 28 students
        </p>
      </div>
    </GlassCard>
  )
}

function EarlyWarningVisual() {
  const alerts = [
    { name: 'Jaylen T.', flag: 'Attendance < 85%', color: 'bg-red-500', icon: Flag },
    { name: 'Sofia M.', flag: 'GPA Declining', color: 'bg-amber-500', icon: TrendingUp },
    { name: 'Marcus W.', flag: 'Missing Assignments', color: 'bg-orange-500', icon: AlertCircle },
  ]

  return (
    <GlassCard className="p-6 w-full max-w-md mx-auto">
      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
        Active Alerts
      </p>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.name}
            className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
          >
            <div className={`w-10 h-10 rounded-full ${alert.color} flex items-center justify-center flex-shrink-0`}>
              <alert.icon className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {alert.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{alert.flag}</p>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

function PDVisual() {
  const items = [
    { label: 'Classroom Management', rating: 5, checked: true },
    { label: 'Student Engagement', rating: 4, checked: true },
    { label: 'Instructional Delivery', rating: 0, checked: false },
    { label: 'Differentiation', rating: 0, checked: false },
  ]

  return (
    <GlassCard className="p-6 w-full max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-5">
        <ClipboardList className="w-5 h-5 text-wasabi-green" />
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          SOBA Observation
        </span>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        Ms. Johnson &middot; Room 204 &middot; In Progress
      </p>
      <div className="space-y-2.5">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                  item.checked
                    ? 'bg-wasabi-green text-white'
                    : 'border-2 border-gray-300 dark:border-gray-600'
                }`}
              >
                {item.checked && <CheckCircle className="w-3.5 h-3.5" />}
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
            </div>
            {item.rating > 0 && (
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i < item.rating ? 'bg-amber-400' : 'bg-gray-300 dark:bg-gray-600'}`} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

function DataImportVisual() {
  const sources = [
    { name: 'FOCUS', color: 'bg-blue-500' },
    { name: 'iReady', color: 'bg-purple-500' },
    { name: 'FAST', color: 'bg-orange-500' },
    { name: 'STAR', color: 'bg-amber-500' },
    { name: 'Achieve3000', color: 'bg-teal-500' },
    { name: 'Excel/CSV', color: 'bg-green-600' },
  ]

  return (
    <GlassCard className="p-6 w-full max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-5">
        <FileSpreadsheet className="w-5 h-5 text-wasabi-green" />
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          Data Sources
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {sources.map((source) => (
          <div
            key={source.name}
            className="flex items-center gap-2.5 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
          >
            <div className={`w-3 h-3 rounded-full ${source.color} flex-shrink-0`} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {source.name}
            </span>
          </div>
        ))}
      </div>
      <div className="p-3 rounded-lg bg-wasabi-green/10 border border-wasabi-green/20">
        <div className="flex items-center gap-2 mb-1">
          <Wrench className="w-3.5 h-3.5 text-wasabi-green" />
          <p className="text-xs font-semibold text-wasabi-green">Custom Integrations</p>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          Need a data source we don't support yet? As a local partner, we'll work directly with
          your team to build a custom integration for
          <span className="font-semibold text-gray-800 dark:text-gray-200"> any </span>
          system your school uses.
        </p>
      </div>
    </GlassCard>
  )
}

const tabs: TabData[] = [
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    title: 'See the patterns that matter',
    description:
      'From classroom-level snapshots to grade-wide trends, WASABI gives your school the visual analytics tools that big districts take for granted — without the big district price tag or complexity.',
    bullets: [
      'Class and grade-level performance dashboards',
      'Trend analysis across FAST, iReady, and other Florida assessments',
      'Filterable charts by demographics and subgroups',
      'Export-ready reports for leadership and district',
    ],
    visual: <AnalyticsVisual />,
  },
  {
    id: 'early-warning',
    label: 'Early Warning',
    icon: ShieldAlert,
    title: 'Catch it before it\'s too late',
    description:
      'WASABI\'s early warning system automatically flags students who are showing signs of falling behind — pulling from FAST scores, iReady diagnostics, attendance, and grades — so your team can intervene at the right time.',
    bullets: [
      'Automatic flags for attendance, grades, and behavior',
      'Customizable thresholds for your school\'s needs',
      'Prioritized alert dashboard for intervention teams',
      'Track intervention outcomes over time',
    ],
    visual: <EarlyWarningVisual />,
  },
  {
    id: 'pd',
    label: 'Prof. Development',
    icon: ClipboardList,
    title: 'Structured classroom observations',
    description:
      'WASABI\'s built-in observation tool gives coaches and administrators a consistent, data-driven framework for classroom walkthroughs and professional development.',
    bullets: [
      'Customizable observation rubrics and checklists',
      'Real-time observation capture on any device',
      'Aggregate observation data across teachers',
      'Actionable feedback tied to professional development',
    ],
    visual: <PDVisual />,
  },
  {
    id: 'data-import',
    label: 'Data Import',
    icon: FileUp,
    title: 'Works with the tools you already use',
    description:
      'No complicated migrations or IT projects. Just drag, drop, and match. WASABI natively understands FOCUS exports, FAST results, and iReady diagnostics — the formats Florida schools actually work with — and we\'ll build custom integrations for any other data source you need.',
    bullets: [
      'Native support for FOCUS, iReady, FAST, STAR, and other Florida platforms',
      'Support for Excel, CSV, and standardized exports',
      'Smart column matching with fuzzy student lookup',
      'Custom integrations built for your school\'s unique data sources',
    ],
    visual: <DataImportVisual />,
  },
]

export default function FeatureTabs() {
  const [activeTab, setActiveTab] = useState(0)
  const { ref, isVisible } = useScrollAnimation()
  const timerRef = useRef<ReturnType<typeof setInterval>>(null)

  const advance = useCallback(() => {
    setActiveTab(prev => (prev + 1) % tabs.length)
  }, [])

  // Auto-advance every 7 seconds
  useEffect(() => {
    timerRef.current = setInterval(advance, 7000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [advance])

  // Reset timer on manual click
  const handleTabClick = useCallback((index: number) => {
    setActiveTab(index)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(advance, 7000)
  }, [advance])

  const active = tabs[activeTab]

  return (
    <section id="features" className="py-14 md:py-24 bg-white dark:bg-gray-950 relative">
      <div
        ref={ref}
        className={`section-container transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-gray-900 dark:text-white mb-4">
            Everything you need,{' '}
            <span className="gradient-text">in one place</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Powerful tools working together to give you the clearest picture of every student.
          </p>
        </div>

        {/* Tab Bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(index)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === index
                  ? 'bg-wasabi-green text-white shadow-md shadow-wasabi-green/20'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div key={active.id} className="animate-fade-in">
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-gray-900 dark:text-white mb-4">
              {active.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              {active.description}
            </p>
            <ul className="space-y-3">
              {active.bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-wasabi-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MessageSquare className="w-3 h-3 text-wasabi-green" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Visual */}
          <div key={`visual-${active.id}`} className="flex justify-center animate-fade-in">
            {active.visual}
          </div>
        </div>
      </div>
    </section>
  )
}
