"use client"

import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock } from "lucide-react"
import { TestAttemptWithDetails } from "~/convex/testAttempts"

interface TestTimerProps {
  durationInMinutes: number
  onTimeUp: () => void
  testAttempt: TestAttemptWithDetails
}

export function TestTimer({ durationInMinutes, onTimeUp, testAttempt }: TestTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(durationInMinutes * 60)
  const startTimeRef = useRef(Date.now())
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const totalDurationInSeconds = durationInMinutes * 60

  useEffect(() => {
    const remainingTimeInSeconds = totalDurationInSeconds
    setTimeRemaining(remainingTimeInSeconds)
  }, [totalDurationInSeconds])

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      const remainingTimeInSeconds = totalDurationInSeconds - elapsed

      if (remainingTimeInSeconds <= 0) {
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
        setTimeRemaining(0)
        onTimeUp()
      } else {
        setTimeRemaining(remainingTimeInSeconds)
      }
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [totalDurationInSeconds, onTimeUp])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const progressPercentage = (timeRemaining / totalDurationInSeconds) * 100

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="h-5 w-5" />
        <span className="font-medium">Time Remaining</span>
      </div>
      <div className="text-2xl font-bold mb-2">{formatTime(timeRemaining)}</div>
      <Progress value={progressPercentage} className="h-2" />
    </Card>
  )
}
