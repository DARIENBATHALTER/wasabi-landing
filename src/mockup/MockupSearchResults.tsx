import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMockupContext } from './MockupApp'
import { students, type DemoStudent } from '../data/students'
import StudentAvatar from '../components/StudentAvatar'
import { ChevronUp, ChevronDown, Eye } from 'lucide-react'

type SortField = 'name' | 'grade' | 'homeroom' | 'gender'
type SortDir = 'asc' | 'desc'

export default function MockupSearchResults() {
  const { searchQuery, setCurrentView, setSelectedStudents } = useMockupContext()
  const navigate = useNavigate()
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    setCurrentView('search')
  }, [setCurrentView])

  // Filter students by search query
  const filtered = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') return students
    const q = searchQuery.toLowerCase().trim()
    return students.filter(s =>
      s.firstName.toLowerCase().includes(q) ||
      s.lastName.toLowerCase().includes(q) ||
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
      `${s.lastName}, ${s.firstName}`.toLowerCase().includes(q) ||
      s.studentNumber.includes(q) ||
      s.grade.toLowerCase() === q ||
      s.homeroom.toLowerCase().includes(q)
    )
  }, [searchQuery])

  // Sort
  const sorted = useMemo(() => {
    const arr = [...filtered]
    arr.sort((a, b) => {
      let cmp = 0
      switch (sortField) {
        case 'name':
          cmp = a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName)
          break
        case 'grade':
          cmp = a.grade.localeCompare(b.grade, undefined, { numeric: true })
          break
        case 'homeroom':
          cmp = a.homeroom.localeCompare(b.homeroom)
          break
        case 'gender':
          cmp = a.gender.localeCompare(b.gender)
          break
      }
      return sortDir === 'desc' ? -cmp : cmp
    })
    return arr
  }, [filtered, sortField, sortDir])

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const toggleCheck = (id: string) => {
    setCheckedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (checkedIds.size === sorted.length) {
      setCheckedIds(new Set())
    } else {
      setCheckedIds(new Set(sorted.map(s => s.id)))
    }
  }

  const handleStudentClick = (student: DemoStudent) => {
    setSelectedStudents([student])
    navigate('/try/profile')
  }

  const handleViewSelected = () => {
    const selected = students.filter(s => checkedIds.has(s.id))
    setSelectedStudents(selected)
    navigate('/try/profile')
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUp size={14} className="text-gray-400 opacity-0 group-hover:opacity-50" />
    return sortDir === 'asc'
      ? <ChevronUp size={14} className="text-wasabi-green" />
      : <ChevronDown size={14} className="text-wasabi-green" />
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {searchQuery ? `Results for "${searchQuery}"` : 'All Students'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Showing {sorted.length} of {students.length} students
          </p>
        </div>

        {checkedIds.size > 0 && (
          <button
            onClick={handleViewSelected}
            className="flex items-center gap-2 px-4 py-2 bg-wasabi-green hover:bg-wasabi-green/90
              text-white text-sm font-medium rounded-lg transition-colors shadow-md"
          >
            <Eye size={16} />
            View {checkedIds.size} Profile{checkedIds.size > 1 ? 's' : ''}
          </button>
        )}
      </div>

      {/* Table */}
      <div
        data-tour="results"
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                <th className="w-10 px-3 py-3">
                  <input
                    type="checkbox"
                    checked={checkedIds.size === sorted.length && sorted.length > 0}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-gray-300 text-wasabi-green focus:ring-wasabi-green cursor-pointer accent-[#008800]"
                  />
                </th>
                <th className="w-12 px-2 py-3" />
                <th className="px-3 py-3 text-left">
                  <button onClick={() => toggleSort('name')} className="flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider group">
                    Name <SortIcon field="name" />
                  </button>
                </th>
                <th className="px-3 py-3 text-left">
                  <button onClick={() => toggleSort('grade')} className="flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider group">
                    Grade <SortIcon field="grade" />
                  </button>
                </th>
                <th className="px-3 py-3 text-left hidden sm:table-cell">
                  <button onClick={() => toggleSort('homeroom')} className="flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider group">
                    Homeroom <SortIcon field="homeroom" />
                  </button>
                </th>
                <th className="px-3 py-3 text-left hidden md:table-cell">
                  <button onClick={() => toggleSort('gender')} className="flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider group">
                    Gender <SortIcon field="gender" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {sorted.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-750/50 transition-colors"
                >
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={checkedIds.has(student.id)}
                      onChange={() => toggleCheck(student.id)}
                      className="w-4 h-4 rounded border-gray-300 text-wasabi-green focus:ring-wasabi-green cursor-pointer accent-[#008800]"
                    />
                  </td>
                  <td className="px-2 py-3">
                    <StudentAvatar
                      firstName={student.firstName}
                      lastName={student.lastName}
                      gender={student.gender}
                      size="sm"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <button
                      onClick={() => handleStudentClick(student)}
                      className="text-sm font-medium text-gray-900 dark:text-white hover:text-wasabi-green dark:hover:text-wasabi-green transition-colors"
                    >
                      {student.lastName}, {student.firstName}
                    </button>
                  </td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-wasabi-green/10 text-wasabi-green text-xs font-bold">
                      {student.grade}
                    </span>
                  </td>
                  <td className="px-3 py-3 hidden sm:table-cell">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {student.homeroom}
                    </span>
                  </td>
                  <td className="px-3 py-3 hidden md:table-cell">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                      ${student.gender === 'male'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300'
                      }
                    `}>
                      {student.gender === 'male' ? 'Male' : 'Female'}
                    </span>
                  </td>
                </tr>
              ))}

              {sorted.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      No students found matching "{searchQuery}"
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                      Try searching by first name, last name, or student number
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
