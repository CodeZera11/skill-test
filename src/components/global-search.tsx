"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "~/convex/_generated/api"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type SearchResult = {
  id: string
  name: string
  type: "topic" | "category" | "subCategory" | "test"
}

const SEARCH_LIMIT = 5
const DEBOUNCE_MS = 250

const GlobalSearch = () => {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  // 🔁 debounce input
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(query.trim())
    }, DEBOUNCE_MS)

    return () => clearTimeout(t)
  }, [query])

  // 🔎 Convex search
  const results = useQuery(
    api.search.globalSearch,
    debouncedQuery
      ? { searchText: debouncedQuery, limit: SEARCH_LIMIT }
      : "skip"
  )

  const isLoading = debouncedQuery.length > 0 && results === undefined
  const hasResults = results && results.length > 0

  // ⌨️ keyboard navigation
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        inputRef.current?.blur()
        return
      }

      if (!results || !results.length) return

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setActiveIndex((i) => (i + 1) % results.length)
      }

      if (e.key === "ArrowUp") {
        e.preventDefault()
        setActiveIndex((i) => (i - 1 + results.length) % results.length)
      }

      if (e.key === "Enter") {
        e.preventDefault()
        handleSelect(results[activeIndex])
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, results, activeIndex])

  // 🖱️ click outside closes search
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    window.addEventListener("mousedown", handler)
    return () => window.removeEventListener("mousedown", handler)
  }, [])

  const handleSelect = (item: SearchResult) => {
    setOpen(false)
    setQuery("")

    switch (item.type) {
      case "topic":
        router.push(`/topics/${item.id}`)
        break
      case "category":
        router.push(`/categories/${item.id}`)
        break
      case "subCategory":
        router.push(`/sub-categories/${item.id}`)
        break
      case "test":
        router.push(`/tests/${item.id}`)
        break
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      {/* Input */}
      <div
        className={cn(
          "flex items-center gap-2 rounded-full border bg-background px-3 py-1 transition",
          open && "ring-2 ring-sky-400"
        )}
      >
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            setActiveIndex(0)
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search topics, categories, tests…"
          className="h-8 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      {/* Dropdown */}
      {open && query && (
        <div className="absolute top-full z-50 mt-2 w-full rounded-lg border bg-background shadow-lg">
          {/* Loading */}
          {isLoading && (
            <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching…
            </div>
          )}

          {/* No results */}
          {!isLoading && results && results.length === 0 && (
            <div className="p-3 text-sm text-muted-foreground">
              No results found
            </div>
          )}

          {/* Results */}
          {!isLoading && hasResults && (
            <ul className="max-h-72 overflow-auto py-1">
              {results!.map((item, i) => (
                <li
                  key={`${item.type}-${item.id}`}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => handleSelect(item)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between px-3 py-2 text-sm",
                    i === activeIndex
                      ? "bg-sky-50 dark:bg-sky-900/30"
                      : "hover:bg-muted"
                  )}
                >
                  <span>{item.name}</span>
                  <span className="text-xs capitalize text-muted-foreground">
                    {labelForType(item.type)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default GlobalSearch

// ---- helpers ----

function labelForType(type: SearchResult["type"]) {
  switch (type) {
    case "topic":
      return "Topic"
    case "category":
      return "Category"
    case "subCategory":
      return "Sub-category"
    case "test":
      return "Test"
  }
}
