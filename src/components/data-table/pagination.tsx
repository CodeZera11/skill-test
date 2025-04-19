"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

interface PaginationProps {
  currentPage: number
  pageCount: number
  isLoading?: boolean
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
}

export function Pagination({ 
  currentPage, 
  pageCount, 
  isLoading,
  onPageChange,
  onPageSizeChange
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between gap-4 mt-4">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange?.(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {pageCount}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange?.(currentPage + 1)}
          disabled={currentPage >= pageCount || isLoading}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <Select
        value={String(10)}
        onValueChange={(value) => onPageSizeChange?.(Number(value))}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Page size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10 / page</SelectItem>
          <SelectItem value="20">20 / page</SelectItem>
          <SelectItem value="50">50 / page</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
