'use client'

import { cn } from '@/lib/utils'
import { CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis, BarChart, Bar } from 'recharts'
import { chartCurrencyFormatter, chartDateFormatter, ChartProps } from './chart-utils'

const BarChartComp = ({ chartData, className, xAxisDataKey, yAxisDataKey }: ChartProps) => {
  return (
    <ResponsiveContainer width='100%' height="100%">
      <BarChart data={chartData} className={cn('w-full h-full m-0 p-0', className)}>
        <CartesianGrid strokeDasharray="12" />
        <XAxis
          dataKey={xAxisDataKey}
          tickFormatter={chartDateFormatter}
          className='text-[10px]'
          axisLine={false}
        />
        <YAxis dataKey={yAxisDataKey} tickFormatter={chartCurrencyFormatter} className='text-[10px]' axisLine={false} >

        </YAxis>
        <Legend />
        {/* <ChartToolTip content={<CustomTooltip />} /> */}
        <Bar dataKey={yAxisDataKey} fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default BarChartComp