import { useEffect, useState } from 'react'
import { useMockupContext } from './MockupApp'
import {
  Eye,
  Plus,
  Clock,
  CheckCircle2,
  Star,
  ChevronDown,
  ChevronRight,
  Calendar,
  MapPin,
  User,
  FileText,
  BarChart3,
} from 'lucide-react'

interface ObservationRecord {
  id: string
  teacher: string
  observer: string
  date: string
  duration: string
  classroom: string
  status: 'completed' | 'in-progress' | 'scheduled'
  overallRating?: number
  domains: {
    name: string
    rating: number
    notes: string
  }[]
  strengths?: string
  growthAreas?: string
  nextSteps?: string
}

const demoObservations: ObservationRecord[] = [
  {
    id: 'OBS001',
    teacher: 'Ms. Rodriguez',
    observer: 'Dr. Sarah Mitchell',
    date: '01/15/2025',
    duration: '45 min',
    classroom: 'Room 102 (Kindergarten)',
    status: 'completed',
    overallRating: 4,
    domains: [
      { name: 'Planning & Preparation', rating: 4, notes: 'Clear learning objectives posted and referenced throughout the lesson.' },
      { name: 'Classroom Environment', rating: 5, notes: 'Warm, inviting space with student work displayed. Excellent classroom management.' },
      { name: 'Instruction', rating: 4, notes: 'Differentiated instruction observed with small group rotations.' },
      { name: 'Professional Responsibilities', rating: 3, notes: 'Timely parent communication. Could improve data-tracking documentation.' },
    ],
    strengths: 'Exceptional classroom culture. Students are engaged and feel safe to take risks. Transitions are smooth and efficient.',
    growthAreas: 'Consider incorporating more formative assessment check-ins during small group instruction.',
    nextSteps: 'Schedule follow-up walkthrough in 4 weeks. Share exemplar data-tracking templates.',
  },
  {
    id: 'OBS002',
    teacher: 'Mr. Chen',
    observer: 'Dr. Sarah Mitchell',
    date: '01/22/2025',
    duration: '30 min',
    classroom: 'Room 105 (1st Grade)',
    status: 'completed',
    overallRating: 3,
    domains: [
      { name: 'Planning & Preparation', rating: 3, notes: 'Lesson plan aligned to standards but lacked differentiation strategies.' },
      { name: 'Classroom Environment', rating: 4, notes: 'Positive rapport with students. Consistent behavioral expectations.' },
      { name: 'Instruction', rating: 3, notes: 'Mostly whole-group instruction. Limited student-to-student discourse.' },
      { name: 'Professional Responsibilities', rating: 3, notes: 'Communicates regularly with families. Participates in grade-level PLC.' },
    ],
    strengths: 'Strong relationships with students. Content knowledge is evident in explanations.',
    growthAreas: 'Increase opportunities for student collaboration and academic discourse. Build in turn-and-talk strategies.',
    nextSteps: 'Observe Mrs. Davis as a model for small-group instruction. Follow up in 3 weeks.',
  },
  {
    id: 'OBS003',
    teacher: 'Mrs. Davis',
    observer: 'Dr. Sarah Mitchell',
    date: '02/12/2025',
    duration: '45 min',
    classroom: 'Room 108 (2nd Grade)',
    status: 'completed',
    overallRating: 5,
    domains: [
      { name: 'Planning & Preparation', rating: 5, notes: 'Exemplary lesson plan with scaffolded activities for all learners.' },
      { name: 'Classroom Environment', rating: 5, notes: 'Student-led routines. Peer support systems in place.' },
      { name: 'Instruction', rating: 5, notes: 'Seamless integration of technology. Real-time formative assessment with adjustment.' },
      { name: 'Professional Responsibilities', rating: 4, notes: 'Active mentor for new teachers. Strong data-driven decision making.' },
    ],
    strengths: 'Model classroom for differentiated instruction. Every student was engaged and working at their level.',
    growthAreas: 'Consider presenting strategies at next professional development day.',
    nextSteps: 'Invite peers to observe. Nominate for Teacher of the Quarter.',
  },
  {
    id: 'OBS004',
    teacher: 'Ms. Patel',
    observer: 'Dr. Sarah Mitchell',
    date: '02/28/2025',
    duration: '30 min',
    classroom: 'Room 201 (3rd Grade)',
    status: 'scheduled',
    domains: [],
  },
  {
    id: 'OBS005',
    teacher: 'Mr. Thompson',
    observer: 'Dr. Sarah Mitchell',
    date: '03/05/2025',
    duration: '45 min',
    classroom: 'Room 204 (4th Grade)',
    status: 'scheduled',
    domains: [],
  },
]

const ratingLabels: Record<number, { label: string; color: string }> = {
  1: { label: 'Unsatisfactory', color: 'text-red-600 dark:text-red-400' },
  2: { label: 'Developing', color: 'text-orange-600 dark:text-orange-400' },
  3: { label: 'Proficient', color: 'text-yellow-600 dark:text-yellow-400' },
  4: { label: 'Distinguished', color: 'text-lime-600 dark:text-lime-400' },
  5: { label: 'Exemplary', color: 'text-green-600 dark:text-green-400' },
}

export default function MockupObservation() {
  const { setCurrentView } = useMockupContext()
  const [selectedObs, setSelectedObs] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<'list' | 'new'>('list')

  useEffect(() => {
    setCurrentView('observation')
  }, [setCurrentView])

  const completed = demoObservations.filter(o => o.status === 'completed')
  const scheduled = demoObservations.filter(o => o.status === 'scheduled')
  const avgRating = completed.length > 0
    ? Math.round((completed.reduce((s, o) => s + (o.overallRating ?? 0), 0) / completed.length) * 10) / 10
    : 0

  const expandedObs = selectedObs ? demoObservations.find(o => o.id === selectedObs) : null

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">SOBA Observations</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Structured Observation-Based Assessment — classroom walkthroughs and evaluations
          </p>
        </div>
        <button
          onClick={() => setActiveView(activeView === 'new' ? 'list' : 'new')}
          className="flex items-center gap-2 px-4 py-2 bg-wasabi-green hover:bg-wasabi-green/90
            text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus size={16} />
          New Observation
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatsCard
          icon={<Eye size={20} className="text-blue-500" />}
          label="Total Observations"
          value={String(demoObservations.length)}
          bgClass="bg-blue-50 dark:bg-blue-900/20"
        />
        <StatsCard
          icon={<CheckCircle2 size={20} className="text-green-500" />}
          label="Completed"
          value={String(completed.length)}
          bgClass="bg-green-50 dark:bg-green-900/20"
        />
        <StatsCard
          icon={<Clock size={20} className="text-amber-500" />}
          label="Scheduled"
          value={String(scheduled.length)}
          bgClass="bg-amber-50 dark:bg-amber-900/20"
        />
        <StatsCard
          icon={<Star size={20} className="text-purple-500" />}
          label="Avg Rating"
          value={`${avgRating}/5`}
          bgClass="bg-purple-50 dark:bg-purple-900/20"
        />
      </div>

      {activeView === 'new' ? (
        <NewObservationForm onCancel={() => setActiveView('list')} />
      ) : (
        <>
          {/* Observation list */}
          <div className="space-y-3">
            {demoObservations.map(obs => (
              <div key={obs.id}>
                <button
                  onClick={() => setSelectedObs(selectedObs === obs.id ? null : obs.id)}
                  className="w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4
                    hover:border-gray-300 dark:hover:border-gray-600 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      obs.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-amber-100 dark:bg-amber-900/30'
                    }`}>
                      {obs.status === 'completed'
                        ? <CheckCircle2 size={20} className="text-green-600 dark:text-green-400" />
                        : <Clock size={20} className="text-amber-600 dark:text-amber-400" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{obs.teacher}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          obs.status === 'completed'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                        }`}>
                          {obs.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {obs.date}</span>
                        <span className="flex items-center gap-1"><MapPin size={12} /> {obs.classroom}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {obs.duration}</span>
                      </div>
                    </div>
                    {obs.overallRating && (
                      <div className="text-right flex-shrink-0 hidden sm:block">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={14} className={i < obs.overallRating! ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'} />
                          ))}
                        </div>
                        <p className={`text-[11px] font-medium mt-0.5 ${ratingLabels[obs.overallRating]?.color}`}>
                          {ratingLabels[obs.overallRating]?.label}
                        </p>
                      </div>
                    )}
                    <span className="text-gray-400 flex-shrink-0">
                      {selectedObs === obs.id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </span>
                  </div>
                </button>

                {/* Expanded details */}
                {selectedObs === obs.id && obs.status === 'completed' && expandedObs && (
                  <div className="mt-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 space-y-5">
                    {/* Domain ratings */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <BarChart3 size={16} className="text-wasabi-green" />
                        Domain Ratings
                      </h4>
                      <div className="space-y-3">
                        {expandedObs.domains.map((d, i) => (
                          <div key={i} className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{d.name}</span>
                              <div className="flex items-center gap-1.5">
                                <div className="flex items-center gap-0.5">
                                  {Array.from({ length: 5 }).map((_, j) => (
                                    <Star key={j} size={12} className={j < d.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'} />
                                  ))}
                                </div>
                                <span className={`text-xs font-semibold ${ratingLabels[d.rating]?.color}`}>
                                  {ratingLabels[d.rating]?.label}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{d.notes}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {expandedObs.strengths && (
                        <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-3 border border-green-100 dark:border-green-900/30">
                          <h5 className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase mb-1.5">Strengths</h5>
                          <p className="text-xs text-green-800 dark:text-green-300 leading-relaxed">{expandedObs.strengths}</p>
                        </div>
                      )}
                      {expandedObs.growthAreas && (
                        <div className="bg-amber-50 dark:bg-amber-900/10 rounded-lg p-3 border border-amber-100 dark:border-amber-900/30">
                          <h5 className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase mb-1.5">Growth Areas</h5>
                          <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">{expandedObs.growthAreas}</p>
                        </div>
                      )}
                      {expandedObs.nextSteps && (
                        <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-3 border border-blue-100 dark:border-blue-900/30">
                          <h5 className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase mb-1.5">Next Steps</h5>
                          <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">{expandedObs.nextSteps}</p>
                        </div>
                      )}
                    </div>

                    <p className="text-[10px] text-gray-400 flex items-center gap-1">
                      <User size={10} /> Observed by {expandedObs.observer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function NewObservationForm({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <FileText size={18} className="text-wasabi-green" />
        New Classroom Observation
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Teacher</label>
          <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600
            rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-wasabi-green">
            <option>Select teacher...</option>
            <option>Ms. Rodriguez</option>
            <option>Mr. Chen</option>
            <option>Mrs. Davis</option>
            <option>Ms. Patel</option>
            <option>Mr. Thompson</option>
            <option>Mrs. Kim</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Date</label>
          <input
            type="date"
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600
              rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-wasabi-green"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Observation Type</label>
          <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600
            rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-wasabi-green">
            <option>Formal Observation (45 min)</option>
            <option>Walkthrough (15-20 min)</option>
            <option>Peer Observation</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Observer</label>
          <input
            type="text"
            defaultValue="Dr. Sarah Mitchell"
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600
              rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-wasabi-green"
          />
        </div>
      </div>

      {/* Domain rating preview */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Evaluation Domains</h3>
        <div className="space-y-3">
          {['Planning & Preparation', 'Classroom Environment', 'Instruction', 'Professional Responsibilities'].map(domain => (
            <div key={domain} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/30 rounded-lg px-4 py-3">
              <span className="text-sm font-medium text-gray-900 dark:text-white">{domain}</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button key={i} className="p-0.5 hover:scale-125 transition-transform">
                    <Star size={18} className="text-gray-300 dark:text-gray-600 hover:text-amber-400" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Observation Notes</label>
        <textarea
          rows={4}
          placeholder="Record observations, evidence of learning, and classroom dynamics..."
          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600
            rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400
            focus:outline-none focus:border-wasabi-green resize-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          className="px-5 py-2.5 bg-wasabi-green hover:bg-wasabi-green/90 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          Save Observation
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
            text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

function StatsCard({ icon, label, value, bgClass }: { icon: React.ReactNode; label: string; value: string; bgClass: string }) {
  return (
    <div className={`rounded-xl p-4 ${bgClass} border border-gray-200/50 dark:border-gray-700/50`}>
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">{icon}</div>
        <div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        </div>
      </div>
    </div>
  )
}
