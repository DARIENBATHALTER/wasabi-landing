import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMockupContext } from './MockupApp'
import { Search, Menu, LogOut } from 'lucide-react'
import { students } from '../data/students'
import ThemeToggle from '../components/ThemeToggle'
import StudentAvatar from '../components/StudentAvatar'

export default function MockupHeader() {
  const { searchQuery, setSearchQuery, selectedStudents, setSidebarOpen, setSelectedStudents } = useMockupContext()
  const [localQuery, setLocalQuery] = useState(searchQuery)
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter suggestions as user types
  const suggestions = localQuery.length >= 1
    ? students.filter(s =>
        s.firstName.toLowerCase().includes(localQuery.toLowerCase()) ||
        s.lastName.toLowerCase().includes(localQuery.toLowerCase()) ||
        s.studentNumber.includes(localQuery) ||
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(localQuery.toLowerCase()) ||
        `${s.lastName}, ${s.firstName}`.toLowerCase().includes(localQuery.toLowerCase())
      ).slice(0, 6)
    : []

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = () => {
    setSearchQuery(localQuery)
    setShowDropdown(false)
    navigate('/try/search')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleSelectSuggestion = (student: typeof students[0]) => {
    setSelectedStudents([student])
    setShowDropdown(false)
    setLocalQuery('')
    navigate('/try/profile')
  }

  return (
    <header className="h-16 bg-gray-800 border-b border-gray-700/50 flex items-center px-4 gap-4 flex-shrink-0">
      {/* Mobile hamburger */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
      >
        <Menu size={22} />
      </button>

      {/* Logo (visible on mobile when sidebar hidden) */}
      <Link to="/try" className="lg:hidden flex items-center gap-2">
        <img src="/wasabilogo.png" alt="WASABI" className="w-7 h-7" />
        <span className="text-white font-display font-bold text-base">WASABI</span>
      </Link>

      {/* Search */}
      <div data-tour="search" ref={searchRef} className="flex-1 max-w-xl relative">
        <div className="relative flex items-center">
          <Search size={18} className="absolute left-3 text-gray-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={localQuery}
            onChange={(e) => {
              setLocalQuery(e.target.value)
              setShowDropdown(true)
            }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search students..."
            className="w-full h-10 pl-10 pr-20 bg-gray-700/60 border border-gray-600/50 rounded-lg
              text-white placeholder-gray-400 text-sm
              focus:outline-none focus:border-wasabi-green focus:ring-1 focus:ring-wasabi-green/30
              transition-all duration-200"
          />
          <button
            onClick={handleSearch}
            className="absolute right-1.5 px-3 py-1.5 bg-wasabi-green hover:bg-wasabi-green/80
              text-white text-xs font-medium rounded-md transition-colors"
          >
            Go
          </button>
        </div>

        {/* Search dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 overflow-hidden">
            {suggestions.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelectSuggestion(s)}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-700 transition-colors text-left"
              >
                <StudentAvatar firstName={s.firstName} lastName={s.lastName} gender={s.gender} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm text-white font-medium truncate">
                    {s.lastName}, {s.firstName}
                  </p>
                  <p className="text-xs text-gray-400">
                    Grade {s.grade} &middot; {s.homeroom} &middot; #{s.studentNumber}
                  </p>
                </div>
              </button>
            ))}
            <button
              onClick={handleSearch}
              className="w-full px-3 py-2 text-xs text-wasabi-green hover:bg-gray-700/50 transition-colors border-t border-gray-700"
            >
              View all results for "{localQuery}"
            </button>
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Selected student count */}
        {selectedStudents.length > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-wasabi-green/20 border border-wasabi-green/30 rounded-full">
            <span className="text-wasabi-green text-xs font-medium">
              {selectedStudents.length} selected
            </span>
          </div>
        )}

        <ThemeToggle className="text-gray-400" />

        <Link
          to="/"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            border border-wasabi-green/50 text-wasabi-green hover:bg-wasabi-green hover:text-white
            transition-all duration-200 text-xs font-medium"
        >
          <LogOut size={14} />
          <span>Exit Demo</span>
        </Link>
      </div>
    </header>
  )
}
