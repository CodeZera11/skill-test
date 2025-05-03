"use client"

import {
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { motion } from "framer-motion"

interface RadarChartProps {
  data: Array<{
    subject: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }>
  radars: Array<{
    dataKey: string
    color: string
    name?: string
  }>
  title?: string
  animationDuration?: number
}

export function RadarChart({ data, radars, title, animationDuration = 1000 }: RadarChartProps) {
  return (
    <motion.div
      className="w-full h-[300px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {title && <h3 className="text-lg font-medium text-center mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--foreground)" }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "var(--foreground)" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--background)",
              borderColor: "var(--border)",
              borderRadius: "0.5rem",
            }}
          />
          {radars.map((radar, index) => (
            <Radar
              key={radar.dataKey}
              name={radar.name || radar.dataKey}
              dataKey={radar.dataKey}
              stroke={radar.color}
              fill={radar.color}
              fillOpacity={0.6}
              animationDuration={animationDuration}
              animationBegin={index * 300}
            />
          ))}
          <Legend />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
