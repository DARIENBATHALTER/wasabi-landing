export interface GradeRecord {
  studentId: string
  course: string
  teacher: string
  q1: string
  q2: string
  q3: string
  q4: string
  current: string
}

const courses = [
  'Mathematics',
  'English Language Arts',
  'Science',
  'Social Studies',
  'Art',
  'Physical Education',
]

// Teacher names for each course (different from homeroom)
const courseTeachers: Record<string, string> = {
  'Mathematics': 'Ms. Warren',
  'English Language Arts': 'Mr. Brooks',
  'Science': 'Mrs. Fernandez',
  'Social Studies': 'Mr. Okoro',
  'Art': 'Ms. Lambert',
  'Physical Education': 'Coach Reeves',
}

// Grade profiles determine typical performance
// 'high' = mostly A's, some B's
// 'average' = mostly B's, some A's and C's
// 'struggling' = mostly C's and D's, occasional B
// 'failing' = D's and F's, occasional C
type GradeProfile = 'high' | 'average' | 'struggling' | 'failing'

const gradeProfiles: Record<string, GradeProfile> = {
  // High performers
  STU001: 'high', STU002: 'high', STU003: 'high',
  STU006: 'high', STU007: 'high', STU011: 'high',
  STU012: 'high', STU016: 'high', STU017: 'high',
  STU021: 'high', STU022: 'high', STU026: 'high', STU027: 'high',

  // Average performers
  STU004: 'average', STU005: 'average', STU008: 'average', STU010: 'average',
  STU014: 'average', STU015: 'average', STU020: 'average',
  STU023: 'average', STU025: 'average', STU028: 'average', STU030: 'average',

  // Struggling (correlates with concerning attendance)
  STU009: 'struggling',   // Drew Iverson
  STU013: 'struggling',   // Cameron Martinez
  STU018: 'struggling',   // Hayden Rivera
  STU024: 'struggling',   // Logan Young
  STU029: 'struggling',   // Marley Diaz

  // Failing (correlates with critical attendance)
  STU019: 'failing',      // Rowan Smith
}

// Deterministic grade selection
function seededIndex(str: string, max: number): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash) % max
}

function pickGrade(studentId: string, course: string, quarter: string, profile: GradeProfile): string {
  const seed = studentId + course + quarter
  const idx = seededIndex(seed, 10)

  switch (profile) {
    case 'high':
      // 60% A, 30% B, 10% C
      if (idx < 6) return 'A'
      if (idx < 9) return 'B'
      return 'C'
    case 'average':
      // 20% A, 50% B, 20% C, 10% D
      if (idx < 2) return 'A'
      if (idx < 7) return 'B'
      if (idx < 9) return 'C'
      return 'D'
    case 'struggling':
      // 10% B, 40% C, 40% D, 10% F
      if (idx < 1) return 'B'
      if (idx < 5) return 'C'
      if (idx < 9) return 'D'
      return 'F'
    case 'failing':
      // 10% C, 40% D, 50% F
      if (idx < 1) return 'C'
      if (idx < 5) return 'D'
      return 'F'
  }
}

// Pre-generate all grade records
export const gradeRecords: GradeRecord[] = []

const allStudentIds = Array.from({ length: 30 }, (_, i) => `STU${String(i + 1).padStart(3, '0')}`)

for (const studentId of allStudentIds) {
  const profile = gradeProfiles[studentId] || 'average'
  for (const course of courses) {
    const q1 = pickGrade(studentId, course, 'Q1', profile)
    const q2 = pickGrade(studentId, course, 'Q2', profile)
    const q3 = pickGrade(studentId, course, 'Q3', profile)
    const q4 = pickGrade(studentId, course, 'Q4', profile)
    gradeRecords.push({
      studentId,
      course,
      teacher: courseTeachers[course],
      q1,
      q2,
      q3,
      q4,
      current: q3, // Q3 is most recent completed quarter
    })
  }
}

const gpaMap: Record<string, number> = { A: 4, B: 3, C: 2, D: 1, F: 0 }

export function getStudentGrades(studentId: string): GradeRecord[] {
  return gradeRecords.filter(r => r.studentId === studentId)
}

export function getStudentGPA(studentId: string): number {
  const records = getStudentGrades(studentId)
  if (records.length === 0) return 0
  const total = records.reduce((sum, r) => sum + (gpaMap[r.current] ?? 0), 0)
  return Math.round((total / records.length) * 100) / 100
}

export function getStudentQuarterlyGPA(studentId: string): { quarter: string; gpa: number }[] {
  const records = getStudentGrades(studentId)
  if (records.length === 0) return []

  return ['Q1', 'Q2', 'Q3', 'Q4'].map(quarter => {
    const key = quarter.toLowerCase() as 'q1' | 'q2' | 'q3' | 'q4'
    const total = records.reduce((sum, r) => sum + (gpaMap[r[key]] ?? 0), 0)
    return {
      quarter,
      gpa: Math.round((total / records.length) * 100) / 100,
    }
  })
}

export function getClassAverageGPA(): number {
  const allGPAs = allStudentIds.map(id => getStudentGPA(id))
  const total = allGPAs.reduce((sum, gpa) => sum + gpa, 0)
  return Math.round((total / allGPAs.length) * 100) / 100
}
