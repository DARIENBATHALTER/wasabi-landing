import { useState, useRef, useEffect } from 'react'
import { Bot, X, Send, Loader2 } from 'lucide-react'
import { students } from '../data/students'
import { getStudentAttendanceRate } from '../data/attendance'
import { getStudentGPA } from '../data/grades'
import { getAllFlaggedStudents } from '../data/flags'

interface ChatMessage {
  id: string
  sender: 'user' | 'nori'
  text: string
  timestamp: Date
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

export default function MockupNoriBubble() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'nori',
      text: "Hi! I'm Nori, your AI teaching assistant. Ask me about student data, class trends, or who needs support.\n\nTry: \"Who needs help?\" or \"How is Jordan doing?\"",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200)
    }
  }, [isOpen])

  const generateResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase().trim()

    // Check for help/risk/flag keywords
    if (msg.includes('help') || msg.includes('risk') || msg.includes('flag') || msg.includes('concern') || msg.includes('support') || msg.includes('struggling')) {
      const flagged = getAllFlaggedStudents().slice(0, 4)
      if (flagged.length === 0) return "All students appear to be on track! No flags have been triggered."

      let response = "Here are the students who may need additional support:\n\n"
      for (const { student, flags } of flagged) {
        const concerns = flags.map(f => f.message).join(', ')
        response += `- **${student.firstName} ${student.lastName}** (Grade ${student.grade}): ${concerns}\n`
      }
      response += "\nClick on any student name in the search results to view their full profile."
      return response
    }

    // Check for student name
    const matchedStudent = students.find(s =>
      msg.includes(s.firstName.toLowerCase()) || msg.includes(s.lastName.toLowerCase())
    )
    if (matchedStudent) {
      const attendance = getStudentAttendanceRate(matchedStudent.id)
      const gpa = getStudentGPA(matchedStudent.id)
      const attendanceNote = attendance >= 95 ? 'excellent' : attendance >= 90 ? 'adequate' : 'concerning'
      const gpaNote = gpa >= 3.0 ? 'strong' : gpa >= 2.0 ? 'average' : 'below expectations'

      return `Here's a quick summary for **${matchedStudent.firstName} ${matchedStudent.lastName}** (Grade ${matchedStudent.grade}, ${matchedStudent.homeroom}):\n\n` +
        `- Attendance: **${attendance}%** (${attendanceNote})\n` +
        `- GPA: **${gpa.toFixed(2)}** (${gpaNote})\n` +
        `- Homeroom: ${matchedStudent.homeroom}\n\n` +
        `Search for "${matchedStudent.firstName}" in the search bar to view their complete profile.`
    }

    // Check for class/trend/analytics keywords
    if (msg.includes('class') || msg.includes('trend') || msg.includes('analytic') || msg.includes('overview') || msg.includes('summary')) {
      const totalStudents = students.length
      const avgAttendance = students.reduce((sum, s) => sum + getStudentAttendanceRate(s.id), 0) / totalStudents
      const avgGPA = students.reduce((sum, s) => sum + getStudentGPA(s.id), 0) / totalStudents
      const flagged = getAllFlaggedStudents().length

      return `Here's a schoolwide overview of our ${totalStudents} demo students:\n\n` +
        `- Average Attendance: **${avgAttendance.toFixed(1)}%**\n` +
        `- Average GPA: **${avgGPA.toFixed(2)}**\n` +
        `- Flagged Students: **${flagged}** need attention\n\n` +
        `Visit the Class Analytics page from the sidebar for detailed charts and breakdowns by homeroom.`
    }

    // Check for greeting
    if (msg.includes('hello') || msg.includes('hi') || msg === 'hey' || msg.includes('good morning') || msg.includes('good afternoon')) {
      return "Hello! I'm here to help you make sense of your student data. You can ask me about:\n\n" +
        "- Specific students (e.g., \"How is Alex doing?\")\n" +
        "- At-risk students (e.g., \"Who needs help?\")\n" +
        "- Class trends (e.g., \"Show me a class overview\")"
    }

    // Default
    return "I can help you analyze student data! Try asking about:\n\n" +
      "- **Specific students**: \"How is Jordan doing?\"\n" +
      "- **At-risk students**: \"Who needs help?\"\n" +
      "- **Class trends**: \"Show me class analytics\"\n\n" +
      "I have access to attendance, grades, assessments, and behavioral data for all 30 demo students."
  }

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed || isThinking) return

    // Add user message
    const userMsg: ChatMessage = {
      id: generateId(),
      sender: 'user',
      text: trimmed,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsThinking(true)

    // Simulate thinking delay
    setTimeout(() => {
      const responseText = generateResponse(trimmed)
      const noriMsg: ChatMessage = {
        id: generateId(),
        sender: 'nori',
        text: responseText,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, noriMsg])
      setIsThinking(false)
    }, 800 + Math.random() * 700)
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
    <>
      {/* Chat window */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-4 sm:right-6 z-50 w-80 h-96
            bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700
            flex flex-col overflow-hidden animate-slide-in-right"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-violet-600 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">Nori</p>
              <p className="text-[10px] text-purple-200">AI Assistant</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap
                    ${msg.sender === 'user'
                      ? 'bg-wasabi-green text-white rounded-br-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-md'
                    }`}
                >
                  {renderText(msg.text)}
                </div>
              </div>
            ))}

            {/* Thinking indicator */}
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2.5 rounded-2xl rounded-bl-md">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-3 py-2.5 flex-shrink-0">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Nori anything..."
                className="flex-1 h-9 px-3 bg-gray-100 dark:bg-gray-700 border-none rounded-full
                  text-sm text-gray-900 dark:text-white placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isThinking}
                className="w-9 h-9 flex items-center justify-center rounded-full
                  bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-600
                  text-white transition-colors flex-shrink-0"
              >
                {isThinking ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating bubble */}
      <button
        data-tour="nori"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed bottom-4 right-4 sm:right-6 z-50
          w-14 h-14 rounded-full
          flex items-center justify-center
          shadow-xl hover:shadow-2xl
          transition-all duration-300 ease-out
          hover:scale-110
          ${isOpen ? 'rotate-0' : 'animate-pulse-soft'}
        `}
        style={{
          background: 'radial-gradient(circle at 30% 30%, #c084fc, #6d28d9)',
        }}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <Bot size={24} className="text-white" />
        )}

        {/* Notification dot when closed */}
        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
            <span className="text-[8px] text-white font-bold">1</span>
          </span>
        )}
      </button>
    </>
  )
}
