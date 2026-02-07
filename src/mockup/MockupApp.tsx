import { createContext, useContext, useState, type ReactNode } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import type { DemoStudent } from '../data/students'
import MockupLayout from './MockupLayout'
import MockupWelcome from './MockupWelcome'
import MockupSearchResults from './MockupSearchResults'
import MockupProfileCard from './MockupProfileCard'
import MockupAnalytics from './MockupAnalytics'
import MockupFlagging from './MockupFlagging'

interface MockupContextType {
  searchQuery: string
  setSearchQuery: (q: string) => void
  selectedStudents: DemoStudent[]
  setSelectedStudents: (s: DemoStudent[]) => void
  sidebarOpen: boolean
  setSidebarOpen: (v: boolean) => void
  showTour: boolean
  setShowTour: (v: boolean) => void
  currentView: string
  setCurrentView: (v: string) => void
}

const MockupContext = createContext<MockupContextType | null>(null)

export function useMockupContext(): MockupContextType {
  const ctx = useContext(MockupContext)
  if (!ctx) throw new Error('useMockupContext must be used within MockupApp')
  return ctx
}

function MockupProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStudents, setSelectedStudents] = useState<DemoStudent[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showTour, setShowTour] = useState(true)
  const [currentView, setCurrentView] = useState('welcome')

  return (
    <MockupContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        selectedStudents,
        setSelectedStudents,
        sidebarOpen,
        setSidebarOpen,
        showTour,
        setShowTour,
        currentView,
        setCurrentView,
      }}
    >
      {children}
    </MockupContext.Provider>
  )
}

export default function MockupApp() {
  return (
    <MockupProvider>
      <Routes>
        <Route element={<MockupLayout />}>
          <Route index element={<MockupWelcome />} />
          <Route path="search" element={<MockupSearchResults />} />
          <Route path="profile" element={<MockupProfileCard />} />
          <Route path="analytics" element={<MockupAnalytics />} />
          <Route path="flagging" element={<MockupFlagging />} />
          <Route path="*" element={<Navigate to="/try" replace />} />
        </Route>
      </Routes>
    </MockupProvider>
  )
}
