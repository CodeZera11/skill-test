"use client"

import { CheckCircle, ChevronRight } from 'lucide-react'
import { motion } from "motion/react"
import Link from 'next/link'
import { Button } from '../ui/button'

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <CheckCircle className="h-8 w-8 text-emerald-400" />
              <span className="font-bold text-2xl">Skill Test</span>
            </div>
            <p className="text-slate-400 mb-6 max-w-md">
              Your ultimate platform for competitive exam preparation and practice. We help aspirants master subjects
              through structured learning paths and comprehensive practice tests.
            </p>
            <div className="flex space-x-4">
              {[
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-facebook"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  ),
                  label: "Facebook",
                },
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-twitter"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                    </svg>
                  ),
                  label: "Twitter",
                },
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-instagram"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  ),
                  label: "Instagram",
                },
                {
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-linkedin"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  ),
                  label: "LinkedIn",
                },
              ].map((social, idx) => (
                <motion.a
                  key={idx}
                  href="#"
                  className="bg-slate-800 hover:bg-emerald-500 p-2 rounded-full transition-colors"
                  aria-label={social.label}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 border-b border-slate-700 pb-2">Quick Links</h3>
            <ul className="space-y-3">
              {["Home", "About Us", "Pricing", "Contact", "FAQ"].map((item, idx) => (
                <motion.li key={idx} whileHover={{ x: 3, transition: { duration: 0.2 } }}>
                  <Link
                    href="#"
                    className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center"
                  >
                    <ChevronRight className="h-4 w-4 mr-2" />
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 border-b border-slate-700 pb-2">Categories</h3>
            <ul className="space-y-3">
              {["Clerk Exam", "SSC Exams", "Banking Exams", "Railway Exams", "Teaching Exams"].map((item, idx) => (
                <motion.li key={idx} whileHover={{ x: 3, transition: { duration: 0.2 } }}>
                  <Link
                    href="#"
                    className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center"
                  >
                    <ChevronRight className="h-4 w-4 mr-2" />
                    {item}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 border-b border-slate-700 pb-2">Newsletter</h3>
            <p className="text-slate-400 mb-4">Stay updated with new tests and features</p>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-emerald-500 text-white"
                />
              </div>
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600">Subscribe</Button>
              <p className="text-xs text-slate-500 mt-2">
                By subscribing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Skill Test. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="#" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer