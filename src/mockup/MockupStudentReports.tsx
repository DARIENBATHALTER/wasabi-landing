import { useEffect, useState, useMemo, useRef } from 'react'
import { useMockupContext } from './MockupApp'
import { students, type DemoStudent } from '../data/students'
import { getStudentAttendanceRate, getStudentAttendance } from '../data/attendance'
import { getStudentGrades, getStudentGPA } from '../data/grades'
import { getStudentAssessments } from '../data/assessments'
import { getStudentDiscipline } from '../data/discipline'
import { getStudentFlags } from '../data/flags'
import StudentAvatar from '../components/StudentAvatar'
import {
  FileText,
  Download,
  Printer,
  Search,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  GraduationCap,
  BarChart3,
  Shield,
} from 'lucide-react'

type ReportType = 'comprehensive' | 'progress' | 'attendance' | 'assessment'

const reportTypes: { value: ReportType; label: string; description: string }[] = [
  { value: 'comprehensive', label: 'Comprehensive Report', description: 'Full student profile with all data sections' },
  { value: 'progress', label: 'Progress Report', description: 'Academic grades and GPA trends' },
  { value: 'attendance', label: 'Attendance Report', description: 'Attendance patterns and monthly breakdown' },
  { value: 'assessment', label: 'Assessment Report', description: 'iReady and FAST scores with trends' },
]

export default function MockupStudentReports() {
  const { setCurrentView } = useMockupContext()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<DemoStudent | null>(null)
  const [reportType, setReportType] = useState<ReportType>('comprehensive')
  const [showReport, setShowReport] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCurrentView('reports')
  }, [setCurrentView])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students
    const q = searchQuery.toLowerCase()
    return students.filter(
      s =>
        s.firstName.toLowerCase().includes(q) ||
        s.lastName.toLowerCase().includes(q) ||
        s.studentNumber.includes(q)
    )
  }, [searchQuery])

  const handleGenerate = () => {
    if (!selectedStudent) return
    setGenerating(true)
    setShowReport(false)
    setTimeout(() => {
      setGenerating(false)
      setShowReport(true)
    }, 1200)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Student Reports</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Generate and preview formatted reports for any student
      </p>

      {/* Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Student selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Select Student
            </label>
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600
                  rounded-lg cursor-pointer hover:border-wasabi-green transition-colors"
              >
                {selectedStudent ? (
                  <>
                    <StudentAvatar
                      firstName={selectedStudent.firstName}
                      lastName={selectedStudent.lastName}
                      gender={selectedStudent.gender}
                      size="xs"
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedStudent.lastName}, {selectedStudent.firstName}
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">Grade {selectedStudent.grade}</span>
                  </>
                ) : (
                  <span className="text-sm text-gray-400">Choose a student...</span>
                )}
                <ChevronDown size={16} className="text-gray-400 ml-auto flex-shrink-0" />
              </div>

              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                  rounded-lg shadow-xl z-30 max-h-64 overflow-hidden">
                  <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                    <div className="relative">
                      <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search students..."
                        className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-700 border-none rounded-md
                          text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-wasabi-green/50"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="overflow-y-auto max-h-48">
                    {filteredStudents.map(s => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSelectedStudent(s)
                          setShowDropdown(false)
                          setShowReport(false)
                          setSearchQuery('')
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors
                          ${selectedStudent?.id === s.id ? 'bg-wasabi-green/5 dark:bg-wasabi-green/10' : ''}`}
                      >
                        <StudentAvatar firstName={s.firstName} lastName={s.lastName} gender={s.gender} size="xs" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {s.lastName}, {s.firstName}
                          </p>
                          <p className="text-[11px] text-gray-400">Grade {s.grade} &middot; {s.homeroom}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Report type */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={e => {
                setReportType(e.target.value as ReportType)
                setShowReport(false)
              }}
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600
                rounded-lg text-sm text-gray-900 dark:text-white
                focus:outline-none focus:border-wasabi-green focus:ring-1 focus:ring-wasabi-green/30"
            >
              {reportTypes.map(rt => (
                <option key={rt.value} value={rt.value}>{rt.label}</option>
              ))}
            </select>
            <p className="text-[11px] text-gray-400 mt-1.5">
              {reportTypes.find(rt => rt.value === reportType)?.description}
            </p>
          </div>
        </div>

        {/* Generate button */}
        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={!selectedStudent || generating}
            className="flex items-center gap-2 px-5 py-2.5 bg-wasabi-green hover:bg-wasabi-green/90 disabled:bg-gray-300 dark:disabled:bg-gray-600
              text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <FileText size={16} />
            {generating ? 'Generating...' : 'Generate Report'}
          </button>
          {showReport && (
            <>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
                text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors">
                <Download size={16} />
                Export PDF
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
                text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors">
                <Printer size={16} />
                Print
              </button>
            </>
          )}
        </div>
      </div>

      {/* Generating animation */}
      {generating && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-12 text-center">
          <div className="inline-flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-wasabi-green border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Generating report for {selectedStudent?.firstName} {selectedStudent?.lastName}...</span>
          </div>
        </div>
      )}

      {/* Report preview */}
      {showReport && selectedStudent && (
        <ReportPreview student={selectedStudent} reportType={reportType} />
      )}
    </div>
  )
}

function ReportPreview({ student, reportType }: { student: DemoStudent; reportType: ReportType }) {
  const attendanceRate = useMemo(() => getStudentAttendanceRate(student.id), [student.id])
  const attendance = useMemo(() => getStudentAttendance(student.id), [student.id])
  const grades = useMemo(() => getStudentGrades(student.id), [student.id])
  const gpa = useMemo(() => getStudentGPA(student.id), [student.id])
  const assessments = useMemo(() => getStudentAssessments(student.id), [student.id])
  const discipline = useMemo(() => getStudentDiscipline(student.id), [student.id])
  const flags = useMemo(() => getStudentFlags(student.id), [student.id])

  const totalPresent = attendance.reduce((s, r) => s + r.present, 0)
  const totalAbsent = attendance.reduce((s, r) => s + r.absent, 0)
  const totalTardy = attendance.reduce((s, r) => s + r.tardy, 0)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      {/* Report header (simulates a printed doc) */}
      <div className="bg-gradient-to-r from-wasabi-dark to-gray-800 p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img src="/wasabi-landing/wasabilogo.png" alt="WASABI" className="w-6 h-6" />
              <span className="text-xs font-semibold tracking-wider uppercase opacity-70">WASABI Student Report</span>
            </div>
            <h2 className="text-2xl font-bold">{student.lastName}, {student.firstName}</h2>
            <p className="text-sm opacity-70 mt-1">
              Grade {student.grade} &middot; {student.homeroom} &middot; ID #{student.studentNumber}
            </p>
          </div>
          <div className="text-right text-xs opacity-60">
            <p>Generated: {new Date().toLocaleDateString()}</p>
            <p>Report Type: {reportTypes.find(r => r.value === reportType)?.label}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Flags warning */}
        {flags.length > 0 && (reportType === 'comprehensive' || reportType === 'progress') && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={16} className="text-red-500" />
              <h3 className="text-sm font-semibold text-red-700 dark:text-red-300">Active Flags ({flags.length})</h3>
            </div>
            <div className="space-y-1">
              {flags.map((f, i) => (
                <p key={i} className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    f.severity === 'high' ? 'bg-red-500' : f.severity === 'medium' ? 'bg-amber-500' : 'bg-yellow-500'
                  }`} />
                  {f.message}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Attendance section */}
        {(reportType === 'comprehensive' || reportType === 'attendance') && (
          <ReportSection icon={<Calendar size={16} />} title="Attendance Summary">
            <div className="grid grid-cols-4 gap-3 mb-4">
              <MiniStat label="Rate" value={`${attendanceRate}%`} color={attendanceRate >= 95 ? 'green' : attendanceRate >= 90 ? 'yellow' : 'red'} />
              <MiniStat label="Present" value={String(totalPresent)} color="green" />
              <MiniStat label="Absent" value={String(totalAbsent)} color="red" />
              <MiniStat label="Tardy" value={String(totalTardy)} color="yellow" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-1.5 px-2 text-gray-500 font-semibold">Month</th>
                    <th className="text-center py-1.5 px-2 text-gray-500 font-semibold">Present</th>
                    <th className="text-center py-1.5 px-2 text-gray-500 font-semibold">Absent</th>
                    <th className="text-center py-1.5 px-2 text-gray-500 font-semibold">Tardy</th>
                    <th className="text-center py-1.5 px-2 text-gray-500 font-semibold">Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {attendance.map(r => (
                    <tr key={r.month}>
                      <td className="py-1.5 px-2 font-medium text-gray-900 dark:text-white">{r.month}</td>
                      <td className="py-1.5 px-2 text-center text-green-600">{r.present}</td>
                      <td className="py-1.5 px-2 text-center text-red-600">{r.absent}</td>
                      <td className="py-1.5 px-2 text-center text-yellow-600">{r.tardy}</td>
                      <td className="py-1.5 px-2 text-center font-semibold">{r.rate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ReportSection>
        )}

        {/* Grades section */}
        {(reportType === 'comprehensive' || reportType === 'progress') && (
          <ReportSection icon={<GraduationCap size={16} />} title={`Academic Grades (GPA: ${gpa.toFixed(2)})`}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-1.5 px-2 text-gray-500 font-semibold">Course</th>
                    <th className="text-center py-1.5 px-2 text-gray-500 font-semibold">Q1</th>
                    <th className="text-center py-1.5 px-2 text-gray-500 font-semibold">Q2</th>
                    <th className="text-center py-1.5 px-2 text-gray-500 font-semibold">Q3</th>
                    <th className="text-center py-1.5 px-2 text-gray-500 font-semibold">Q4</th>
                    <th className="text-center py-1.5 px-2 text-gray-500 font-semibold">Current</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {grades.map(g => (
                    <tr key={g.course}>
                      <td className="py-1.5 px-2 font-medium text-gray-900 dark:text-white">{g.course}</td>
                      <td className={`py-1.5 px-2 text-center font-bold ${gradeColor(g.q1)}`}>{g.q1}</td>
                      <td className={`py-1.5 px-2 text-center font-bold ${gradeColor(g.q2)}`}>{g.q2}</td>
                      <td className={`py-1.5 px-2 text-center font-bold ${gradeColor(g.q3)}`}>{g.q3}</td>
                      <td className={`py-1.5 px-2 text-center font-bold ${gradeColor(g.q4)}`}>{g.q4}</td>
                      <td className={`py-1.5 px-2 text-center font-bold ${gradeColor(g.current)}`}>{g.current}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ReportSection>
        )}

        {/* Assessment section */}
        {(reportType === 'comprehensive' || reportType === 'assessment') && (
          <ReportSection icon={<BarChart3 size={16} />} title="Assessment Scores">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-1.5 px-2 text-gray-500 font-semibold">Assessment</th>
                    <th className="text-center py-1.5 px-2 text-gray-500 font-semibold">Period</th>
                    <th className="text-center py-1.5 px-2 text-gray-500 font-semibold">Score</th>
                    <th className="text-center py-1.5 px-2 text-gray-500 font-semibold">Percentile</th>
                    <th className="text-center py-1.5 px-2 text-gray-500 font-semibold">Proficiency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {assessments.map((a, i) => (
                    <tr key={i}>
                      <td className="py-1.5 px-2 font-medium text-gray-900 dark:text-white">{sourceLabel(a.source)}</td>
                      <td className="py-1.5 px-2 text-center text-gray-600 dark:text-gray-400">{a.period}</td>
                      <td className="py-1.5 px-2 text-center font-semibold text-gray-900 dark:text-white">{a.score}</td>
                      <td className="py-1.5 px-2 text-center text-gray-600 dark:text-gray-400">{a.percentile}th</td>
                      <td className="py-1.5 px-2 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${profBadge(a.proficiency || '')}`}>
                          {a.proficiency}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ReportSection>
        )}

        {/* Discipline section */}
        {reportType === 'comprehensive' && discipline.length > 0 && (
          <ReportSection icon={<Shield size={16} />} title={`Discipline Records (${discipline.length})`}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-1.5 px-2 text-gray-500 font-semibold">Date</th>
                    <th className="text-left py-1.5 px-2 text-gray-500 font-semibold">Infraction</th>
                    <th className="text-left py-1.5 px-2 text-gray-500 font-semibold">Action</th>
                    <th className="text-left py-1.5 px-2 text-gray-500 font-semibold">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {discipline.map((d, i) => (
                    <tr key={i}>
                      <td className="py-1.5 px-2 text-gray-900 dark:text-white">{d.date}</td>
                      <td className="py-1.5 px-2 text-gray-600 dark:text-gray-400">{d.infraction}</td>
                      <td className="py-1.5 px-2">
                        <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                          {d.action}
                        </span>
                      </td>
                      <td className="py-1.5 px-2 text-gray-500">{d.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ReportSection>
        )}

        {/* Report footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
          <div className="flex items-center justify-between text-[10px] text-gray-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={12} className="text-wasabi-green" />
              Report generated by WASABI
            </div>
            <span>Confidential - For authorized personnel only</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReportSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
        <span className="text-wasabi-green">{icon}</span>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function MiniStat({ label, value, color }: { label: string; value: string; color: 'green' | 'yellow' | 'red' }) {
  const colorClass = {
    green: 'text-green-600 dark:text-green-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    red: 'text-red-600 dark:text-red-400',
  }[color]

  return (
    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-2.5 text-center">
      <p className={`text-lg font-bold ${colorClass}`}>{value}</p>
      <p className="text-[10px] text-gray-500">{label}</p>
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
    default: return 'text-gray-600'
  }
}

function sourceLabel(source: string): string {
  switch (source) {
    case 'iready-reading': return 'iReady Reading'
    case 'iready-math': return 'iReady Math'
    case 'fast-ela': return 'FAST ELA'
    case 'fast-math': return 'FAST Math'
    default: return source
  }
}

function profBadge(prof: string): string {
  switch (prof) {
    case 'Above Grade Level': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
    case 'On Grade Level': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
    case 'Approaching': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
    case 'Below': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
    default: return 'bg-gray-100 dark:bg-gray-800 text-gray-600'
  }
}
