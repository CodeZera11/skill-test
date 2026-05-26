"use client"

import { Menu, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../ui/button"
import { ModeToggle } from "../theme-switcher"
import { SignedIn, SignedOut } from "@clerk/nextjs"
import ClerkUserButton from "../auth/user-button"
import GlobalSearch from "../global-search"
import LogoWithText from "../logo-with-text"
import { useQuery } from "convex/react"
import { api } from "~/convex/_generated/api"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { cn } from "@/lib/utils"

const PublicNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isTopicsOpen, setIsTopicsOpen] = useState(false)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const router = useRouter()

  const topics = useQuery(api.topics.list, {
    onlyPublished: true,
  })

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  const openTopicsMenu = () => {
    clearCloseTimeout()
    setIsTopicsOpen(true)
  }

  const scheduleCloseTopicsMenu = () => {
    clearCloseTimeout()
    closeTimeoutRef.current = setTimeout(() => {
      setIsTopicsOpen(false)
    }, 120)
  }

  useEffect(() => {
    return () => {
      clearCloseTimeout()
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b bg-white/40 backdrop-blur-lg dark:bg-background/40">
      <div className="container mx-auto flex items-center gap-6 px-4">
        <LogoWithText />

        <div className="hidden md:flex flex-1 justify-center">
          <GlobalSearch />
        </div>

        <button
          className="ml-auto md:hidden"
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <nav className="hidden shrink-0 items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium hover:text-theme">
            Home
          </Link>

          <DropdownMenu open={isTopicsOpen} onOpenChange={setIsTopicsOpen}>
            <DropdownMenuTrigger asChild>
              <Link
                href="/topics"
                className="text-sm font-medium hover:text-theme"
                onPointerEnter={openTopicsMenu}
                onPointerLeave={scheduleCloseTopicsMenu}
              >
                Topics
              </Link>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              sideOffset={12}
              className="w-72 p-2"
              onPointerEnter={openTopicsMenu}
              onPointerLeave={scheduleCloseTopicsMenu}
            >
              {topics === undefined ? (
                <DropdownMenuItem disabled>Loading topics...</DropdownMenuItem>
              ) : topics.length === 0 ? (
                <DropdownMenuItem disabled>No topics available</DropdownMenuItem>
              ) : (
                topics.map((topic) => (
                  <DropdownMenuSub key={topic._id}>
                    <DropdownMenuSubTrigger
                      className="min-w-[16rem] gap-3 rounded-md"
                      onClick={(event) => {
                        event.preventDefault()
                        setIsTopicsOpen(false)
                        router.push(`/topics/${topic._id}`)
                      }}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        {topic.topicUrl ? (
                          <Image
                            src={topic.topicUrl}
                            alt={topic.name}
                            width={28}
                            height={28}
                            className="size-7 rounded-full object-cover"
                          />
                        ) : (
                          <div className="size-7 rounded-full bg-theme/15" />
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">
                            {topic.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {topic.categories.length} categor{topic.categories.length === 1 ? "y" : "ies"}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent
                        sideOffset={10}
                        className="max-h-80 w-72 overflow-y-auto p-2"
                      >
                        <DropdownMenuLabel className="px-2 pb-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          {topic.name}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {topic.categories.length === 0 ? (
                          <DropdownMenuItem disabled>
                            No categories available
                          </DropdownMenuItem>
                        ) : (
                          topic.categories.map((category) => (
                            <DropdownMenuItem
                              key={category._id}
                              className="rounded-md px-3 py-2"
                              onClick={() => {
                                setIsTopicsOpen(false)
                                router.push(`/categories/${category._id}`)
                              }}
                            >
                              <div className="flex min-w-0 flex-col">
                                <span className="truncate font-medium">
                                  {category.name}
                                </span>
                                {category.description ? (
                                  <span className="truncate text-xs text-muted-foreground">
                                    {category.description}
                                  </span>
                                ) : null}
                              </div>
                            </DropdownMenuItem>
                          ))
                        )}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                ))
              )}

              <DropdownMenuSeparator className="mt-1" />
              <DropdownMenuItem
                className={cn(
                  "cursor-pointer rounded-md px-3 py-2 font-medium text-theme focus:text-theme"
                )}
                onClick={() => {
                  setIsTopicsOpen(false)
                  router.push("/topics")
                }}
              >
                View all topics
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/#testimonials" className="text-sm font-medium hover:text-theme">
            Testimonials
          </Link>

          <ModeToggle />

          <SignedOut>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline">
                <Link href="/sign-in">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Signup</Link>
              </Button>
            </div>
          </SignedOut>

          <SignedIn>
            <ClerkUserButton />
          </SignedIn>
        </nav>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t md:hidden"
          >
            <div className="container mx-auto flex flex-col gap-4 px-4 py-4">
              <Link href="/" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link href="/topics" onClick={() => setIsMenuOpen(false)}>
                Topics
              </Link>
              <Link href="/#testimonials" onClick={() => setIsMenuOpen(false)}>
                Testimonials
              </Link>

              <ModeToggle />

              <SignedOut>
                <Button asChild onClick={() => setIsMenuOpen(false)}>
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </SignedOut>

              <SignedIn>
                <ClerkUserButton />
              </SignedIn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default PublicNav
