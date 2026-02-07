import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface AssessmentDataPoint {
  name: string
  score: number
  benchmark?: number
}

interface AssessmentTrendChartProps {
  data: AssessmentDataPoint[]
  title?: string
  height?: number
  color?: string
}

export default function AssessmentTrendChart({ data, title, height = 200, color = '#008800' }: AssessmentTrendChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
          <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} style={{ color: p.color }} className="text-sm">
              {p.name}: {p.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const hasBenchmark = data.some(d => d.benchmark !== undefined)

  return (
    <div className="w-full">
      {title && <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{title}</h4>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
          <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
          <YAxis stroke="#6b7280" fontSize={11} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="score"
            name="Score"
            stroke={color}
            strokeWidth={2.5}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
          {hasBenchmark && (
            <Line
              type="monotone"
              dataKey="benchmark"
              name="Benchmark"
              stroke="#9ca3af"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              dot={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
