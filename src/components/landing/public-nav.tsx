"use client"

import { Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../ui/button"
import { ModeToggle } from "../theme-switcher"
import { SignedIn, SignedOut } from "@clerk/nextjs"
import ClerkUserButton from "../auth/user-button"
import GlobalSearch from "../global-search"

const PublicNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-white/40 backdrop-blur-lg dark:bg-background/40">
      <div className="container mx-auto flex items-center gap-6 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-0 shrink-0">
          <Image
            src="/logo.png"
            alt="SkillTest logo"
            width={72}
            height={72}
            priority
          />
          <div className="flex flex-col -ml-1">
            <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-xl font-bold text-transparent">
              SkillTest
            </span>
            <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-xs font-light italic text-transparent -mt-1">
              Let&apos;s Practice together
            </span>
          </div>
        </Link>

        {/* Global Search (desktop only for now) */}
        <div className="hidden md:flex flex-1 justify-center">
          <GlobalSearch />
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden ml-auto"
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop nav right */}
        <nav className="hidden md:flex items-center gap-6 shrink-0">
          <Link href="/" className="text-sm font-medium hover:text-theme">
            Home
          </Link>
          <Link href="/topics" className="text-sm font-medium hover:text-theme">
            Topics
          </Link>
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

      {/* Mobile nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t"
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
