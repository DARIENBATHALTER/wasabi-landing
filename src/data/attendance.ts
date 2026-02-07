export interface AttendanceRecord {
  studentId: string
  month: string
  present: number
  absent: number
  tardy: number
  rate: number
}

const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May']
const schoolDays: Record<string, number> = {
  Sep: 20, Oct: 22, Nov: 17, Dec: 15, Jan: 19, Feb: 18, Mar: 21, Apr: 20, May: 18,
}

// Attendance profiles:
// 'excellent' = 96-99% | 'good' = 93-96% | 'concerning' = 82-90% | 'critical' = 68-78%
type AttendanceProfile = 'excellent' | 'good' | 'concerning' | 'critical'

const attendanceProfiles: Record<string, AttendanceProfile> = {
  // Excellent attendance — strong students
  STU001: 'excellent', STU002: 'excellent', STU003: 'excellent',
  STU006: 'excellent', STU007: 'excellent', STU011: 'excellent',
  STU012: 'excellent', STU016: 'excellent', STU017: 'excellent',
  STU021: 'excellent', STU022: 'excellent', STU026: 'excellent', STU027: 'excellent',

  // Good attendance — average students
  STU004: 'good', STU005: 'good', STU008: 'good', STU010: 'good',
  STU014: 'good', STU015: 'good', STU020: 'good',
  STU023: 'good', STU025: 'good', STU028: 'good', STU030: 'good',

  // Concerning attendance — struggling students (82-90%)
  STU009: 'concerning',   // Drew Iverson
  STU013: 'concerning',   // Cameron Martinez
  STU018: 'concerning',   // Hayden Rivera
  STU024: 'concerning',   // Logan Young
  STU029: 'concerning',   // Marley Diaz

  // Critical attendance — failing student (below 80%)
  STU019: 'critical',     // Rowan Smith
}

// Deterministic seed-based pseudo-random for reproducibility
function seededValue(studentId: string, seed: string, base: number, variance: number): number {
  let hash = 0
  const str = studentId + seed
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  const normalized = (Math.abs(hash) % 1000) / 1000
  return Math.round(base + (normalized * variance * 2) - variance)
}

function generateMonthlyRecord(studentId: string, month: string, profile: AttendanceProfile): AttendanceRecord {
  const total = schoolDays[month]
  let absentBase: number
  let tardyBase: number

  switch (profile) {
    case 'excellent':
      absentBase = 0
      tardyBase = 0
      break
    case 'good':
      absentBase = 1
      tardyBase = 1
      break
    case 'concerning':
      absentBase = 2
      tardyBase = 2
      break
    case 'critical':
      absentBase = 4
      tardyBase = 2
      break
  }

  const absentVariance = profile === 'critical' ? 2 : 1
  const absent = Math.max(0, Math.min(total - 5, seededValue(studentId, month + 'a', absentBase, absentVariance)))
  const tardy = Math.max(0, Math.min(5, seededValue(studentId, month + 't', tardyBase, 1)))
  const present = total - absent
  const rate = Math.round((present / total) * 1000) / 10

  return { studentId, month, present, absent, tardy, rate }
}

// Pre-generate all records
export const attendanceRecords: AttendanceRecord[] = []

const allStudentIds = Array.from({ length: 30 }, (_, i) => `STU${String(i + 1).padStart(3, '0')}`)

for (const studentId of allStudentIds) {
  const profile = attendanceProfiles[studentId] || 'good'
  for (const month of months) {
    attendanceRecords.push(generateMonthlyRecord(studentId, month, profile))
  }
}

export function getStudentAttendance(studentId: string): AttendanceRecord[] {
  return attendanceRecords.filter(r => r.studentId === studentId)
}

export function getStudentAttendanceRate(studentId: string): number {
  const records = getStudentAttendance(studentId)
  if (records.length === 0) return 0
  const totalPresent = records.reduce((sum, r) => sum + r.present, 0)
  const totalDays = records.reduce((sum, r) => sum + r.present + r.absent, 0)
  return Math.round((totalPresent / totalDays) * 1000) / 10
}

export function getMonthlyAttendanceForChart(studentId: string): { name: string; attendanceRate: number }[] {
  return getStudentAttendance(studentId).map(r => ({
    name: r.month,
    attendanceRate: r.rate,
  }))
}

export function getSchoolwideAttendanceRate(): number {
  const totalPresent = attendanceRecords.reduce((sum, r) => sum + r.present, 0)
  const totalDays = attendanceRecords.reduce((sum, r) => sum + r.present + r.absent, 0)
  return Math.round((totalPresent / totalDays) * 1000) / 10
}
