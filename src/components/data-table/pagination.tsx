"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "../ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  isLoading?: boolean
}

export function Pagination({ currentPage, totalPages, isLoading }: PaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", page.toString())
    return `${pathname}?${params.toString()}`
  }

  return (
    <div className="flex items-center gap-4 mt-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push(createPageUrl(currentPage - 1))}
        disabled={currentPage <= 1 || isLoading}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => router.push(createPageUrl(currentPage + 1))}
        disabled={currentPage >= totalPages || isLoading}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
