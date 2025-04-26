"use client"

import { fadeIn } from '@/constants/animations'
import { Button } from '../ui/button'
import { motion } from 'motion/react'
import { CheckCircle, FileText, HelpCircle, Layers, ListChecks } from 'lucide-react'

const FlowVisualisationSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-emerald-50 dark:from-background dark:to-emerald-950/30">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Structured Learning Path</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Navigate through our hierarchical content organization for efficient exam preparation
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <motion.div
            className="relative"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Interactive structure visualization */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                {
                  level: "Categories",
                  description: "Main exam categories like Clerk Exam, SSC, Banking",
                  examples: ["Clerk Exam", "SSC Exams", "Banking Exams"],
                  icon: <FileText className="h-8 w-8" />,
                  color: "emerald",
                  count: "15+ Categories",
                },
                {
                  level: "Sub-Categories",
                  description: "Specific exam types within each category",
                  examples: ["Memory Based Papers", "Practice Papers", "Previous Year Papers"],
                  icon: <Layers className="h-8 w-8" />,
                  color: "teal",
                  count: "100+ Sub-Categories",
                },
                {
                  level: "Tests",
                  description: "Individual test papers for each sub-category",
                  examples: ["Test 1", "Test 2", "Mock Test 2023"],
                  icon: <CheckCircle className="h-8 w-8" />,
                  color: "cyan",
                  count: "500+ Tests",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className={`bg-${item.color}-500 h-2 w-full`}></div>
                  <div className="p-6">
                    <div
                      className={`bg-${item.color}-100 dark:bg-${item.color}-900/30 p-3 rounded-full inline-block mb-4`}
                    >
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.level}</h3>
                    <p className="text-muted-foreground mb-4">{item.description}</p>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 mb-4">
                      <p className="font-medium text-sm text-slate-500 dark:text-slate-400 mb-2">Examples:</p>
                      <ul className="space-y-1">
                        {item.examples.map((example, idx) => (
                          <motion.li
                            key={idx}
                            className="flex items-center text-sm"
                            initial={{ opacity: 0, x: -5 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + idx * 0.1 }}
                            viewport={{ once: true }}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full bg-${item.color}-500 mr-2`}></div>
                            {example}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{item.count}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Second row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:px-16">
              {[
                {
                  level: "Sections",
                  description: "Topic-based sections within each test",
                  examples: ["General Knowledge", "Mathematics", "Reasoning"],
                  icon: <ListChecks className="h-8 w-8" />,
                  color: "emerald",
                  count: "2,000+ Sections",
                },
                {
                  level: "Questions",
                  description: "Individual MCQs with detailed explanations",
                  examples: ["Multiple choice", "True/False", "Fill in the blanks"],
                  icon: <HelpCircle className="h-8 w-8" />,
                  color: "teal",
                  count: "50,000+ Questions",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className={`bg-${item.color}-500 h-2 w-full`}></div>
                  <div className="p-6">
                    <div
                      className={`bg-${item.color}-100 dark:bg-${item.color}-900/30 p-3 rounded-full inline-block mb-4`}
                    >
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.level}</h3>
                    <p className="text-muted-foreground mb-4">{item.description}</p>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 mb-4">
                      <p className="font-medium text-sm text-slate-500 dark:text-slate-400 mb-2">Examples:</p>
                      <ul className="space-y-1">
                        {item.examples.map((example, idx) => (
                          <motion.li
                            key={idx}
                            className="flex items-center text-sm"
                            initial={{ opacity: 0, x: -5 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + idx * 0.1 }}
                            viewport={{ once: true }}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full bg-${item.color}-500 mr-2`}></div>
                            {example}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{item.count}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Connecting lines */}
            <div className="hidden md:block">
              {/* Vertical line from first row to second row */}
              <motion.div
                className="absolute left-1/2 top-[calc(33%-30px)] h-[calc(67%+30px)] w-0.5 bg-emerald-200"
                initial={{ height: 0 }}
                whileInView={{ height: "calc(67% + 30px)" }}
                transition={{ duration: 0.8, delay: 0.5 }}
                viewport={{ once: true }}
              />

              {/* Horizontal lines in first row */}
              <motion.div
                className="absolute top-[33%] left-[calc(16.67%+20px)] h-0.5 w-[calc(66.67%-40px)] bg-emerald-200"
                initial={{ width: 0 }}
                whileInView={{ width: "calc(66.67% - 40px)" }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              />

              {/* Horizontal line in second row */}
              <motion.div
                className="absolute top-[calc(100%-80px)] left-[calc(25%+20px)] h-0.5 w-[calc(50%-40px)] bg-emerald-200"
                initial={{ width: 0 }}
                whileInView={{ width: "calc(50% - 40px)" }}
                transition={{ duration: 0.8, delay: 0.7 }}
                viewport={{ once: true }}
              />
            </div>
          </motion.div>

          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600">
              Explore Our Content Structure
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default FlowVisualisationSection