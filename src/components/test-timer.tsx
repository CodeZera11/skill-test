"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Clock } from "lucide-react"
import { TestAttemptWithDetails } from "~/convex/testAttempts"

interface TestTimerProps {
  durationInMinutes: number
  onTimeUp: () => void
  testAttempt: TestAttemptWithDetails
}

export function TestTimer({ durationInMinutes, onTimeUp, testAttempt }: TestTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(0)
  const totalDurationInSeconds = durationInMinutes * 60
  const startTime = new Date(testAttempt.testAttempt.startTime).getTime()
  const endTime = startTime + totalDurationInSeconds * 1000

  useEffect(() => {
    const calculateRemainingTime = () => {
      const currentTime = Date.now()
      const remainingTimeInSeconds = Math.floor((endTime - currentTime) / 1000)

      if (remainingTimeInSeconds <= 0) {
        setTimeRemaining(0)
        onTimeUp()
      } else {
        setTimeRemaining(remainingTimeInSeconds)
      }
    }

    calculateRemainingTime()

    const timer = setInterval(() => {
      calculateRemainingTime()
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime, onTimeUp])

  // const formatTime = (seconds: number) => {
  //   const duration = intervalToDuration({ start: 0, end: seconds * 1000 })
  //   return formatDuration(duration, { format: ["hours", "minutes", "seconds"], zero: true })
  // }
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const progressPercentage = (timeRemaining / totalDurationInSeconds) * 100

  return (
    <div className="p-4 space-y-2 border rounded-md">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5" />
        <span className="font-medium">Time Remaining</span>
      </div>
      <div className="text-2xl font-bold text-center">{formatTime(timeRemaining)}</div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  )
}
