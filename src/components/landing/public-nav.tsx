"use client"
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { ModeToggle } from '../theme-switcher'
import { motion } from "framer-motion"
import { Button } from '../ui/button'
import { Authenticated, Unauthenticated } from 'convex/react'
import ClerkUserButton from '../auth/user-button'
import Image from 'next/image'

const PublicNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b sticky top-0 bg-white/40 dark:bg-background/40 backdrop-blur-lg z-50">
      <div className="container mx-auto px-4 py-0 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-0">
          <Image src="/logo.png" alt='main-logo' className='object-fill' width={75} height={75} />
          <span
            className="text-xl font-bold -ml-2 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent"
          >
            SkillTest
          </span>
        </Link>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-sm font-medium hover:text-theme transition-colors">
            Home
          </Link>
          <Link href="/topics" className="text-sm font-medium hover:text-theme transition-colors">
            Topics
          </Link>
          {/* <Link href="#how-it-works" className="text-sm font-medium hover:text-theme transition-colors">
            How It Works
          </Link> */}
          <Link href="/#testimonials" className="text-sm font-medium hover:text-theme transition-colors">
            Testimonials
          </Link>
          <ModeToggle />

          <Unauthenticated>
            <div className='flex items-center gap-2'
            >
              <Button asChild>
                <Link href="/sign-in">
                  Login
                </Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">
                  Signup
                </Link>
              </Button>
            </div>
          </Unauthenticated>
          <Authenticated>
            <ClerkUserButton />
          </Authenticated>
        </nav>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden border-t"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link
              href="/categories"
              className="text-sm font-medium hover:text-emerald-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:text-emerald-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium hover:text-emerald-500 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </Link>
            <div className="flex items-center">
              <ModeToggle />
            </div>
            <Unauthenticated>
              <Button onClick={() => setIsMenuOpen(false)} asChild>
                <Link href="/sign-up">
                  Get Started
                </Link>
              </Button>
            </Unauthenticated>
            <Authenticated>
              <ClerkUserButton />
            </Authenticated>
          </div>
        </motion.div>
      )}
    </header>
  )
}

export default PublicNav