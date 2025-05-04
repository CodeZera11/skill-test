import currency from '@/lib/currency'
import { format } from 'date-fns'

export const chartDateFormatter = (date: string) => {
  if (isISODateString(date)) {
    const temp = new Date(date)
    return format(temp, 'd MMM yyyy')
  }
  return date
}

export const chartCurrencyFormatter = (val: number) => {
  return currency.format(val) ?? ''
}

export type ChartData = {
  [ key: string ]: string | number | Date
}

export type ChartProps = {
  chartData: ChartData[]
  className?: string
  xAxisDataKey: string
  yAxisDataKey: string
  lineName?: string
}

export const isISODateString = (input: string) => {
  const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[\+\-]\d{2}:\d{2})?$/
  return isoDatePattern.test(input)
}
