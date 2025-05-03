"use client"

import { useEffect, useState } from "react"
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
  // const [timeRemaining, setTimeRemaining] = useState(durationInMinutes * 60)



  // const startTimeRef = useRef(Date.now())
  // const timerRef = useRef<NodeJS.Timeout | null>(null)
  // const totalDurationInSeconds = durationInMinutes * 60
  // const startTime = testAttempt.testAttempt.startTime
  // const startTimeInSeconds = Math.floor(new Date(startTime).getTime() / 1000)
  // // const 

  // useEffect(() => {
  //   const remainingTimeInSeconds = totalDurationInSeconds - Math.floor((Date.now() - startTimeInSeconds * 1000) / 1000)

  //   if (remainingTimeInSeconds <= 0) {
  //     setTimeRemaining(0)
  //     onTimeUp()
  //     return
  //   }
  //   setTimeRemaining(remainingTimeInSeconds)
  // }, [totalDurationInSeconds, onTimeUp, startTimeInSeconds])

  // useEffect(() => {
  //   if (timerRef.current) {
  //     clearInterval(timerRef.current)
  //   }

  //   timerRef.current = setInterval(() => {
  //     const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
  //     const remainingTimeInSeconds = totalDurationInSeconds - elapsed

  //     if (remainingTimeInSeconds <= 0) {
  //       if (timerRef.current) {
  //         clearInterval(timerRef.current)
  //       }
  //       setTimeRemaining(0)
  //       onTimeUp()
  //     } else {
  //       setTimeRemaining(remainingTimeInSeconds)
  //     }
  //   }, 1000)

  //   return () => {
  //     if (timerRef.current) {
  //       clearInterval(timerRef.current)
  //     }
  //   }
  // }, [totalDurationInSeconds, onTimeUp])

  // const formatTime = (seconds: number) => {
  //   const hours = Math.floor(seconds / 3600)
  //   const minutes = Math.floor((seconds % 3600) / 60)
  //   const secs = seconds % 60

  //   return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  // }

  // const progressPercentage = (timeRemaining / totalDurationInSeconds) * 100

  // return (
  //   <Card className="p-4">
  //     <div className="flex items-center gap-2 mb-2">
  //       <Clock className="h-5 w-5" />
  //       <span className="font-medium">Time Remaining</span>
  //     </div>
  //     <div className="text-2xl font-bold mb-2">{formatTime(timeRemaining)}</div>
  //     <Progress value={progressPercentage} className="h-2" />
  //   </Card>
  // )

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
