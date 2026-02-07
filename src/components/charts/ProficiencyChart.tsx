import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface ProficiencyData {
  below: number
  approaching: number
  meets: number
  exceeds: number
}

interface ProficiencyChartProps {
  data: ProficiencyData
  title?: string
  height?: number
}

const COLORS = ['#ef4444', '#f59e0b', '#84cc16', '#22c55e']

export default function ProficiencyChart({ data, title, height = 250 }: ProficiencyChartProps) {
  const chartData = [
    { name: 'Below', value: data.below, color: COLORS[0] },
    { name: 'Approaching', value: data.approaching, color: COLORS[1] },
    { name: 'Meets', value: data.meets, color: COLORS[2] },
    { name: 'Exceeds', value: data.exceeds, color: COLORS[3] },
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
          <p className="font-medium text-gray-900 dark:text-gray-100">{label}: {payload[0].value} students</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full">
      {title && <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{title}</h4>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
          <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
          <YAxis stroke="#6b7280" fontSize={11} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
