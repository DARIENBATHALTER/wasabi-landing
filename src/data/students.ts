export interface DemoStudent {
  id: string
  studentNumber: string
  firstName: string
  lastName: string
  grade: string
  homeroom: string
  gender: 'male' | 'female'
  dateOfBirth: string
}

export const students: DemoStudent[] = [
  // Grade K — Ms. Rodriguez
  { id: 'STU001', studentNumber: '10045678', firstName: 'Alex', lastName: 'Anderson', grade: 'K', homeroom: 'Ms. Rodriguez', gender: 'male', dateOfBirth: '03/14/2019' },
  { id: 'STU002', studentNumber: '10045679', firstName: 'Jordan', lastName: 'Bennett', grade: 'K', homeroom: 'Ms. Rodriguez', gender: 'female', dateOfBirth: '07/22/2019' },
  { id: 'STU003', studentNumber: '10045680', firstName: 'Taylor', lastName: 'Chen', grade: 'K', homeroom: 'Ms. Rodriguez', gender: 'female', dateOfBirth: '01/09/2019' },
  { id: 'STU004', studentNumber: '10045681', firstName: 'Morgan', lastName: 'Davis', grade: 'K', homeroom: 'Ms. Rodriguez', gender: 'male', dateOfBirth: '11/30/2019' },
  { id: 'STU005', studentNumber: '10045682', firstName: 'Casey', lastName: 'Edwards', grade: 'K', homeroom: 'Ms. Rodriguez', gender: 'female', dateOfBirth: '05/18/2019' },

  // Grade 1 — Mr. Chen
  { id: 'STU006', studentNumber: '10045683', firstName: 'Riley', lastName: 'Foster', grade: '1', homeroom: 'Mr. Chen', gender: 'female', dateOfBirth: '08/03/2018' },
  { id: 'STU007', studentNumber: '10045684', firstName: 'Quinn', lastName: 'Garcia', grade: '1', homeroom: 'Mr. Chen', gender: 'male', dateOfBirth: '02/15/2018' },
  { id: 'STU008', studentNumber: '10045685', firstName: 'Avery', lastName: 'Harris', grade: '1', homeroom: 'Mr. Chen', gender: 'female', dateOfBirth: '10/27/2018' },
  { id: 'STU009', studentNumber: '10045686', firstName: 'Drew', lastName: 'Iverson', grade: '1', homeroom: 'Mr. Chen', gender: 'male', dateOfBirth: '04/11/2018' },
  { id: 'STU010', studentNumber: '10045687', firstName: 'Skyler', lastName: 'Jackson', grade: '1', homeroom: 'Mr. Chen', gender: 'female', dateOfBirth: '12/06/2018' },

  // Grade 2 — Mrs. Davis
  { id: 'STU011', studentNumber: '10045688', firstName: 'Dakota', lastName: 'Kim', grade: '2', homeroom: 'Mrs. Davis', gender: 'male', dateOfBirth: '06/19/2017' },
  { id: 'STU012', studentNumber: '10045689', firstName: 'Reese', lastName: 'Lopez', grade: '2', homeroom: 'Mrs. Davis', gender: 'female', dateOfBirth: '09/02/2017' },
  { id: 'STU013', studentNumber: '10045690', firstName: 'Cameron', lastName: 'Martinez', grade: '2', homeroom: 'Mrs. Davis', gender: 'male', dateOfBirth: '01/25/2017' },
  { id: 'STU014', studentNumber: '10045691', firstName: 'Sage', lastName: 'Nelson', grade: '2', homeroom: 'Mrs. Davis', gender: 'female', dateOfBirth: '07/08/2017' },
  { id: 'STU015', studentNumber: '10045692', firstName: 'Finley', lastName: 'Ortiz', grade: '2', homeroom: 'Mrs. Davis', gender: 'male', dateOfBirth: '03/30/2017' },

  // Grade 3 — Ms. Patel
  { id: 'STU016', studentNumber: '10045693', firstName: 'Emerson', lastName: 'Patel', grade: '3', homeroom: 'Ms. Patel', gender: 'female', dateOfBirth: '11/14/2016' },
  { id: 'STU017', studentNumber: '10045694', firstName: 'Parker', lastName: 'Quinn', grade: '3', homeroom: 'Ms. Patel', gender: 'male', dateOfBirth: '05/22/2016' },
  { id: 'STU018', studentNumber: '10045695', firstName: 'Hayden', lastName: 'Rivera', grade: '3', homeroom: 'Ms. Patel', gender: 'male', dateOfBirth: '08/17/2016' },
  { id: 'STU019', studentNumber: '10045696', firstName: 'Rowan', lastName: 'Smith', grade: '3', homeroom: 'Ms. Patel', gender: 'female', dateOfBirth: '02/03/2016' },
  { id: 'STU020', studentNumber: '10045697', firstName: 'Charlie', lastName: 'Thompson', grade: '3', homeroom: 'Ms. Patel', gender: 'male', dateOfBirth: '10/09/2016' },

  // Grade 4 — Mr. Thompson
  { id: 'STU021', studentNumber: '10045698', firstName: 'Blake', lastName: 'Valdez', grade: '4', homeroom: 'Mr. Thompson', gender: 'male', dateOfBirth: '04/26/2015' },
  { id: 'STU022', studentNumber: '10045699', firstName: 'Peyton', lastName: 'Williams', grade: '4', homeroom: 'Mr. Thompson', gender: 'female', dateOfBirth: '12/13/2015' },
  { id: 'STU023', studentNumber: '10045700', firstName: 'Jamie', lastName: 'Xavier', grade: '4', homeroom: 'Mr. Thompson', gender: 'female', dateOfBirth: '06/07/2015' },
  { id: 'STU024', studentNumber: '10045701', firstName: 'Logan', lastName: 'Young', grade: '4', homeroom: 'Mr. Thompson', gender: 'male', dateOfBirth: '09/19/2015' },
  { id: 'STU025', studentNumber: '10045702', firstName: 'River', lastName: 'Zhang', grade: '4', homeroom: 'Mr. Thompson', gender: 'female', dateOfBirth: '01/31/2015' },

  // Grade 5 — Mrs. Kim
  { id: 'STU026', studentNumber: '10045703', firstName: 'Phoenix', lastName: 'Adams', grade: '5', homeroom: 'Mrs. Kim', gender: 'male', dateOfBirth: '07/15/2014' },
  { id: 'STU027', studentNumber: '10045704', firstName: 'Eden', lastName: 'Baker', grade: '5', homeroom: 'Mrs. Kim', gender: 'female', dateOfBirth: '03/08/2014' },
  { id: 'STU028', studentNumber: '10045705', firstName: 'Kendall', lastName: 'Carter', grade: '5', homeroom: 'Mrs. Kim', gender: 'female', dateOfBirth: '10/21/2014' },
  { id: 'STU029', studentNumber: '10045706', firstName: 'Marley', lastName: 'Diaz', grade: '5', homeroom: 'Mrs. Kim', gender: 'male', dateOfBirth: '05/04/2014' },
  { id: 'STU030', studentNumber: '10045707', firstName: 'Oakley', lastName: 'Evans', grade: '5', homeroom: 'Mrs. Kim', gender: 'female', dateOfBirth: '08/28/2014' },
]

export function getStudentById(id: string): DemoStudent | undefined {
  return students.find(s => s.id === id)
}

export function getStudentsByGrade(grade: string): DemoStudent[] {
  return students.filter(s => s.grade === grade)
}

export function getStudentsByHomeroom(homeroom: string): DemoStudent[] {
  return students.filter(s => s.homeroom === homeroom)
}
