"use client"

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { motion } from "framer-motion"

interface LineChartProps {
  data: Array<{
    name: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }>
  lines: Array<{
    dataKey: string
    color: string
    name?: string
  }>
  title?: string
  xAxisLabel?: string
  yAxisLabel?: string
  animationDuration?: number
}

export function LineChart({ data, lines, title, xAxisLabel, yAxisLabel, animationDuration = 1000 }: LineChartProps) {
  return (
    <motion.div
      className="w-full h-[300px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {title && <h3 className="text-lg font-medium text-center mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="name"
            label={xAxisLabel ? { value: xAxisLabel, position: "insideBottom", offset: -5 } : undefined}
            tick={{ fill: "var(--foreground)" }}
          />
          <YAxis
            label={
              yAxisLabel
                ? { value: yAxisLabel, angle: -90, position: "insideLeft", style: { textAnchor: "middle" } }
                : undefined
            }
            tick={{ fill: "var(--foreground)" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--background)",
              borderColor: "var(--border)",
              borderRadius: "0.5rem",
            }}
          />
          <Legend />
          {lines.map((line, index) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name || line.dataKey}
              stroke={line.color}
              activeDot={{ r: 8 }}
              animationDuration={animationDuration}
              animationBegin={index * 300}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
