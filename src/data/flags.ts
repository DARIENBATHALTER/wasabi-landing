import { students, type DemoStudent } from './students'
import { getStudentAttendanceRate } from './attendance'
import { getStudentGPA } from './grades'
import { assessmentRecords } from './assessments'
import { getStudentDisciplineCount } from './discipline'

export interface FlagRule {
  id: string
  name: string
  description: string
  severity: 'high' | 'medium' | 'low'
  color: string
  criteria: string
}

export interface StudentFlag {
  studentId: string
  ruleId: string
  message: string
  severity: 'high' | 'medium' | 'low'
}

export const flagRules: FlagRule[] = [
  {
    id: 'FLAG001',
    name: 'Low Attendance',
    description: 'Student attendance rate has fallen below the acceptable threshold.',
    severity: 'high',
    color: '#ef4444',
    criteria: 'Attendance rate below 90%',
  },
  {
    id: 'FLAG002',
    name: 'Failing GPA',
    description: 'Student GPA indicates academic failure across multiple subjects.',
    severity: 'high',
    color: '#ef4444',
    criteria: 'GPA below 2.0',
  },
  {
    id: 'FLAG003',
    name: 'Assessment Below Benchmark',
    description: 'Student iReady scores fall below grade-level benchmarks.',
    severity: 'medium',
    color: '#f59e0b',
    criteria: 'iReady score below 420',
  },
  {
    id: 'FLAG004',
    name: 'Multiple Discipline Records',
    description: 'Student has accumulated multiple behavioral incidents.',
    severity: 'low',
    color: '#eab308',
    criteria: '2 or more discipline records',
  },
]

// Dynamically compute flags based on actual data
function computeAllFlags(): StudentFlag[] {
  const flags: StudentFlag[] = []

  for (const student of students) {
    // Check attendance
    const attendanceRate = getStudentAttendanceRate(student.id)
    if (attendanceRate < 90) {
      flags.push({
        studentId: student.id,
        ruleId: 'FLAG001',
        message: `Attendance rate is ${attendanceRate}% (below 90% threshold)`,
        severity: 'high',
      })
    }

    // Check GPA
    const gpa = getStudentGPA(student.id)
    if (gpa < 2.0) {
      flags.push({
        studentId: student.id,
        ruleId: 'FLAG002',
        message: `GPA is ${gpa.toFixed(2)} (below 2.0 threshold)`,
        severity: 'high',
      })
    }

    // Check iReady scores (latest period — EOY)
    const latestIReady = assessmentRecords.filter(
      r => r.studentId === student.id &&
        r.source.startsWith('iready') &&
        r.period === 'EOY'
    )
    const belowBenchmark = latestIReady.some(r => r.score < 420)
    if (belowBenchmark) {
      const lowestScore = Math.min(...latestIReady.map(r => r.score))
      flags.push({
        studentId: student.id,
        ruleId: 'FLAG003',
        message: `iReady score of ${lowestScore} is below 420 benchmark`,
        severity: 'medium',
      })
    }

    // Check discipline records
    const disciplineCount = getStudentDisciplineCount(student.id)
    if (disciplineCount >= 2) {
      flags.push({
        studentId: student.id,
        ruleId: 'FLAG004',
        message: `${disciplineCount} discipline records on file`,
        severity: 'low',
      })
    }
  }

  return flags
}

// Cache computed flags
let _cachedFlags: StudentFlag[] | null = null

function getAllFlags(): StudentFlag[] {
  if (!_cachedFlags) {
    _cachedFlags = computeAllFlags()
  }
  return _cachedFlags
}

export function getFlagRules(): FlagRule[] {
  return flagRules
}

export function getStudentFlags(studentId: string): StudentFlag[] {
  return getAllFlags().filter(f => f.studentId === studentId)
}

export function getAllFlaggedStudents(): { student: DemoStudent; flags: StudentFlag[] }[] {
  const allFlags = getAllFlags()
  const flaggedIds = new Set(allFlags.map(f => f.studentId))

  return Array.from(flaggedIds).map(id => {
    const student = students.find(s => s.id === id)!
    const studentFlags = allFlags.filter(f => f.studentId === id)
    return { student, flags: studentFlags }
  })
}

export function getFlaggedStudentCount(): number {
  const allFlags = getAllFlags()
  return new Set(allFlags.map(f => f.studentId)).size
}

export function getFlagCountBySeverity(): { high: number; medium: number; low: number } {
  const allFlags = getAllFlags()
  return {
    high: allFlags.filter(f => f.severity === 'high').length,
    medium: allFlags.filter(f => f.severity === 'medium').length,
    low: allFlags.filter(f => f.severity === 'low').length,
  }
}
