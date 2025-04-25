"use client"

import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock } from "lucide-react"

interface TestTimerProps {
  durationInMinutes: number
  onTimeUp: () => void
}

export function TestTimer({ durationInMinutes, onTimeUp }: TestTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(durationInMinutes * 60)
  const startTimeRef = useRef(Date.now())
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const totalTime = durationInMinutes * 60

  // Load saved time from localStorage if available
  useEffect(() => {
    const savedStartTime = localStorage.getItem("test_start_time")
    if (savedStartTime) {
      startTimeRef.current = Number.parseInt(savedStartTime)
    } else {
      // If no saved time, set current time as start time
      startTimeRef.current = Date.now()
      localStorage.setItem("test_start_time", startTimeRef.current.toString())
    }

    // Calculate initial time remaining
    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
    const remaining = Math.max(0, totalTime - elapsed)
    setTimeRemaining(remaining)
  }, [totalTime])

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    // Set up the timer
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      const remaining = totalTime - elapsed

      if (remaining <= 0) {
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
        setTimeRemaining(0)
        onTimeUp()
      } else {
        setTimeRemaining(remaining)
      }
    }, 1000)

    // Clean up on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [totalTime, onTimeUp])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const progressPercentage = (timeRemaining / totalTime) * 100

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
