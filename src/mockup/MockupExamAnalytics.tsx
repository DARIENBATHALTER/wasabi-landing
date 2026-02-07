import { useEffect, useMemo, useState } from 'react'
import { useMockupContext } from './MockupApp'
import { students, getStudentsByGrade } from '../data/students'
import { assessmentRecords } from '../data/assessments'
import ProficiencyChart from '../components/charts/ProficiencyChart'
import AssessmentTrendChart from '../components/charts/AssessmentTrendChart'
import { ClipboardList, TrendingUp, Users, Target, BookOpen, Calculator } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

type AssessmentSource = 'iready-reading' | 'iready-math' | 'fast-ela' | 'fast-math'

const sourceInfo: Record<AssessmentSource, { label: string; color: string; icon: React.ReactNode; periods: string[] }> = {
  'iready-reading': { label: 'iReady Reading', color: '#2563eb', icon: <BookOpen size={16} />, periods: ['BOY', 'MOY', 'EOY'] },
  'iready-math': { label: 'iReady Math', color: '#7c3aed', icon: <Calculator size={16} />, periods: ['BOY', 'MOY', 'EOY'] },
  'fast-ela': { label: 'FAST ELA', color: '#059669', icon: <BookOpen size={16} />, periods: ['PM1', 'PM2', 'PM3'] },
  'fast-math': { label: 'FAST Math', color: '#d97706', icon: <Calculator size={16} />, periods: ['PM1', 'PM2', 'PM3'] },
}

export default function MockupExamAnalytics() {
  const { setCurrentView } = useMockupContext()
  const [selectedSource, setSelectedSource] = useState<AssessmentSource>('iready-reading')
  const [selectedGrade, setSelectedGrade] = useState('all')

  useEffect(() => {
    setCurrentView('exam-analytics')
  }, [setCurrentView])

  const info = sourceInfo[selectedSource]
  const allGrades = ['K', '1', '2', '3', '4', '5']

  // Filter students by grade
  const targetStudents = useMemo(() =>
    selectedGrade === 'all' ? students : getStudentsByGrade(selectedGrade),
    [selectedGrade]
  )

  // Proficiency distribution
  const proficiency = useMemo(() => {
    const latestPeriod = selectedSource.startsWith('iready') ? 'EOY' : 'PM3'
    const records = assessmentRecords.filter(
      r => r.source === selectedSource && r.period === latestPeriod && targetStudents.some(s => s.id === r.studentId)
    )
    const result = { below: 0, approaching: 0, meets: 0, exceeds: 0 }
    for (const r of records) {
      switch (r.proficiency) {
        case 'Below': result.below++; break
        case 'Approaching': result.approaching++; break
        case 'On Grade Level': result.meets++; break
        case 'Above Grade Level': result.exceeds++; break
      }
    }
    return result
  }, [selectedSource, targetStudents])

  // Average scores by period
  const avgScoresByPeriod = useMemo(() => {
    return info.periods.map(period => {
      const records = assessmentRecords.filter(
        r => r.source === selectedSource && r.period === period && targetStudents.some(s => s.id === r.studentId)
      )
      const avg = records.length > 0 ? Math.round(records.reduce((s, r) => s + r.score, 0) / records.length) : 0
      const benchmark = selectedSource.startsWith('iready') ? 460 : 380
      return { name: period, score: avg, benchmark }
    })
  }, [selectedSource, targetStudents, info.periods])

  // Average score by grade level
  const scoresByGradeLevel = useMemo(() => {
    const latestPeriod = selectedSource.startsWith('iready') ? 'EOY' : 'PM3'
    return allGrades.map(g => {
      const gradeStudents = getStudentsByGrade(g)
      const records = assessmentRecords.filter(
        r => r.source === selectedSource && r.period === latestPeriod && gradeStudents.some(s => s.id === r.studentId)
      )
      const avg = records.length > 0 ? Math.round(records.reduce((s, r) => s + r.score, 0) / records.length) : 0
      return { grade: `Grade ${g}`, score: avg }
    })
  }, [selectedSource])

  // Top/bottom performers
  const studentScores = useMemo(() => {
    const latestPeriod = selectedSource.startsWith('iready') ? 'EOY' : 'PM3'
    return targetStudents.map(s => {
      const record = assessmentRecords.find(
        r => r.studentId === s.id && r.source === selectedSource && r.period === latestPeriod
      )
      return { student: s, record }
    }).filter(x => x.record).sort((a, b) => (b.record?.score ?? 0) - (a.record?.score ?? 0))
  }, [selectedSource, targetStudents])

  // Overall stats
  const latestPeriod = selectedSource.startsWith('iready') ? 'EOY' : 'PM3'
  const firstPeriod = info.periods[0]
  const avgLatest = useMemo(() => {
    const records = assessmentRecords.filter(
      r => r.source === selectedSource && r.period === latestPeriod && targetStudents.some(s => s.id === r.studentId)
    )
    return records.length > 0 ? Math.round(records.reduce((s, r) => s + r.score, 0) / records.length) : 0
  }, [selectedSource, targetStudents, latestPeriod])

  const avgFirst = useMemo(() => {
    const records = assessmentRecords.filter(
      r => r.source === selectedSource && r.period === firstPeriod && targetStudents.some(s => s.id === r.studentId)
    )
    return records.length > 0 ? Math.round(records.reduce((s, r) => s + r.score, 0) / records.length) : 0
  }, [selectedSource, targetStudents, firstPeriod])

  const growth = avgLatest - avgFirst
  const onTrack = proficiency.meets + proficiency.exceeds
  const totalAssessed = proficiency.below + proficiency.approaching + proficiency.meets + proficiency.exceeds

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
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Exam Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Assessment performance and growth trends</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value as AssessmentSource)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg
              text-sm text-gray-900 dark:text-white focus:outline-none focus:border-wasabi-green"
          >
            {(Object.keys(sourceInfo) as AssessmentSource[]).map(s => (
              <option key={s} value={s}>{sourceInfo[s].label}</option>
            ))}
          </select>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg
              text-sm text-gray-900 dark:text-white focus:outline-none focus:border-wasabi-green"
          >
            <option value="all">All Grades</option>
            {allGrades.map(g => (
              <option key={g} value={g}>Grade {g}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatsCard
          icon={<ClipboardList size={20} className="text-blue-500" />}
          label="Students Assessed"
          value={String(totalAssessed)}
          bgClass="bg-blue-50 dark:bg-blue-900/20"
        />
        <StatsCard
          icon={<Target size={20} className="text-green-500" />}
          label="On/Above Grade Level"
          value={`${totalAssessed > 0 ? Math.round((onTrack / totalAssessed) * 100) : 0}%`}
          bgClass="bg-green-50 dark:bg-green-900/20"
        />
        <StatsCard
          icon={<TrendingUp size={20} className="text-purple-500" />}
          label={`Growth (${firstPeriod} → ${latestPeriod})`}
          value={`${growth >= 0 ? '+' : ''}${growth} pts`}
          bgClass="bg-purple-50 dark:bg-purple-900/20"
        />
        <StatsCard
          icon={<Users size={20} className="text-amber-500" />}
          label="Avg Latest Score"
          value={String(avgLatest)}
          bgClass="bg-amber-50 dark:bg-amber-900/20"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* Proficiency distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
          <ProficiencyChart data={proficiency} title={`${info.label} Proficiency Distribution`} height={220} />
        </div>

        {/* Score trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
          <AssessmentTrendChart
            data={avgScoresByPeriod}
            title={`${info.label} Average Score Trend`}
            height={220}
            color={info.color}
          />
        </div>

        {/* Score by grade level */}
        {selectedGrade === 'all' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Average {info.label} Score by Grade Level ({latestPeriod})
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={scoresByGradeLevel} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                <XAxis dataKey="grade" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="score" name="Avg Score" radius={[4, 4, 0, 0]}>
                  {scoresByGradeLevel.map((_, i) => (
                    <Cell key={i} fill={info.color} opacity={0.6 + (i * 0.06)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Student scores table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            {info.label} — Student Scores ({latestPeriod})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase w-12">#</th>
                <th className="text-left px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase">Student</th>
                <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase">Grade</th>
                <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase">Score</th>
                <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Percentile</th>
                <th className="text-center px-3 py-2.5 text-xs font-semibold text-gray-500 uppercase">Proficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {studentScores.map(({ student, record }, i) => (
                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-3 py-2.5 text-center text-xs text-gray-400 font-mono">{i + 1}</td>
                  <td className="px-3 py-2.5">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {student.lastName}, {student.firstName}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center text-xs text-gray-500">{student.grade}</td>
                  <td className="px-3 py-2.5 text-center font-bold text-gray-900 dark:text-white">{record?.score}</td>
                  <td className="px-3 py-2.5 text-center text-gray-500 hidden md:table-cell">{record?.percentile}th</td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${profBadge(record?.proficiency || '')}`}>
                      {record?.proficiency}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatsCard({ icon, label, value, bgClass }: { icon: React.ReactNode; label: string; value: string; bgClass: string }) {
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

function profBadge(prof: string): string {
  switch (prof) {
    case 'Above Grade Level': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
    case 'On Grade Level': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
    case 'Approaching': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
    case 'Below': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
    default: return 'bg-gray-100 dark:bg-gray-800 text-gray-600'
  }
}
