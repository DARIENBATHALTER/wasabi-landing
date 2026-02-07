import { useState } from 'react'
import {
  User,
  BarChart3,
  ShieldAlert,
  Bot,
  ClipboardList,
  FileUp,
  TrendingUp,
  AlertCircle,
  MessageSquare,
  CheckCircle,
  FileSpreadsheet,
  Flag,
} from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import StudentAvatar from '../components/StudentAvatar'
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

function StudentProfileVisual() {
  return (
    <GlassCard className="p-5 max-w-xs mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <StudentAvatar firstName="Maya" lastName="Rodriguez" gender="female" size="lg" />
        <div>
          <p className="font-semibold text-gray-900 dark:text-white text-sm">Maya Rodriguez</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Grade 4 &middot; Ms. Johnson</p>
        </div>
      </div>
      <div className="space-y-2">
        {[
          { label: 'GPA', value: '3.4', color: 'text-wasabi-green' },
          { label: 'Attendance', value: '96%', color: 'text-blue-500' },
          { label: 'iReady Math', value: '512', color: 'text-purple-500' },
          { label: 'FAST Reading', value: 'L3', color: 'text-amber-500' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-sm"
          >
            <span className="text-gray-600 dark:text-gray-400">{stat.label}</span>
            <span className={`font-semibold ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

function AnalyticsVisual() {
  const bars = [
    { label: 'ELA', height: 72, color: 'bg-wasabi-green' },
    { label: 'Math', height: 58, color: 'bg-blue-500' },
    { label: 'Sci', height: 85, color: 'bg-purple-500' },
    { label: 'SS', height: 64, color: 'bg-amber-500' },
  ]

  return (
    <GlassCard className="p-5 max-w-xs mx-auto">
      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
        Grade 3 &mdash; Proficiency Rates
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Q2 Assessment Results</p>
      <div className="flex items-end justify-around gap-3 h-32">
        {bars.map((bar) => (
          <div key={bar.label} className="flex flex-col items-center gap-1 flex-1">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {bar.height}%
            </span>
            <div
              className={`w-full rounded-t-md ${bar.color} transition-all duration-700`}
              style={{ height: `${bar.height}%` }}
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">{bar.label}</span>
          </div>
        ))}
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
    <GlassCard className="p-5 max-w-xs mx-auto">
      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Active Alerts
      </p>
      <div className="space-y-2.5">
        {alerts.map((alert) => (
          <div
            key={alert.name}
            className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/50"
          >
            <div className={`w-8 h-8 rounded-full ${alert.color} flex items-center justify-center flex-shrink-0`}>
              <alert.icon className="w-4 h-4 text-white" />
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

function AIChatVisual() {
  return (
    <GlassCard className="p-5 max-w-xs mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-full bg-wasabi-green flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-semibold text-gray-900 dark:text-white">Nori</span>
        <span className="text-xs text-gray-400 ml-auto">AI Assistant</span>
      </div>
      <div className="space-y-3">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl rounded-tl-sm p-3">
          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
            Show me all 3rd graders who scored below level on FAST but have a GPA above 3.0.
          </p>
        </div>
        <div className="bg-wasabi-green/10 rounded-xl rounded-tr-sm p-3 ml-4">
          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
            Found <span className="font-semibold text-wasabi-green">7 students</span> matching
            that criteria. 3 also have attendance flags. Want me to generate a report?
          </p>
        </div>
      </div>
    </GlassCard>
  )
}

function SOBAVisual() {
  const items = [
    { label: 'Classroom Management', checked: true },
    { label: 'Student Engagement', checked: true },
    { label: 'Instructional Delivery', checked: false },
    { label: 'Differentiation', checked: false },
  ]

  return (
    <GlassCard className="p-5 max-w-xs mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList className="w-5 h-5 text-wasabi-green" />
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          SOBA Observation
        </span>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
        Ms. Johnson &middot; Room 204 &middot; In Progress
      </p>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-2.5 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50"
          >
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
    { name: 'Excel', color: 'bg-green-600' },
    { name: 'CSV', color: 'bg-gray-500' },
  ]

  return (
    <GlassCard className="p-5 max-w-xs mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <FileSpreadsheet className="w-5 h-5 text-wasabi-green" />
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          Supported Sources
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {sources.map((source) => (
          <div
            key={source.name}
            className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/50"
          >
            <div className={`w-2.5 h-2.5 rounded-full ${source.color} flex-shrink-0`} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {source.name}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 p-2.5 rounded-lg bg-wasabi-green/10 text-center">
        <p className="text-xs text-wasabi-green font-medium">
          Drag & drop to import
        </p>
      </div>
    </GlassCard>
  )
}

const tabs: TabData[] = [
  {
    id: 'profiles',
    label: 'Student Profiles',
    icon: User,
    title: 'Every data point, one screen',
    description:
      'No more toggling between systems. WASABI pulls together attendance, grades, assessment scores, behavior records, and demographic data into a single, beautiful student profile.',
    bullets: [
      'Unified view of all student data in one place',
      'Real-time data from every connected source',
      'Customizable profile cards for quick scanning',
      'Full history and trend tracking per student',
    ],
    visual: <StudentProfileVisual />,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    title: 'See the patterns that matter',
    description:
      'From classroom-level snapshots to grade-wide trends, WASABI gives you the visual analytics tools to spot what matters and act on it.',
    bullets: [
      'Class and grade-level performance dashboards',
      'Trend analysis across multiple assessments',
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
      'WASABI\'s early warning system automatically flags students who are showing signs of falling behind, so your team can intervene at the right time.',
    bullets: [
      'Automatic flags for attendance, grades, and behavior',
      'Customizable thresholds for your school\'s needs',
      'Prioritized alert dashboard for intervention teams',
      'Track intervention outcomes over time',
    ],
    visual: <EarlyWarningVisual />,
  },
  {
    id: 'ai-assistant',
    label: 'AI Assistant',
    icon: Bot,
    title: 'Meet Nori, your data copilot',
    description:
      'Ask questions in plain English and get instant answers. Nori helps you explore your data, generate reports, and uncover insights you didn\'t know to look for.',
    bullets: [
      'Natural language queries over all your student data',
      'Instant report generation and export',
      'Smart suggestions based on your school\'s patterns',
      'Privacy-first design: your data stays yours',
    ],
    visual: <AIChatVisual />,
  },
  {
    id: 'soba',
    label: 'SOBA',
    icon: ClipboardList,
    title: 'Structured classroom observations',
    description:
      'SOBA (Structured Observation and Benchmarking Assessment) gives coaches and administrators a consistent, data-driven framework for classroom walkthroughs.',
    bullets: [
      'Customizable observation rubrics and checklists',
      'Real-time observation capture on any device',
      'Aggregate observation data across teachers',
      'Actionable feedback tied to professional development',
    ],
    visual: <SOBAVisual />,
  },
  {
    id: 'data-import',
    label: 'Data Import',
    icon: FileUp,
    title: 'Works with the tools you already use',
    description:
      'No complicated migrations or IT projects. Just drag, drop, and match. WASABI understands the formats your district already uses.',
    bullets: [
      'Import from FOCUS, iReady, FAST, STAR, and more',
      'Support for Excel, CSV, and standardized exports',
      'Smart column matching with fuzzy student lookup',
      'Import validation with detailed error reporting',
    ],
    visual: <DataImportVisual />,
  },
]

export default function FeatureTabs() {
  const [activeTab, setActiveTab] = useState(0)
  const { ref, isVisible } = useScrollAnimation()

  const active = tabs[activeTab]

  return (
    <section id="features" className="py-24 bg-white dark:bg-gray-950 relative">
      <div
        ref={ref}
        className={`section-container transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-gray-900 dark:text-white mb-4">
            Everything you need,{' '}
            <span className="gradient-text">in one place</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Six powerful tools working together to give you the clearest picture of every student.
          </p>
        </div>

        {/* Tab Bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(index)}
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
        <div className="grid lg:grid-cols-2 gap-12 items-center">
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
