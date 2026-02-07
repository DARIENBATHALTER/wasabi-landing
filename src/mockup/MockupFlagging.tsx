import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMockupContext } from './MockupApp'
import { getFlagRules, getAllFlaggedStudents, getFlagCountBySeverity, type FlagRule, type StudentFlag } from '../data/flags'
import type { DemoStudent } from '../data/students'
import StudentAvatar from '../components/StudentAvatar'
import { Shield, AlertTriangle, AlertCircle, Info } from 'lucide-react'

export default function MockupFlagging() {
  const { setCurrentView, setSelectedStudents } = useMockupContext()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'rules' | 'students'>('students')

  useEffect(() => {
    setCurrentView('flagging')
  }, [setCurrentView])

  const rules = useMemo(() => getFlagRules(), [])
  const flaggedStudents = useMemo(() => getAllFlaggedStudents(), [])
  const severityCounts = useMemo(() => getFlagCountBySeverity(), [])

  const totalRules = rules.length
  const highCount = severityCounts.high
  const mediumCount = severityCounts.medium
  const lowCount = severityCounts.low

  const handleStudentClick = (student: DemoStudent) => {
    setSelectedStudents([student])
    navigate('/try/profile')
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Flagging System</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
        Automated rules identify students who may need additional support
      </p>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <SummaryCard
          icon={<Shield size={20} className="text-blue-500" />}
          label="Total Rules"
          value={String(totalRules)}
          bg="bg-blue-50 dark:bg-blue-900/20"
        />
        <SummaryCard
          icon={<AlertTriangle size={20} className="text-red-500" />}
          label="High Severity"
          value={String(highCount)}
          bg="bg-red-50 dark:bg-red-900/20"
        />
        <SummaryCard
          icon={<AlertCircle size={20} className="text-amber-500" />}
          label="Medium Severity"
          value={String(mediumCount)}
          bg="bg-amber-50 dark:bg-amber-900/20"
        />
        <SummaryCard
          icon={<Info size={20} className="text-yellow-500" />}
          label="Low Severity"
          value={String(lowCount)}
          bg="bg-yellow-50 dark:bg-yellow-900/20"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-5 w-fit">
        <button
          onClick={() => setActiveTab('students')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
            ${activeTab === 'students'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
        >
          Flagged Students ({flaggedStudents.length})
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
            ${activeTab === 'rules'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
        >
          Rules ({totalRules})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'rules' ? (
        <RulesView rules={rules} />
      ) : (
        <FlaggedStudentsView flaggedStudents={flaggedStudents} onStudentClick={handleStudentClick} />
      )}
    </div>
  )
}

/* ------- Rules Tab ------- */

function RulesView({ rules }: { rules: FlagRule[] }) {
  return (
    <div className="space-y-3">
      {rules.map(rule => (
        <div
          key={rule.id}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4"
        >
          <div className="flex items-start gap-3">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5"
              style={{ backgroundColor: rule.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{rule.name}</h3>
                <SeverityBadge severity={rule.severity} />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{rule.description}</p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">Criteria:</span>
                <span className="text-[11px] font-mono text-gray-700 dark:text-gray-300">{rule.criteria}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ------- Flagged Students Tab ------- */

function FlaggedStudentsView({
  flaggedStudents,
  onStudentClick,
}: {
  flaggedStudents: { student: DemoStudent; flags: StudentFlag[] }[]
  onStudentClick: (s: DemoStudent) => void
}) {
  if (flaggedStudents.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">No flagged students found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {flaggedStudents.map(({ student, flags }) => {
        const highFlags = flags.filter(f => f.severity === 'high')
        const medFlags = flags.filter(f => f.severity === 'medium')
        const lowFlags = flags.filter(f => f.severity === 'low')

        return (
          <div
            key={student.id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4
              hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start gap-3">
              <StudentAvatar
                firstName={student.firstName}
                lastName={student.lastName}
                gender={student.gender}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <button
                    onClick={() => onStudentClick(student)}
                    className="text-sm font-semibold text-gray-900 dark:text-white hover:text-wasabi-green dark:hover:text-wasabi-green transition-colors"
                  >
                    {student.lastName}, {student.firstName}
                  </button>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Grade {student.grade} &middot; {student.homeroom}
                  </span>
                </div>

                {/* Flag badges */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {flags.map((flag, i) => (
                    <span
                      key={i}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border
                        ${flag.severity === 'high'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                          : flag.severity === 'medium'
                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
                        }`}
                    >
                      {flag.severity === 'high' ? <AlertTriangle size={10} /> : <AlertCircle size={10} />}
                      {flag.message}
                    </span>
                  ))}
                </div>
              </div>

              {/* Severity summary on the right */}
              <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
                {highFlags.length > 0 && (
                  <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                    {highFlags.length}
                  </span>
                )}
                {medFlags.length > 0 && (
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
                    {medFlags.length}
                  </span>
                )}
                {lowFlags.length > 0 && (
                  <span className="w-6 h-6 rounded-full bg-yellow-500 text-white text-xs font-bold flex items-center justify-center">
                    {lowFlags.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ------- Shared ------- */

function SeverityBadge({ severity }: { severity: 'high' | 'medium' | 'low' }) {
  const styles = {
    high: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
    medium: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    low: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${styles[severity]}`}>
      {severity}
    </span>
  )
}

function SummaryCard({
  icon,
  label,
  value,
  bg,
}: {
  icon: React.ReactNode
  label: string
  value: string
  bg: string
}) {
  return (
    <div className={`rounded-xl p-4 ${bg} border border-gray-200/50 dark:border-gray-700/50`}>
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">{icon}</div>
        <div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        </div>
      </div>
    </div>
  )
}
