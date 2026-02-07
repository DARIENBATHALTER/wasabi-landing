import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMockupContext } from './MockupApp'
import { students, type DemoStudent } from '../data/students'
import { getStudentAttendance, getStudentAttendanceRate, getMonthlyAttendanceForChart } from '../data/attendance'
import { getStudentGrades, getStudentGPA } from '../data/grades'
import { getStudentAssessments, getAssessmentTrend } from '../data/assessments'
import { getStudentDiscipline } from '../data/discipline'
import { getStudentFlags } from '../data/flags'
import StudentAvatar from '../components/StudentAvatar'
import AttendanceChart from '../components/charts/AttendanceChart'
import AssessmentTrendChart from '../components/charts/AssessmentTrendChart'
import { ArrowLeft, ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react'

interface SectionProps {
  title: string
  defaultOpen?: boolean
  statusColor?: 'green' | 'yellow' | 'red' | 'gray'
  children: React.ReactNode
}

function CollapsibleSection({ title, defaultOpen = false, statusColor = 'gray', children }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const dotColor = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    gray: 'bg-gray-400',
  }[statusColor]

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800/50
          hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
      >
        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dotColor}`} />
        <span className="flex-1 text-sm font-semibold text-gray-900 dark:text-white">{title}</span>
        {isOpen ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
      </button>
      {isOpen && (
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/30">
          {children}
        </div>
      )}
    </div>
  )
}

function gradeColor(grade: string): string {
  switch (grade) {
    case 'A': return 'text-green-600 dark:text-green-400'
    case 'B': return 'text-lime-600 dark:text-lime-400'
    case 'C': return 'text-yellow-600 dark:text-yellow-400'
    case 'D': return 'text-orange-600 dark:text-orange-400'
    case 'F': return 'text-red-600 dark:text-red-400'
    default: return 'text-gray-600 dark:text-gray-400'
  }
}

function flagSeverityColor(severity: string): string {
  switch (severity) {
    case 'high': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
    case 'medium': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
    case 'low': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
    default: return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
  }
}

function attendanceStatusColor(rate: number): 'green' | 'yellow' | 'red' {
  if (rate >= 95) return 'green'
  if (rate >= 90) return 'yellow'
  return 'red'
}

export default function MockupProfileCard() {
  const { selectedStudents, setCurrentView } = useMockupContext()
  const navigate = useNavigate()

  useEffect(() => {
    setCurrentView('profile')
  }, [setCurrentView])

  // Use first selected student, or default to first student in the list
  const student: DemoStudent = selectedStudents[0] || students[0]

  // Pre-compute all data for this student
  const attendanceRate = useMemo(() => getStudentAttendanceRate(student.id), [student.id])
  const attendanceRecords = useMemo(() => getStudentAttendance(student.id), [student.id])
  const attendanceChart = useMemo(() => getMonthlyAttendanceForChart(student.id), [student.id])
  const grades = useMemo(() => getStudentGrades(student.id), [student.id])
  const gpa = useMemo(() => getStudentGPA(student.id), [student.id])
  const assessments = useMemo(() => getStudentAssessments(student.id), [student.id])
  const discipline = useMemo(() => getStudentDiscipline(student.id), [student.id])
  const flags = useMemo(() => getStudentFlags(student.id), [student.id])

  // Assessment trends
  const ireadyReadingTrend = useMemo(() => getAssessmentTrend(student.id, 'iready-reading'), [student.id])
  const ireadyMathTrend = useMemo(() => getAssessmentTrend(student.id, 'iready-math'), [student.id])
  const fastElaTrend = useMemo(() => getAssessmentTrend(student.id, 'fast-ela'), [student.id])
  const fastMathTrend = useMemo(() => getAssessmentTrend(student.id, 'fast-math'), [student.id])

  // Aggregate attendance stats
  const totalPresent = attendanceRecords.reduce((s, r) => s + r.present, 0)
  const totalAbsent = attendanceRecords.reduce((s, r) => s + r.absent, 0)
  const totalTardy = attendanceRecords.reduce((s, r) => s + r.tardy, 0)

  // Latest assessment scores
  const getLatestAssessment = (source: string) => {
    const recs = assessments.filter(a => a.source === source)
    return recs.length > 0 ? recs[recs.length - 1] : null
  }

  // Determine section status colors based on flags
  const attendanceStatus = attendanceStatusColor(attendanceRate)
  const gradeStatus: 'green' | 'yellow' | 'red' = gpa >= 3.0 ? 'green' : gpa >= 2.0 ? 'yellow' : 'red'
  const assessmentStatus = (source: string): 'green' | 'yellow' | 'red' => {
    const latest = getLatestAssessment(source)
    if (!latest) return 'gray' as any
    if (latest.proficiency === 'Above Grade Level') return 'green'
    if (latest.proficiency === 'On Grade Level') return 'green'
    if (latest.proficiency === 'Approaching') return 'yellow'
    return 'red'
  }
  const disciplineStatus: 'green' | 'yellow' | 'red' | 'gray' = discipline.length === 0 ? 'green' : discipline.length >= 3 ? 'red' : 'yellow'

  return (
    <div data-tour="profile" className="max-w-3xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/try/search')}
        className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400
          hover:text-wasabi-green dark:hover:text-wasabi-green transition-colors mb-4"
      >
        <ArrowLeft size={16} />
        Back to Search
      </button>

      {/* Profile header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 md:p-6 mb-5">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          {/* Avatar */}
          <StudentAvatar
            firstName={student.firstName}
            lastName={student.lastName}
            gender={student.gender}
            size="xl"
            className="flex-shrink-0"
          />

          <div className="flex-1 min-w-0">
            {/* Name */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {student.lastName}, {student.firstName}
            </h1>

            {/* Info grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              <InfoChip label="Grade" value={student.grade} />
              <InfoChip label="Homeroom" value={student.homeroom} />
              <InfoChip label="Student ID" value={`#${student.studentNumber}`} />
              <InfoChip label="Gender" value={student.gender === 'male' ? 'Male' : 'Female'} />
              <InfoChip label="DOB" value={student.dateOfBirth} />
            </div>

            {/* Flags */}
            {flags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {flags.map((flag, i) => (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${flagSeverityColor(flag.severity)}`}
                  >
                    <AlertTriangle size={12} />
                    {flag.message}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Collapsible sections */}
      <div className="space-y-3">
        {/* ATTENDANCE */}
        <CollapsibleSection title="Attendance" defaultOpen statusColor={attendanceStatus}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <StatCard
              label="Attendance Rate"
              value={`${attendanceRate}%`}
              color={attendanceRate >= 95 ? 'text-green-600' : attendanceRate >= 90 ? 'text-yellow-600' : 'text-red-600'}
            />
            <StatCard label="Days Present" value={String(totalPresent)} color="text-green-600" />
            <StatCard label="Days Absent" value={String(totalAbsent)} color="text-red-600" />
            <StatCard label="Days Tardy" value={String(totalTardy)} color="text-yellow-600" />
          </div>
          <AttendanceChart data={attendanceChart} title="Monthly Attendance Trend" height={220} />
        </CollapsibleSection>

        {/* GRADES */}
        <CollapsibleSection title="Grades" statusColor={gradeStatus}>
          <div className="mb-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">Current GPA: </span>
            <span className={`text-lg font-bold ${gpa >= 3.0 ? 'text-green-600' : gpa >= 2.0 ? 'text-yellow-600' : 'text-red-600'}`}>
              {gpa.toFixed(2)}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Course</th>
                  <th className="text-center py-2 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Q1</th>
                  <th className="text-center py-2 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Q2</th>
                  <th className="text-center py-2 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Q3</th>
                  <th className="text-center py-2 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Q4</th>
                  <th className="text-center py-2 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Current</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {grades.map((g) => (
                  <tr key={g.course} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="py-2 px-2 text-gray-900 dark:text-white font-medium">{g.course}</td>
                    <td className={`py-2 px-2 text-center font-bold ${gradeColor(g.q1)}`}>{g.q1}</td>
                    <td className={`py-2 px-2 text-center font-bold ${gradeColor(g.q2)}`}>{g.q2}</td>
                    <td className={`py-2 px-2 text-center font-bold ${gradeColor(g.q3)}`}>{g.q3}</td>
                    <td className={`py-2 px-2 text-center font-bold ${gradeColor(g.q4)}`}>{g.q4}</td>
                    <td className={`py-2 px-2 text-center font-bold ${gradeColor(g.current)}`}>{g.current}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CollapsibleSection>

        {/* iREADY READING */}
        <CollapsibleSection title="iReady Reading" statusColor={assessmentStatus('iready-reading')}>
          <AssessmentDetail
            trend={ireadyReadingTrend}
            latest={getLatestAssessment('iready-reading')}
            color="#2563eb"
            title="iReady Reading: BOY - MOY - EOY"
          />
        </CollapsibleSection>

        {/* iREADY MATH */}
        <CollapsibleSection title="iReady Math" statusColor={assessmentStatus('iready-math')}>
          <AssessmentDetail
            trend={ireadyMathTrend}
            latest={getLatestAssessment('iready-math')}
            color="#7c3aed"
            title="iReady Math: BOY - MOY - EOY"
          />
        </CollapsibleSection>

        {/* FAST ELA */}
        <CollapsibleSection title="FAST ELA" statusColor={assessmentStatus('fast-ela')}>
          <AssessmentDetail
            trend={fastElaTrend}
            latest={getLatestAssessment('fast-ela')}
            color="#059669"
            title="FAST ELA: PM1 - PM2 - PM3"
          />
        </CollapsibleSection>

        {/* FAST MATH */}
        <CollapsibleSection title="FAST Math" statusColor={assessmentStatus('fast-math')}>
          <AssessmentDetail
            trend={fastMathTrend}
            latest={getLatestAssessment('fast-math')}
            color="#d97706"
            title="FAST Math: PM1 - PM2 - PM3"
          />
        </CollapsibleSection>

        {/* DISCIPLINE */}
        {discipline.length > 0 ? (
          <CollapsibleSection title={`Discipline (${discipline.length} record${discipline.length > 1 ? 's' : ''})`} statusColor={disciplineStatus}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Date</th>
                    <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Infraction</th>
                    <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Action</th>
                    <th className="text-left py-2 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {discipline.map((d, i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="py-2 px-2 text-gray-900 dark:text-white">{d.date}</td>
                      <td className="py-2 px-2 text-gray-700 dark:text-gray-300">{d.infraction}</td>
                      <td className="py-2 px-2">
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                          {d.action}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-gray-500 dark:text-gray-400">{d.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CollapsibleSection>
        ) : (
          <CollapsibleSection title="Discipline" statusColor="green">
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              No discipline records on file
            </p>
          </CollapsibleSection>
        )}
      </div>
    </div>
  )
}

/* ------ Sub-components ------ */

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/40 rounded-lg px-3 py-2">
      <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5 truncate">{value}</p>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 text-center">
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
    </div>
  )
}

function AssessmentDetail({
  trend,
  latest,
  color,
  title,
}: {
  trend: { name: string; score: number; benchmark: number }[]
  latest: { score: number; percentile?: number; proficiency?: string } | null
  color: string
  title: string
}) {
  const proficiencyBadge = (prof: string) => {
    const colors: Record<string, string> = {
      'Above Grade Level': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      'On Grade Level': 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
      'Approaching': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      'Below': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    }
    return colors[prof] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
  }

  return (
    <div>
      {latest && (
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Latest Score: </span>
            <span className="text-lg font-bold text-gray-900 dark:text-white">{latest.score}</span>
          </div>
          {latest.percentile && (
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Percentile: </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{latest.percentile}th</span>
            </div>
          )}
          {latest.proficiency && (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${proficiencyBadge(latest.proficiency)}`}>
              {latest.proficiency}
            </span>
          )}
        </div>
      )}
      <AssessmentTrendChart data={trend} title={title} height={200} color={color} />
    </div>
  )
}
