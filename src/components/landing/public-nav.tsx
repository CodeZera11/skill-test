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

const PublicNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-white/40 backdrop-blur-lg dark:bg-background/40">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/logo.png"
            alt="SkillTest logo"
            width={72}
            height={72}
            priority
          />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-xl font-bold text-transparent">
            SkillTest
          </span>
        </Link>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-theme">
            Home
          </Link>
          <Link href="/topics" className="text-sm font-medium hover:text-theme">
            Topics
          </Link>
          <Link
            href="/#testimonials"
            className="text-sm font-medium hover:text-theme"
          >
            Testimonials
          </Link>

          <ModeToggle />

          {/* SIGNED OUT */}
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

          {/* SIGNED IN */}
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
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium"
              >
                Home
              </Link>
              <Link
                href="/topics"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium"
              >
                Topics
              </Link>
              <Link
                href="/#testimonials"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium"
              >
                Testimonials
              </Link>

              <ModeToggle />

              {/* SIGNED OUT */}
              <SignedOut>
                <Button asChild onClick={() => setIsMenuOpen(false)}>
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </SignedOut>

              {/* SIGNED IN */}
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
