import { useState, useEffect, useRef } from 'react'
import { Bot, Send } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

const USER_MESSAGE =
  "I'm meeting with Maya Rodriguez's parents tomorrow. Can you give me a quick summary?"

const NORI_RESPONSE =
  "Maya is a 4th grader in Mr. Thompson's class. Her math is strong — iReady Math: 512, On Grade Level — but reading has declined across three windows: 458 → 438 → 415, now Below Grade Level. Attendance is at 87.4% with 16 absences. I'd suggest focusing on a reading intervention plan and following up on the attendance trend."

type Phase = 'idle' | 'user-typing' | 'user-done' | 'thinking' | 'nori-typing' | 'done'

export default function NoriShowcase() {
  const { ref, isVisible } = useScrollAnimation()
  const [phase, setPhase] = useState<Phase>('idle')
  const [userChars, setUserChars] = useState(0)
  const [noriChars, setNoriChars] = useState(0)
  const hasStarted = useRef(false)

  // Start animation when scrolled into view
  useEffect(() => {
    if (isVisible && !hasStarted.current) {
      hasStarted.current = true
      setTimeout(() => setPhase('user-typing'), 600)
    }
  }, [isVisible])

  // Phase transitions
  useEffect(() => {
    if (phase === 'user-done') {
      const t = setTimeout(() => setPhase('thinking'), 800)
      return () => clearTimeout(t)
    }
    if (phase === 'thinking') {
      const t = setTimeout(() => setPhase('nori-typing'), 2000)
      return () => clearTimeout(t)
    }
  }, [phase])

  // User typing animation
  useEffect(() => {
    if (phase !== 'user-typing') return
    if (userChars >= USER_MESSAGE.length) {
      setPhase('user-done')
      return
    }
    const t = setTimeout(() => setUserChars((c) => c + 1), 12)
    return () => clearTimeout(t)
  }, [phase, userChars])

  // Nori typing animation
  useEffect(() => {
    if (phase !== 'nori-typing') return
    if (noriChars >= NORI_RESPONSE.length) {
      setPhase('done')
      return
    }
    const t = setTimeout(() => setNoriChars((c) => c + 1), 18)
    return () => clearTimeout(t)
  }, [phase, noriChars])

  const showUser = phase !== 'idle'
  const showThinking = phase === 'thinking'
  const showNori = phase === 'nori-typing' || phase === 'done'

  return (
    <section className="py-24 bg-white dark:bg-gray-950 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl" />

      <div
        ref={ref}
        className={`section-container relative z-10 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-gray-900 dark:text-white mb-4">
            Meet <span className="gradient-text">Nori</span>, your data copilot
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Ask questions in plain English. Get instant, FERPA-compliant answers
            from all of your student data.
          </p>
        </div>

        {/* Chat card */}
        <div className="max-w-2xl mx-auto">
          <div className="backdrop-blur-md bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Chat header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Nori
                </p>
                <p className="text-xs text-green-500">Online</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 font-semibold ml-auto">
                AI Assistant
              </span>
            </div>

            {/* Messages area */}
            <div className="px-6 py-6 space-y-4 min-h-[220px]">
              {/* User message */}
              {showUser && (
                <div className="flex justify-end">
                  <div className="bg-wasabi-green text-white rounded-2xl rounded-br-md px-4 py-3 max-w-[85%]">
                    <p className="text-sm leading-relaxed">
                      {USER_MESSAGE.slice(0, userChars)}
                      {phase === 'user-typing' && (
                        <span className="inline-block w-0.5 h-4 bg-white/80 ml-0.5 animate-pulse align-middle" />
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Thinking indicator */}
              {showThinking && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      />
                      <span
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      />
                      <span
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Nori response */}
              {showNori && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%]">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {NORI_RESPONSE.slice(0, noriChars)}
                      {phase === 'nori-typing' && (
                        <span className="inline-block w-0.5 h-4 bg-purple-500 ml-0.5 animate-pulse align-middle" />
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Input bar (decorative) */}
            <div className="px-6 pb-5">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                <span className="text-sm text-gray-400 flex-1">
                  Ask Nori anything about your students...
                </span>
                <Send className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Feature bullets below the card */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto text-center">
          {[
            { title: 'Natural Language', desc: 'Ask in plain English — no queries or filters needed' },
            { title: 'FERPA-Compliant', desc: 'Your data never leaves your school\'s environment' },
            { title: 'Instant Reports', desc: 'Generate exportable summaries in seconds' },
          ].map((item) => (
            <div key={item.title}>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                {item.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
