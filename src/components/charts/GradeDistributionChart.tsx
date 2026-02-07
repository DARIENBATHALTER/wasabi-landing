import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface GradeDistributionData {
  grade: string
  count: number
}

interface GradeDistributionChartProps {
  data: GradeDistributionData[]
  title?: string
  height?: number
}

const GRADE_COLORS: Record<string, string> = {
  'A': '#22c55e',
  'B': '#84cc16',
  'C': '#f59e0b',
  'D': '#f97316',
  'F': '#ef4444',
}

export default function GradeDistributionChart({ data, title, height = 250 }: GradeDistributionChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
          <p className="font-medium text-gray-900 dark:text-gray-100">Grade {label}: {payload[0].value} students</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full">
      {title && <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{title}</h4>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
          <XAxis dataKey="grade" stroke="#6b7280" fontSize={12} />
          <YAxis stroke="#6b7280" fontSize={11} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={GRADE_COLORS[entry.grade] || '#6b7280'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
