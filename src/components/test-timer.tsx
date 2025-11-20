"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Clock } from "lucide-react"

interface TestTimerProps {
  remainingTime: number
  onTimeUp: () => void
  updateRemainingTime: (time: number) => void
  label?: string
}

export function TestTimer({ remainingTime, onTimeUp, updateRemainingTime, label }: TestTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(remainingTime)

  useEffect(() => {

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onTimeUp()
          return 0
        }
        const newTime = prev - 1
        updateRemainingTime(newTime)
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer) // Cleanup timer on unmount
  }, [onTimeUp, updateRemainingTime])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const progressPercentage = (timeRemaining / remainingTime) * 100

  return (
    <div className="p-4 space-y-2 border rounded-md">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5" />
        <span className="font-medium">{label || "Time Remaining"}</span>
      </div>
      <div className="text-2xl font-bold text-center">{formatTime(timeRemaining)}</div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  )
}