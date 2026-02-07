import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useMockupContext } from './MockupApp'
import {
  Users,
  FileText,
  Flag,
  BarChart3,
  GraduationCap,
  ClipboardList,
  Eye,
  Bot,
  LogOut,
  X,
} from 'lucide-react'
import { useState } from 'react'

interface MenuItem {
  label: string
  icon: React.ReactNode
  path?: string
  tooltip?: string
  badge?: string
}

export default function MockupSidebar() {
  const { sidebarOpen, setSidebarOpen } = useMockupContext()
  const location = useLocation()
  const navigate = useNavigate()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const menuItems: MenuItem[] = [
    { label: 'Profile Search', icon: <Users size={20} />, path: '/try/search' },
    { label: 'Student Reports', icon: <FileText size={20} />, path: '/try/reports' },
    { label: 'Flagging System', icon: <Flag size={20} />, path: '/try/flagging' },
    { label: 'Class Analytics', icon: <BarChart3 size={20} />, path: '/try/analytics' },
    { label: 'Grade Analytics', icon: <GraduationCap size={20} />, path: '/try/grade-analytics' },
    { label: 'Exam Analytics', icon: <ClipboardList size={20} />, path: '/try/exam-analytics' },
    { label: 'Observation', icon: <Eye size={20} />, path: '/try/observation' },
    { label: 'Nori AI', icon: <Bot size={20} />, path: '/try/nori', badge: 'BETA' },
  ]

  const isActive = (path?: string) => {
    if (!path) return false
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const handleItemClick = (item: MenuItem) => {
    if (item.path) {
      navigate(item.path)
      setSidebarOpen(false)
    }
  }

  return (
    <aside
      data-tour="sidebar"
      className={`
        fixed lg:relative z-40 h-full w-64 bg-wasabi-dark flex flex-col
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* Logo area */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-gray-700/50">
        <Link to="/try" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
          <img
            src="/wasabi-landing/wasabilogo.png"
            alt="WASABI"
            className="w-8 h-8"
          />
          <span className="text-white font-display font-bold text-lg tracking-wide">WASABI</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const active = isActive(item.path)
          const isHovered = hoveredItem === item.label

          return (
            <div key={item.label} className="relative">
              <button
                onClick={() => handleItemClick(item)}
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200 group
                  ${active
                    ? 'bg-wasabi-green text-white shadow-lg shadow-wasabi-green/20'
                    : item.path
                      ? 'text-gray-300 hover:bg-gray-700/60 hover:text-white'
                      : 'text-gray-500 hover:bg-gray-700/30 hover:text-gray-400 cursor-default'
                  }
                `}
              >
                <span className={`flex-shrink-0 ${active ? 'text-white' : ''}`}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    {item.badge}
                  </span>
                )}
                {!item.path && !item.badge && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-gray-600" />
                )}
              </button>

              {/* Tooltip for unavailable items */}
              {item.tooltip && isHovered && !item.path && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 whitespace-nowrap">
                  <div className="bg-gray-800 text-gray-200 text-xs px-3 py-2 rounded-lg shadow-xl border border-gray-600">
                    {item.tooltip}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-800" />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* User info + Exit */}
      <div className="border-t border-gray-700/50 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-wasabi-green/20 border border-wasabi-green/40 flex items-center justify-center">
            <span className="text-wasabi-green text-sm font-bold">DU</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">Demo User</p>
            <p className="text-xs text-gray-400 truncate">Viewing demo data</p>
          </div>
        </div>
        <Link
          to="/"
          className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg
            border border-gray-600 text-gray-300 hover:border-wasabi-green hover:text-wasabi-green
            transition-all duration-200 text-sm font-medium"
        >
          <LogOut size={16} />
          Exit Demo
        </Link>
      </div>
    </aside>
  )
}
