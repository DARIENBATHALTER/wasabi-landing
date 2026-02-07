import type { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
}

export default function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div className={`backdrop-blur-md bg-white/80 dark:bg-gray-800/80 shadow-lg rounded-xl border border-gray-200/50 dark:border-gray-700/50 ${className}`}>
      {children}
    </div>
  )
}
