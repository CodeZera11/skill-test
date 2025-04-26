"use client"

import { motion } from "motion/react"
import { Button } from "../ui/button"

const CtaSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="bg-emerald-500 text-white dark:bg-emerald-600 rounded-xl p-10 text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Ace Your Next Exam?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of aspirants who are mastering competitive exams and improving their scores with Skill
            Test
          </p>
          <Button
            size="lg"
            className="bg-white text-emerald-500 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            Get Started For Free
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

export default CtaSection