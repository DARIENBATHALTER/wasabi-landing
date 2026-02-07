import { useEffect, useState, useRef } from 'react'
import { useMockupContext } from './MockupApp'
import { students } from '../data/students'
import { getStudentAttendanceRate, getSchoolwideAttendanceRate } from '../data/attendance'
import { getStudentGPA, getClassAverageGPA } from '../data/grades'
import { getAllFlaggedStudents } from '../data/flags'
import { getStudentAssessments, getClassProficiency } from '../data/assessments'
import { Bot, Send, Loader2, Sparkles, Lightbulb, Users, TrendingUp, AlertTriangle, BookOpen } from 'lucide-react'

interface ChatMessage {
  id: string
  sender: 'user' | 'nori'
  text: string
  timestamp: Date
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

const suggestedPrompts = [
  { icon: <AlertTriangle size={14} />, label: 'Who needs help?', prompt: 'Which students are at risk and need additional support?' },
  { icon: <TrendingUp size={14} />, label: 'Class overview', prompt: 'Give me a schoolwide overview of student performance' },
  { icon: <Users size={14} />, label: 'Top performers', prompt: 'Who are the top performing students?' },
  { icon: <BookOpen size={14} />, label: 'Assessment trends', prompt: 'How are students performing on iReady assessments?' },
  { icon: <Lightbulb size={14} />, label: 'Attendance concerns', prompt: 'Which students have attendance issues?' },
  { icon: <Sparkles size={14} />, label: 'Growth insights', prompt: 'Which students have shown the most growth this year?' },
]

export default function MockupNoriPage() {
  const { setCurrentView } = useMockupContext()
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'nori',
      text: "Welcome to Nori AI! I'm your intelligent teaching assistant, designed to help you make data-driven decisions about your students.\n\nI can analyze attendance patterns, grade trends, assessment scores, and flag at-risk students instantly. Ask me anything about your student data, or try one of the suggested prompts below.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setCurrentView('nori')
  }, [setCurrentView])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const generateResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase().trim()

    // At-risk / help / flag
    if (msg.includes('risk') || msg.includes('help') || msg.includes('flag') || msg.includes('concern') || msg.includes('support') || msg.includes('struggling')) {
      const flagged = getAllFlaggedStudents()
      let response = `I've identified **${flagged.length} students** who may need additional support:\n\n`
      for (const { student, flags } of flagged) {
        const concerns = flags.map(f => f.message).join('; ')
        const gpa = getStudentGPA(student.id)
        const att = getStudentAttendanceRate(student.id)
        response += `**${student.firstName} ${student.lastName}** (Grade ${student.grade}, ${student.homeroom})\n`
        response += `  GPA: ${gpa.toFixed(2)} | Attendance: ${att}% | Flags: ${concerns}\n\n`
      }
      response += 'I recommend prioritizing students with multiple high-severity flags for immediate intervention planning.'
      return response
    }

    // Top performers
    if (msg.includes('top') || msg.includes('best') || msg.includes('honor') || msg.includes('excell')) {
      const ranked = students
        .map(s => ({ student: s, gpa: getStudentGPA(s.id), att: getStudentAttendanceRate(s.id) }))
        .sort((a, b) => b.gpa - a.gpa)
        .slice(0, 5)

      let response = "Here are the **top 5 performing students** by GPA:\n\n"
      for (const { student, gpa, att } of ranked) {
        response += `**${student.firstName} ${student.lastName}** (Grade ${student.grade}) — GPA: **${gpa.toFixed(2)}**, Attendance: **${att}%**\n`
      }
      response += '\nThese students could serve as peer mentors or tutors for struggling classmates.'
      return response
    }

    // Assessment / iReady / FAST
    if (msg.includes('assessment') || msg.includes('iready') || msg.includes('fast') || msg.includes('exam') || msg.includes('test')) {
      const readingProf = getClassProficiency('iready-reading')
      const mathProf = getClassProficiency('iready-math')
      const totalR = readingProf.below + readingProf.approaching + readingProf.meets + readingProf.exceeds
      const totalM = mathProf.below + mathProf.approaching + mathProf.meets + mathProf.exceeds
      const readingOnTrack = Math.round(((readingProf.meets + readingProf.exceeds) / totalR) * 100)
      const mathOnTrack = Math.round(((mathProf.meets + mathProf.exceeds) / totalM) * 100)

      return `Here's the latest **assessment snapshot** (EOY scores):\n\n` +
        `**iReady Reading:** ${readingOnTrack}% on/above grade level\n` +
        `  Below: ${readingProf.below} | Approaching: ${readingProf.approaching} | Meets: ${readingProf.meets} | Exceeds: ${readingProf.exceeds}\n\n` +
        `**iReady Math:** ${mathOnTrack}% on/above grade level\n` +
        `  Below: ${mathProf.below} | Approaching: ${mathProf.approaching} | Meets: ${mathProf.meets} | Exceeds: ${mathProf.exceeds}\n\n` +
        `Visit the **Exam Analytics** page for detailed breakdowns by grade level, growth trends, and individual student scores.`
    }

    // Attendance
    if (msg.includes('attendance') || msg.includes('absent') || msg.includes('tardy')) {
      const schoolRate = getSchoolwideAttendanceRate()
      const lowAttendance = students
        .map(s => ({ student: s, rate: getStudentAttendanceRate(s.id) }))
        .filter(x => x.rate < 90)
        .sort((a, b) => a.rate - b.rate)

      let response = `**Schoolwide attendance rate: ${schoolRate}%**\n\n`
      if (lowAttendance.length > 0) {
        response += `${lowAttendance.length} students have attendance below 90%:\n\n`
        for (const { student, rate } of lowAttendance) {
          response += `- **${student.firstName} ${student.lastName}** (Grade ${student.grade}): **${rate}%** attendance\n`
        }
        response += '\nChronic absenteeism (below 90%) is a key predictor of academic difficulty. Consider scheduling parent meetings for these students.'
      } else {
        response += 'All students are above the 90% attendance threshold. Great job!'
      }
      return response
    }

    // Overview / summary / class
    if (msg.includes('overview') || msg.includes('summary') || msg.includes('class') || msg.includes('school') || msg.includes('performance')) {
      const avgGPA = getClassAverageGPA()
      const schoolAtt = getSchoolwideAttendanceRate()
      const flagged = getAllFlaggedStudents().length
      const readingProf = getClassProficiency('iready-reading')
      const totalR = readingProf.below + readingProf.approaching + readingProf.meets + readingProf.exceeds
      const onTrack = Math.round(((readingProf.meets + readingProf.exceeds) / totalR) * 100)

      return `Here's your **schoolwide dashboard summary** for ${students.length} students:\n\n` +
        `**Academics:** Average GPA is **${avgGPA.toFixed(2)}**\n` +
        `**Attendance:** Schoolwide rate is **${schoolAtt}%**\n` +
        `**Reading Proficiency:** ${onTrack}% of students are on or above grade level\n` +
        `**At-Risk Students:** ${flagged} students currently flagged for support\n\n` +
        `The data suggests overall strong performance, with a small group of students who need targeted intervention. Would you like me to dive deeper into any of these areas?`
    }

    // Growth
    if (msg.includes('growth') || msg.includes('improve') || msg.includes('progress')) {
      const studentGrowth = students.map(s => {
        const assessments = getStudentAssessments(s.id).filter(a => a.source === 'iready-reading')
        const boy = assessments.find(a => a.period === 'BOY')
        const eoy = assessments.find(a => a.period === 'EOY')
        return {
          student: s,
          growth: boy && eoy ? eoy.score - boy.score : 0,
        }
      }).sort((a, b) => b.growth - a.growth)

      const top = studentGrowth.slice(0, 5)
      let response = "Here are the **top 5 students by iReady Reading growth** (BOY to EOY):\n\n"
      for (const { student, growth } of top) {
        response += `**${student.firstName} ${student.lastName}** (Grade ${student.grade}) — **+${growth} points**\n`
      }
      response += '\nConsistent growth is a strong indicator that instructional strategies are working. Consider recognizing these students for their effort!'
      return response
    }

    // Specific student
    const matchedStudent = students.find(s =>
      msg.includes(s.firstName.toLowerCase()) || msg.includes(s.lastName.toLowerCase())
    )
    if (matchedStudent) {
      const att = getStudentAttendanceRate(matchedStudent.id)
      const gpa = getStudentGPA(matchedStudent.id)
      const assessments = getStudentAssessments(matchedStudent.id)
      const latestReading = assessments.filter(a => a.source === 'iready-reading').slice(-1)[0]
      const latestMath = assessments.filter(a => a.source === 'iready-math').slice(-1)[0]
      const attNote = att >= 95 ? 'excellent' : att >= 90 ? 'adequate but should be monitored' : 'concerning and requires intervention'
      const gpaNote = gpa >= 3.0 ? 'strong' : gpa >= 2.0 ? 'average' : 'below expectations and requires support'

      return `Here's a comprehensive look at **${matchedStudent.firstName} ${matchedStudent.lastName}**:\n\n` +
        `**Demographics:** Grade ${matchedStudent.grade} | ${matchedStudent.homeroom} | ID #${matchedStudent.studentNumber}\n\n` +
        `**Attendance:** ${att}% — ${attNote}\n` +
        `**GPA:** ${gpa.toFixed(2)} — ${gpaNote}\n` +
        (latestReading ? `**iReady Reading (EOY):** Score ${latestReading.score} — ${latestReading.proficiency}\n` : '') +
        (latestMath ? `**iReady Math (EOY):** Score ${latestMath.score} — ${latestMath.proficiency}\n` : '') +
        `\nUse the **Student Reports** page to generate a printable report for ${matchedStudent.firstName}'s records.`
    }

    // Greeting
    if (msg.includes('hello') || msg.includes('hi') || msg === 'hey' || msg.includes('good morning') || msg.includes('good afternoon')) {
      return "Hello! I'm ready to help you make sense of your student data. Here's what I can do:\n\n" +
        "- Identify **at-risk students** who need support\n" +
        "- Provide **class performance summaries**\n" +
        "- Analyze **assessment trends** and growth\n" +
        "- Look up **individual student data**\n" +
        "- Find **attendance patterns** and concerns\n\n" +
        "What would you like to explore?"
    }

    // Default
    return "I'd be happy to help! Here are some things you can ask me about:\n\n" +
      "- **\"Who needs help?\"** — Identify at-risk students\n" +
      "- **\"Show me a class overview\"** — Schoolwide performance summary\n" +
      "- **\"How is [student name] doing?\"** — Individual student analysis\n" +
      "- **\"Assessment trends\"** — iReady and FAST proficiency data\n" +
      "- **\"Attendance concerns\"** — Students with low attendance\n" +
      "- **\"Top performers\"** — Highest-achieving students\n" +
      "- **\"Growth insights\"** — Students showing the most improvement\n\n" +
      "I have access to all 30 demo students' attendance, grades, assessments, and behavioral data."
  }

  const handleSend = (text?: string) => {
    const trimmed = (text || input).trim()
    if (!trimmed || isThinking) return

    const userMsg: ChatMessage = {
      id: generateId(),
      sender: 'user',
      text: trimmed,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsThinking(true)

    setTimeout(() => {
      const response = generateResponse(trimmed)
      const noriMsg: ChatMessage = {
        id: generateId(),
        sender: 'nori',
        text: response,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, noriMsg])
      setIsThinking(false)
    }, 1000 + Math.random() * 800)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Render markdown-like bold
  const renderText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4 flex-shrink-0">
        <div className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: 'radial-gradient(circle at 30% 30%, #c084fc, #6d28d9)' }}>
          <Bot size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Nori AI
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-500/20 text-purple-500 border border-purple-500/30 uppercase">
              Beta
            </span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your AI-powered teaching assistant
          </p>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 min-h-0 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'nori' && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-0.5"
                  style={{ background: 'radial-gradient(circle at 30% 30%, #c084fc, #6d28d9)' }}>
                  <Bot size={14} className="text-white" />
                </div>
              )}
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                  ${msg.sender === 'user'
                    ? 'bg-wasabi-green text-white rounded-br-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-md'
                  }`}
              >
                {renderText(msg.text)}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 flex-shrink-0"
                style={{ background: 'radial-gradient(circle at 30% 30%, #c084fc, #6d28d9)' }}>
                <Bot size={14} className="text-white" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex items-center gap-2">
                  <Loader2 size={14} className="text-purple-500 animate-spin" />
                  <span className="text-xs text-gray-500">Nori is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggested prompts */}
        {messages.length <= 1 && (
          <div className="px-4 pb-3">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Suggested prompts</p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((sp, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(sp.prompt)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20
                    text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full
                    border border-purple-200 dark:border-purple-800
                    hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
                >
                  {sp.icon}
                  {sp.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Nori about your students..."
              className="flex-1 h-10 px-4 bg-gray-100 dark:bg-gray-700 border-none rounded-full
                text-sm text-gray-900 dark:text-white placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isThinking}
              className="w-10 h-10 flex items-center justify-center rounded-full
                bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-600
                text-white transition-colors flex-shrink-0"
            >
              {isThinking ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-2">
            Nori uses demo data only. In the full version, responses are powered by AI analysis of your actual student data.
          </p>
        </div>
      </div>
    </div>
  )
}
