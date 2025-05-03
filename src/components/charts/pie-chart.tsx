"use client"

import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { motion } from "framer-motion"

interface PieChartProps {
  data: Array<{
    name: string
    value: number
    color: string
  }>
  title?: string
  innerRadius?: number
  outerRadius?: number
  animationDuration?: number
}

export function PieChart({ data, title, innerRadius = 60, outerRadius = 80, animationDuration = 1000 }: PieChartProps) {
  return (
    <motion.div
      className="w-full h-[300px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {title && <h3 className="text-lg font-medium text-center mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            fill="#8884d8"
            dataKey="value"
            animationDuration={animationDuration}
            animationBegin={0}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [value, name]}
            contentStyle={{
              backgroundColor: "var(--background)",
              borderColor: "var(--border)",
              borderRadius: "0.5rem",
            }}
          />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
