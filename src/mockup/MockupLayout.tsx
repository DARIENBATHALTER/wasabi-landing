import { Outlet } from 'react-router-dom'
import { useMockupContext } from './MockupApp'
import MockupSidebar from './MockupSidebar'
import MockupHeader from './MockupHeader'
import MockupNoriBubble from './MockupNoriBubble'
import MockupTour from './MockupTour'

export default function MockupLayout() {
  const { sidebarOpen, setSidebarOpen, showTour } = useMockupContext()

  return (
    <div className="h-screen overflow-hidden flex bg-gray-100 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <MockupSidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <MockupHeader />

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {/* Nori AI Bubble */}
      <MockupNoriBubble />

      {/* Tour Overlay */}
      {showTour && <MockupTour />}
    </div>
  )
}
