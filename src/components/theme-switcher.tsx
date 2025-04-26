"use client"

import { motion } from "motion/react"
import { useTheme } from "next-themes"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <motion.button
      className="relative h-10 w-10 rounded-full bg-transparent flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      onClick={toggleTheme}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={isDark ? "dark" : "light"}
        initial={false}
        className="absolute"
        variants={{
          light: {
            rotate: 0,
            opacity: 1,
            scale: 1,
          },
          dark: {
            rotate: 180,
            opacity: 0,
            scale: 0.5,
          },
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <circle cx="12" cy="12" r="5" />
        <motion.line
          x1="12"
          y1="1"
          x2="12"
          y2="3"
          variants={{
            light: { opacity: 1 },
            dark: { opacity: 0 },
          }}
        />
        <motion.line
          x1="12"
          y1="21"
          x2="12"
          y2="23"
          variants={{
            light: { opacity: 1 },
            dark: { opacity: 0 },
          }}
        />
        <motion.line
          x1="4.22"
          y1="4.22"
          x2="5.64"
          y2="5.64"
          variants={{
            light: { opacity: 1 },
            dark: { opacity: 0 },
          }}
        />
        <motion.line
          x1="18.36"
          y1="18.36"
          x2="19.78"
          y2="19.78"
          variants={{
            light: { opacity: 1 },
            dark: { opacity: 0 },
          }}
        />
        <motion.line
          x1="1"
          y1="12"
          x2="3"
          y2="12"
          variants={{
            light: { opacity: 1 },
            dark: { opacity: 0 },
          }}
        />
        <motion.line
          x1="21"
          y1="12"
          x2="23"
          y2="12"
          variants={{
            light: { opacity: 1 },
            dark: { opacity: 0 },
          }}
        />
        <motion.line
          x1="4.22"
          y1="19.78"
          x2="5.64"
          y2="18.36"
          variants={{
            light: { opacity: 1 },
            dark: { opacity: 0 },
          }}
        />
        <motion.line
          x1="18.36"
          y1="5.64"
          x2="19.78"
          y2="4.22"
          variants={{
            light: { opacity: 1 },
            dark: { opacity: 0 },
          }}
        />
      </motion.svg>

      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={isDark ? "dark" : "light"}
        initial={false}
        className="absolute"
        variants={{
          light: {
            rotate: -180,
            opacity: 0,
            scale: 0.5,
          },
          dark: {
            rotate: 0,
            opacity: 1,
            scale: 1,
          },
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </motion.svg>
    </motion.button>
  )
}

