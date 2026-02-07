import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMockupContext } from './MockupApp'
import { students, type DemoStudent } from '../data/students'
import { getStudentAttendanceRate } from '../data/attendance'
import { getStudentGPA } from '../data/grades'
import { getStudentLatestScores, getClassProficiency } from '../data/assessments'
import { getStudentFlags } from '../data/flags'
import StudentAvatar from '../components/StudentAvatar'
import ProficiencyChart from '../components/charts/ProficiencyChart'
import GradeDistributionChart from '../components/charts/GradeDistributionChart'
import { Users, TrendingUp, GraduationCap, AlertTriangle } from 'lucide-react'

export default function MockupAnalytics() {
  const { setCurrentView, setSelectedStudents } = useMockupContext()
  const navigate = useNavigate()

  useEffect(() => {
    setCurrentView('analytics')
  }, [setCurrentView])

  // Get unique homerooms
  const homerooms = useMemo(() => {
    const set = new Set(students.map(s => s.homeroom))
    return Array.from(set).sort()
  }, [])

  const [selectedHomeroom, setSelectedHomeroom] = useState(homerooms[0])

  // Students in selected homeroom
  const homeroomStudents = useMemo(() =>
    students.filter(s => s.homeroom === selectedHomeroom),
    [selectedHomeroom]
  )

  // Compute stats for each student
  const studentStats = useMemo(() =>
    homeroomStudents.map(s => {
      const attendance = getStudentAttendanceRate(s.id)
      const gpa = getStudentGPA(s.id)
      const scores = getStudentLatestScores(s.id)
      const flags = getStudentFlags(s.id)
      return { student: s, attendance, gpa, scores, flags }
    }),
    [homeroomStudents]
  )

  // Aggregate stats
  const avgAttendance = useMemo(() => {
    if (studentStats.length === 0) return 0
    const total = studentStats.reduce((sum, s) => sum + s.attendance, 0)
    return Math.round((total / studentStats.length) * 10) / 10
  }, [studentStats])

  const avgGPA = useMemo(() => {
    if (studentStats.length === 0) return 0
    const total = studentStats.reduce((sum, s) => sum + s.gpa, 0)
    return Math.round((total / studentStats.length) * 100) / 100
  }, [studentStats])

  const flaggedCount = useMemo(() =>
    studentStats.filter(s => s.flags.length > 0).length,
    [studentStats]
  )

  // Class proficiency for iReady Reading
  const readingProficiency = useMemo(() => getClassProficiency('iready-reading'), [])

  // Grade distribution (across all current grades for the homeroom)
  const gradeDistribution = useMemo(() => {
    const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, F: 0 }
    for (const ss of studentStats) {
      // Use GPA to approximate: 3.5+ = A, 2.5+ = B, 1.5+ = C, 0.5+ = D, else F
      if (ss.gpa >= 3.5) counts['A']++
      else if (ss.gpa >= 2.5) counts['B']++
      else if (ss.gpa >= 1.5) counts['C']++
      else if (ss.gpa >= 0.5) counts['D']++
      else counts['F']++
    }
    return Object.entries(counts).map(([grade, count]) => ({ grade, count }))
  }, [studentStats])

  const handleStudentClick = (student: DemoStudent) => {
    setSelectedStudents([student])
    navigate('/try/profile')
  }

  function attendanceColor(rate: number): string {
    if (rate >= 95) return 'text-green-600 dark:text-green-400'
    if (rate >= 90) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  function gpaColor(gpa: number): string {
    if (gpa >= 3.0) return 'text-green-600 dark:text-green-400'
    if (gpa >= 2.0) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  function proficiencyColor(prof: string): string {
    switch (prof) {
      case 'Above Grade Level': return 'text-green-600 dark:text-green-400'
      case 'On Grade Level': return 'text-emerald-600 dark:text-emerald-400'
      case 'Approaching': return 'text-yellow-600 dark:text-yellow-400'
      case 'Below': return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-500'
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Class Analytics</h1>
        <select
          value={selectedHomeroom}
          onChange={(e) => setSelectedHomeroom(e.target.value)}
          className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg
            text-sm text-gray-900 dark:text-white focus:outline-none focus:border-wasabi-green focus:ring-1 focus:ring-wasabi-green/30"
        >
          {homerooms.map(h => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatsCard
          icon={<Users size={20} className="text-blue-500" />}
          label="Total Students"
          value={String(homeroomStudents.length)}
          bgClass="bg-blue-50 dark:bg-blue-900/20"
        />
        <StatsCard
          icon={<TrendingUp size={20} className="text-green-500" />}
          label="Avg Attendance"
          value={`${avgAttendance}%`}
          bgClass="bg-green-50 dark:bg-green-900/20"
        />
        <StatsCard
          icon={<GraduationCap size={20} className="text-purple-500" />}
          label="Avg GPA"
          value={avgGPA.toFixed(2)}
          bgClass="bg-purple-50 dark:bg-purple-900/20"
        />
        <StatsCard
          icon={<AlertTriangle size={20} className="text-red-500" />}
          label="Flagged Students"
          value={String(flaggedCount)}
          bgClass="bg-red-50 dark:bg-red-900/20"
        />
      </div>

      {/* Student table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            {selectedHomeroom} — Student Overview
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Student</th>
                <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Attendance</th>
                <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">GPA</th>
                <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase hidden md:table-cell">iReady Reading</th>
                <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase hidden md:table-cell">iReady Math</th>
                <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Flags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {studentStats.map(({ student, attendance, gpa, scores, flags }) => (
                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-3 py-2.5">
                    <button
                      onClick={() => handleStudentClick(student)}
                      className="flex items-center gap-2 hover:text-wasabi-green transition-colors"
                    >
                      <StudentAvatar firstName={student.firstName} lastName={student.lastName} gender={student.gender} size="xs" />
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        {student.lastName}, {student.firstName}
                      </span>
                    </button>
                  </td>
                  <td className={`px-3 py-2.5 text-center font-semibold ${attendanceColor(attendance)}`}>
                    {attendance}%
                  </td>
                  <td className={`px-3 py-2.5 text-center font-semibold ${gpaColor(gpa)}`}>
                    {gpa.toFixed(2)}
                  </td>
                  <td className={`px-3 py-2.5 text-center hidden md:table-cell ${scores['iready-reading'] ? proficiencyColor(scores['iready-reading'].proficiency) : 'text-gray-400'}`}>
                    {scores['iready-reading'] ? (
                      <span className="text-xs font-medium">{scores['iready-reading'].score}</span>
                    ) : '-'}
                  </td>
                  <td className={`px-3 py-2.5 text-center hidden md:table-cell ${scores['iready-math'] ? proficiencyColor(scores['iready-math'].proficiency) : 'text-gray-400'}`}>
                    {scores['iready-math'] ? (
                      <span className="text-xs font-medium">{scores['iready-math'].score}</span>
                    ) : '-'}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {flags.length > 0 ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold">
                        {flags.length}
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs">
                        0
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
          <ProficiencyChart data={readingProficiency} title="iReady Reading Proficiency (Class)" height={220} />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
          <GradeDistributionChart data={gradeDistribution} title="GPA Distribution (Homeroom)" height={220} />
        </div>
      </div>
    </div>
  )
}

function StatsCard({
  icon,
  label,
  value,
  bgClass,
}: {
  icon: React.ReactNode
  label: string
  value: string
  bgClass: string
}) {
  return (
    <div className={`rounded-xl p-4 ${bgClass} border border-gray-200/50 dark:border-gray-700/50`}>
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
