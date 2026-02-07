import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMockupContext } from './MockupApp'
import { students, getStudentsByGrade, type DemoStudent } from '../data/students'
import { getStudentGPA, getStudentQuarterlyGPA, getClassAverageGPA, getStudentGrades } from '../data/grades'
import { getStudentFlags } from '../data/flags'
import StudentAvatar from '../components/StudentAvatar'
import GradeDistributionChart from '../components/charts/GradeDistributionChart'
import { GraduationCap, TrendingUp, TrendingDown, Award, AlertTriangle, BarChart3 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts'

const gradeLabels: Record<string, string> = {
  K: 'Kindergarten',
  '1': '1st Grade',
  '2': '2nd Grade',
  '3': '3rd Grade',
  '4': '4th Grade',
  '5': '5th Grade',
}

export default function MockupGradeAnalytics() {
  const { setCurrentView, setSelectedStudents } = useMockupContext()
  const navigate = useNavigate()
  const [selectedGrade, setSelectedGrade] = useState('all')

  useEffect(() => {
    setCurrentView('grade-analytics')
  }, [setCurrentView])

  const allGrades = ['K', '1', '2', '3', '4', '5']

  // Students to analyze
  const targetStudents = useMemo(() =>
    selectedGrade === 'all' ? students : getStudentsByGrade(selectedGrade),
    [selectedGrade]
  )

  // Per-student stats
  const studentStats = useMemo(() =>
    targetStudents.map(s => ({
      student: s,
      gpa: getStudentGPA(s.id),
      quarterlyGPA: getStudentQuarterlyGPA(s.id),
      flags: getStudentFlags(s.id),
    })).sort((a, b) => b.gpa - a.gpa),
    [targetStudents]
  )

  // Aggregate stats
  const avgGPA = useMemo(() => {
    if (studentStats.length === 0) return 0
    return Math.round((studentStats.reduce((s, x) => s + x.gpa, 0) / studentStats.length) * 100) / 100
  }, [studentStats])

  const schoolAvgGPA = useMemo(() => getClassAverageGPA(), [])

  const highPerformers = useMemo(() => studentStats.filter(s => s.gpa >= 3.5).length, [studentStats])
  const atRisk = useMemo(() => studentStats.filter(s => s.gpa < 2.0).length, [studentStats])

  // GPA by grade level
  const gpaByGradeLevel = useMemo(() =>
    allGrades.map(g => {
      const gradeStudents = getStudentsByGrade(g)
      const gpas = gradeStudents.map(s => getStudentGPA(s.id))
      const avg = gpas.length > 0 ? gpas.reduce((a, b) => a + b, 0) / gpas.length : 0
      return { grade: `Grade ${g}`, gpa: Math.round(avg * 100) / 100 }
    }),
    []
  )

  // Grade distribution across all target students
  const gradeDistribution = useMemo(() => {
    const counts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, F: 0 }
    for (const ss of studentStats) {
      const grades = getStudentGrades(ss.student.id)
      for (const g of grades) {
        if (counts[g.current] !== undefined) counts[g.current]++
      }
    }
    return Object.entries(counts).map(([grade, count]) => ({ grade, count }))
  }, [studentStats])

  // Quarterly GPA trend (averaged across target students)
  const quarterlyTrend = useMemo(() => {
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4']
    return quarters.map(q => {
      const gpas = studentStats.map(s => {
        const qData = s.quarterlyGPA.find(x => x.quarter === q)
        return qData?.gpa ?? 0
      })
      const avg = gpas.length > 0 ? gpas.reduce((a, b) => a + b, 0) / gpas.length : 0
      return { quarter: q, gpa: Math.round(avg * 100) / 100 }
    })
  }, [studentStats])

  // Subject-level breakdown
  const subjectBreakdown = useMemo(() => {
    const subjects = ['Mathematics', 'English Language Arts', 'Science', 'Social Studies', 'Art', 'Physical Education']
    return subjects.map(subject => {
      const allGrades: string[] = []
      for (const ss of studentStats) {
        const grades = getStudentGrades(ss.student.id)
        const subjectGrade = grades.find(g => g.course === subject)
        if (subjectGrade) allGrades.push(subjectGrade.current)
      }
      const gpaMap: Record<string, number> = { A: 4, B: 3, C: 2, D: 1, F: 0 }
      const avg = allGrades.length > 0
        ? allGrades.reduce((sum, g) => sum + (gpaMap[g] ?? 0), 0) / allGrades.length
        : 0
      return { subject, avgGPA: Math.round(avg * 100) / 100, total: allGrades.length }
    }).sort((a, b) => b.avgGPA - a.avgGPA)
  }, [studentStats])

  const handleStudentClick = (student: DemoStudent) => {
    setSelectedStudents([student])
    navigate('/try/profile')
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
          <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} style={{ color: p.color }} className="text-xs">
              {p.name}: {p.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Grade Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Academic performance across grade levels and subjects</p>
        </div>
        <select
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
          className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg
            text-sm text-gray-900 dark:text-white focus:outline-none focus:border-wasabi-green focus:ring-1 focus:ring-wasabi-green/30"
        >
          <option value="all">All Grades</option>
          {allGrades.map(g => (
            <option key={g} value={g}>{gradeLabels[g]}</option>
          ))}
        </select>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatsCard
          icon={<GraduationCap size={20} className="text-purple-500" />}
          label="Average GPA"
          value={avgGPA.toFixed(2)}
          bgClass="bg-purple-50 dark:bg-purple-900/20"
        />
        <StatsCard
          icon={<BarChart3 size={20} className="text-blue-500" />}
          label="School Average"
          value={schoolAvgGPA.toFixed(2)}
          bgClass="bg-blue-50 dark:bg-blue-900/20"
        />
        <StatsCard
          icon={<Award size={20} className="text-green-500" />}
          label="Honor Roll (3.5+)"
          value={String(highPerformers)}
          bgClass="bg-green-50 dark:bg-green-900/20"
        />
        <StatsCard
          icon={<AlertTriangle size={20} className="text-red-500" />}
          label="At Risk (<2.0)"
          value={String(atRisk)}
          bgClass="bg-red-50 dark:bg-red-900/20"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* GPA by Grade Level */}
        {selectedGrade === 'all' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Average GPA by Grade Level</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={gpaByGradeLevel} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                <XAxis dataKey="grade" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} domain={[0, 4]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="gpa" name="Avg GPA" radius={[4, 4, 0, 0]}>
                  {gpaByGradeLevel.map((entry, i) => (
                    <Cell key={i} fill={entry.gpa >= 3.0 ? '#22c55e' : entry.gpa >= 2.0 ? '#eab308' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Grade Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
          <GradeDistributionChart
            data={gradeDistribution}
            title={selectedGrade === 'all' ? 'Overall Grade Distribution' : `Grade ${selectedGrade} Distribution`}
            height={220}
          />
        </div>

        {/* Quarterly GPA Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Average GPA by Quarter</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={quarterlyTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
              <XAxis dataKey="quarter" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} domain={[0, 4]} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="gpa" name="Avg GPA" stroke="#008800" strokeWidth={2.5} dot={{ fill: '#008800', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Subject Performance</h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
          {subjectBreakdown.map(sub => (
            <div key={sub.subject} className="flex items-center gap-4 px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{sub.subject}</p>
                <p className="text-[11px] text-gray-400">{sub.total} grades recorded</p>
              </div>
              <div className="w-32 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(sub.avgGPA / 4) * 100}%`,
                    backgroundColor: sub.avgGPA >= 3.0 ? '#22c55e' : sub.avgGPA >= 2.0 ? '#eab308' : '#ef4444',
                  }}
                />
              </div>
              <span className={`text-sm font-bold w-10 text-right ${
                sub.avgGPA >= 3.0 ? 'text-green-600 dark:text-green-400' : sub.avgGPA >= 2.0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {sub.avgGPA.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Student ranking table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            Student Rankings {selectedGrade !== 'all' ? `— ${gradeLabels[selectedGrade]}` : ''}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-12">#</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Student</th>
                <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Grade</th>
                <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">GPA</th>
                <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase hidden md:table-cell">Trend</th>
                <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Flags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {studentStats.map((ss, index) => {
                const trend = ss.quarterlyGPA
                const q1 = trend.find(t => t.quarter === 'Q1')?.gpa ?? 0
                const q3 = trend.find(t => t.quarter === 'Q3')?.gpa ?? 0
                const isUp = q3 > q1
                const isDown = q3 < q1

                return (
                  <tr key={ss.student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-3 py-2.5 text-center text-xs text-gray-400 font-mono">{index + 1}</td>
                    <td className="px-3 py-2.5">
                      <button
                        onClick={() => handleStudentClick(ss.student)}
                        className="flex items-center gap-2 hover:text-wasabi-green transition-colors"
                      >
                        <StudentAvatar firstName={ss.student.firstName} lastName={ss.student.lastName} gender={ss.student.gender} size="xs" />
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {ss.student.lastName}, {ss.student.firstName}
                        </span>
                      </button>
                    </td>
                    <td className="px-3 py-2.5 text-center text-xs text-gray-500">{ss.student.grade}</td>
                    <td className={`px-3 py-2.5 text-center font-bold ${
                      ss.gpa >= 3.5 ? 'text-green-600 dark:text-green-400' : ss.gpa >= 2.5 ? 'text-lime-600 dark:text-lime-400' : ss.gpa >= 2.0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {ss.gpa.toFixed(2)}
                    </td>
                    <td className="px-3 py-2.5 text-center hidden md:table-cell">
                      {isUp && <TrendingUp size={14} className="inline text-green-500" />}
                      {isDown && <TrendingDown size={14} className="inline text-red-500" />}
                      {!isUp && !isDown && <span className="text-xs text-gray-400">--</span>}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      {ss.flags.length > 0 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold">
                          {ss.flags.length}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300 dark:text-gray-600">0</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
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
