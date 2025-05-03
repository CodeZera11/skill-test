"use client"

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { motion } from "framer-motion"

interface BarChartProps {
  data: Array<{
    name: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }>
  bars: Array<{
    dataKey: string
    color: string
    name?: string
  }>
  title?: string
  xAxisLabel?: string
  yAxisLabel?: string
  animationDuration?: number
}

export function BarChart({ data, bars, title, xAxisLabel, yAxisLabel, animationDuration = 1000 }: BarChartProps) {
  return (
    <motion.div
      className="w-full h-[300px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {title && <h3 className="text-lg font-medium text-center mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
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
          {bars.map((bar, index) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.name || bar.dataKey}
              fill={bar.color}
              animationDuration={animationDuration}
              animationBegin={index * 300}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
