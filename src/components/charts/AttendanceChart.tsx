import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface AttendanceDataPoint {
  name: string
  attendanceRate: number
}

interface AttendanceChartProps {
  data: AttendanceDataPoint[]
  title?: string
  height?: number
}

export default function AttendanceChart({ data, title, height = 250 }: AttendanceChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
          <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
          <p className="text-wasabi-green">Rate: {payload[0].value.toFixed(1)}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full">
      {title && <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{title}</h4>}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="attendanceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#008800" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#008800" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
          <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
          <YAxis stroke="#6b7280" fontSize={11} tickFormatter={(v) => `${v}%`} domain={[70, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="attendanceRate" stroke="#008800" strokeWidth={2} fill="url(#attendanceGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
