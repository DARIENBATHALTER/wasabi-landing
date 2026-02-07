export interface DisciplineRecord {
  studentId: string
  date: string
  infraction: string
  action: string
  location: string
}

// Only struggling/failing students have discipline records.
// This overlaps with attendance and grade issues for realism.
export const disciplineRecords: DisciplineRecord[] = [
  // STU009 — Drew Iverson (concerning attendance, struggling grades) — 2 records
  {
    studentId: 'STU009',
    date: '10/15/2024',
    infraction: 'Disruptive behavior',
    action: 'Verbal warning',
    location: 'Classroom',
  },
  {
    studentId: 'STU009',
    date: '01/22/2025',
    infraction: 'Verbal altercation',
    action: 'Parent contact',
    location: 'Cafeteria',
  },

  // STU013 — Cameron Martinez (concerning attendance, struggling grades) — 3 records
  {
    studentId: 'STU013',
    date: '09/28/2024',
    infraction: 'Horseplay',
    action: 'Verbal warning',
    location: 'Playground',
  },
  {
    studentId: 'STU013',
    date: '11/14/2024',
    infraction: 'Disruptive behavior',
    action: 'Lunch detention',
    location: 'Classroom',
  },
  {
    studentId: 'STU013',
    date: '02/05/2025',
    infraction: 'Verbal altercation',
    action: 'Office referral',
    location: 'Hallway',
  },

  // STU018 — Hayden Rivera (concerning attendance, struggling grades) — 2 records
  {
    studentId: 'STU018',
    date: '10/03/2024',
    infraction: 'Tardy to class',
    action: 'Verbal warning',
    location: 'Classroom',
  },
  {
    studentId: 'STU018',
    date: '12/11/2024',
    infraction: 'Disruptive behavior',
    action: 'Parent contact',
    location: 'Classroom',
  },

  // STU019 — Rowan Smith (critical attendance, failing grades) — 3 records
  {
    studentId: 'STU019',
    date: '09/19/2024',
    infraction: 'Tardy to class',
    action: 'Verbal warning',
    location: 'Classroom',
  },
  {
    studentId: 'STU019',
    date: '11/07/2024',
    infraction: 'Disruptive behavior',
    action: 'Lunch detention',
    location: 'Cafeteria',
  },
  {
    studentId: 'STU019',
    date: '01/30/2025',
    infraction: 'Verbal altercation',
    action: 'After-school detention',
    location: 'Hallway',
  },

  // STU024 — Logan Young (concerning attendance, struggling grades) — 2 records
  {
    studentId: 'STU024',
    date: '10/22/2024',
    infraction: 'Cell phone use',
    action: 'Parent contact',
    location: 'Classroom',
  },
  {
    studentId: 'STU024',
    date: '03/04/2025',
    infraction: 'Dress code violation',
    action: 'Verbal warning',
    location: 'Hallway',
  },

  // STU029 — Marley Diaz (concerning attendance, struggling grades) — 2 records
  {
    studentId: 'STU029',
    date: '11/20/2024',
    infraction: 'Horseplay',
    action: 'Lunch detention',
    location: 'Playground',
  },
  {
    studentId: 'STU029',
    date: '02/12/2025',
    infraction: 'Disruptive behavior',
    action: 'Office referral',
    location: 'Classroom',
  },
]

export function getStudentDiscipline(studentId: string): DisciplineRecord[] {
  return disciplineRecords.filter(r => r.studentId === studentId)
}

export function getStudentDisciplineCount(studentId: string): number {
  return disciplineRecords.filter(r => r.studentId === studentId).length
}

export function getStudentsWithDisciplineRecords(): string[] {
  const ids = new Set(disciplineRecords.map(r => r.studentId))
  return Array.from(ids)
}

export function getDisciplineSummary(): { infraction: string; count: number }[] {
  const counts: Record<string, number> = {}
  for (const r of disciplineRecords) {
    counts[r.infraction] = (counts[r.infraction] || 0) + 1
  }
  return Object.entries(counts)
    .map(([infraction, count]) => ({ infraction, count }))
    .sort((a, b) => b.count - a.count)
}
