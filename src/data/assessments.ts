export interface AssessmentRecord {
  studentId: string
  source: string
  period: string
  score: number
  percentile?: number
  proficiency?: string
}

type PerformanceLevel = 'high' | 'average' | 'struggling' | 'failing'

const performanceLevels: Record<string, PerformanceLevel> = {
  STU001: 'high', STU002: 'high', STU003: 'high',
  STU006: 'high', STU007: 'high', STU011: 'high',
  STU012: 'high', STU016: 'high', STU017: 'high',
  STU021: 'high', STU022: 'high', STU026: 'high', STU027: 'high',

  STU004: 'average', STU005: 'average', STU008: 'average', STU010: 'average',
  STU014: 'average', STU015: 'average', STU020: 'average',
  STU023: 'average', STU025: 'average', STU028: 'average', STU030: 'average',

  STU009: 'struggling',
  STU013: 'struggling',
  STU018: 'struggling',
  STU024: 'struggling',
  STU029: 'struggling',

  STU019: 'failing',
}

// Deterministic seeded value
function seeded(str: string, min: number, max: number): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  const normalized = (Math.abs(hash) % 1000) / 1000
  return Math.round(min + normalized * (max - min))
}

// iReady score ranges (350-600 scale)
// High: 500-580 | Average: 440-510 | Struggling: 380-440 | Failing: 350-400
function iReadyBaseScore(level: PerformanceLevel, studentId: string, source: string): number {
  switch (level) {
    case 'high': return seeded(studentId + source + 'base', 500, 560)
    case 'average': return seeded(studentId + source + 'base', 440, 510)
    case 'struggling': return seeded(studentId + source + 'base', 380, 430)
    case 'failing': return seeded(studentId + source + 'base', 350, 395)
  }
}

// FAST score ranges (300-500 scale)
// High: 420-490 | Average: 370-430 | Struggling: 320-370 | Failing: 300-340
function fastBaseScore(level: PerformanceLevel, studentId: string, source: string): number {
  switch (level) {
    case 'high': return seeded(studentId + source + 'base', 420, 480)
    case 'average': return seeded(studentId + source + 'base', 370, 430)
    case 'struggling': return seeded(studentId + source + 'base', 320, 370)
    case 'failing': return seeded(studentId + source + 'base', 300, 340)
  }
}

function getProficiency(source: string, score: number): string {
  if (source.startsWith('iready')) {
    if (score >= 530) return 'Above Grade Level'
    if (score >= 460) return 'On Grade Level'
    if (score >= 410) return 'Approaching'
    return 'Below'
  } else {
    // FAST
    if (score >= 450) return 'Above Grade Level'
    if (score >= 380) return 'On Grade Level'
    if (score >= 340) return 'Approaching'
    return 'Below'
  }
}

function getPercentile(source: string, score: number): number {
  if (source.startsWith('iready')) {
    // Rough mapping for iReady 350-600
    const pct = Math.round(((score - 350) / 250) * 90 + 5)
    return Math.max(1, Math.min(99, pct))
  } else {
    // FAST 300-500
    const pct = Math.round(((score - 300) / 200) * 90 + 5)
    return Math.max(1, Math.min(99, pct))
  }
}

// Generate growth/decline patterns based on level
function getGrowthPattern(level: PerformanceLevel, studentId: string, source: string): [number, number, number] {
  // Growth from period 1 to 2, and period 2 to 3
  switch (level) {
    case 'high': {
      const g1 = seeded(studentId + source + 'g1', 8, 18)
      const g2 = seeded(studentId + source + 'g2', 5, 15)
      return [0, g1, g1 + g2]
    }
    case 'average': {
      const g1 = seeded(studentId + source + 'g1', 5, 15)
      const g2 = seeded(studentId + source + 'g2', 3, 12)
      return [0, g1, g1 + g2]
    }
    case 'struggling': {
      // Minimal growth or stagnation
      const g1 = seeded(studentId + source + 'g1', -3, 8)
      const g2 = seeded(studentId + source + 'g2', -2, 6)
      return [0, g1, g1 + g2]
    }
    case 'failing': {
      // Possible decline
      const g1 = seeded(studentId + source + 'g1', -8, 3)
      const g2 = seeded(studentId + source + 'g2', -5, 2)
      return [0, g1, g1 + g2]
    }
  }
}

// Pre-generate all assessment records
export const assessmentRecords: AssessmentRecord[] = []

const allStudentIds = Array.from({ length: 30 }, (_, i) => `STU${String(i + 1).padStart(3, '0')}`)

const iReadySources = ['iready-reading', 'iready-math']
const iReadyPeriods = ['BOY', 'MOY', 'EOY']
const fastSources = ['fast-ela', 'fast-math']
const fastPeriods = ['PM1', 'PM2', 'PM3']

for (const studentId of allStudentIds) {
  const level = performanceLevels[studentId] || 'average'

  // iReady assessments
  for (const source of iReadySources) {
    const base = iReadyBaseScore(level, studentId, source)
    const growth = getGrowthPattern(level, studentId, source)

    for (let i = 0; i < iReadyPeriods.length; i++) {
      const score = Math.max(350, Math.min(600, base + growth[i]))
      assessmentRecords.push({
        studentId,
        source,
        period: iReadyPeriods[i],
        score,
        percentile: getPercentile(source, score),
        proficiency: getProficiency(source, score),
      })
    }
  }

  // FAST assessments
  for (const source of fastSources) {
    const base = fastBaseScore(level, studentId, source)
    const growth = getGrowthPattern(level, studentId, source)

    for (let i = 0; i < fastPeriods.length; i++) {
      const score = Math.max(300, Math.min(500, base + growth[i]))
      assessmentRecords.push({
        studentId,
        source,
        period: fastPeriods[i],
        score,
        percentile: getPercentile(source, score),
        proficiency: getProficiency(source, score),
      })
    }
  }
}

export function getStudentAssessments(studentId: string): AssessmentRecord[] {
  return assessmentRecords.filter(r => r.studentId === studentId)
}

export function getAssessmentTrend(studentId: string, source: string): { name: string; score: number; benchmark: number }[] {
  const records = assessmentRecords.filter(r => r.studentId === studentId && r.source === source)

  // Benchmark lines
  const benchmark = source.startsWith('iready') ? 460 : 380

  return records.map(r => ({
    name: r.period,
    score: r.score,
    benchmark,
  }))
}

export function getClassProficiency(source: string): { below: number; approaching: number; meets: number; exceeds: number } {
  // Get the latest period for each student for the given source
  const latestPeriod = source.startsWith('iready') ? 'EOY' : 'PM3'
  const records = assessmentRecords.filter(r => r.source === source && r.period === latestPeriod)

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
}

export function getStudentLatestScores(studentId: string): Record<string, { score: number; proficiency: string }> {
  const result: Record<string, { score: number; proficiency: string }> = {}
  const sources = [...iReadySources, ...fastSources]

  for (const source of sources) {
    const latestPeriod = source.startsWith('iready') ? 'EOY' : 'PM3'
    const record = assessmentRecords.find(
      r => r.studentId === studentId && r.source === source && r.period === latestPeriod
    )
    if (record) {
      result[source] = {
        score: record.score,
        proficiency: record.proficiency || 'Unknown',
      }
    }
  }

  return result
}
