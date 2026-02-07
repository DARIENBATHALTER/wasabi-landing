import { createContext, useContext } from 'react'

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

export interface MockupState {
  searchQuery: string
  setSearchQuery: (q: string) => void
  selectedStudents: DemoStudent[]
  setSelectedStudents: (s: DemoStudent[]) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  showTour: boolean
  setShowTour: (show: boolean) => void
}

export const MockupContext = createContext<MockupState | null>(null)

export function useMockupState(): MockupState {
  const ctx = useContext(MockupContext)
  if (!ctx) throw new Error('useMockupState must be used within MockupContext.Provider')
  return ctx
}
