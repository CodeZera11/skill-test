"use client"

import { Skeleton } from "@/components/ui/skeleton"

interface TableSkeletonProps {
  columnCount?: number
  rowCount?: number
}

export const TableSkeleton = ({
  columnCount = 5,
  rowCount = 5,
}: TableSkeletonProps) => {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-[70px]" />
        </div>
        <Skeleton className="h-8 w-[250px]" />
      </div>
      <div className="rounded-md border">
        <div className="border-b">
          <div className="grid grid-cols-5 gap-4 p-4">
            {Array.from({ length: columnCount }).map((_, i) => (
              <Skeleton key={i} className="h-6" />
            ))}
          </div>
        </div>
        <div className="divide-y">
          {Array.from({ length: rowCount }).map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4 p-4">
              {Array.from({ length: columnCount }).map((_, j) => (
                <Skeleton key={j} className="h-6" />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-8 w-[100px]" />
      </div>
    </div>
  )
}
