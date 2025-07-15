"use client"

import { fadeIn } from "@/constants/animations"
import { ChevronDown, ChevronRight, Folder } from "lucide-react"
import { motion } from "motion/react"

const StaticSteps = [
  {
    title: "Choose a Category",
    description: "Select from various competitive exam categories",
    icon: <Folder />,
  },
  {
    title: "Select a Test",
    description: "Pick from subcategory tests based on your needs",
    icon: <Folder />
  },
  {
    title: "Practice Questions",
    description: "Answer MCQs and get instant feedback on your performance",
    icon: <Folder />
  },
  {
    title: "Track Progress",
    description: "Monitor your improvement with detailed analytics",
    icon: <Folder />
  },
]

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 border-b">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How Skill Test Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our structured approach helps you master any competitive exam through practice and repetition
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {StaticSteps.map((step, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center gap-5">
              <motion.div
                key={index}
                className="text-center border p-4 rounded-md border-theme/60"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="relative mb-6 mx-auto">
                  <div className="w-16 h-16 mx-auto relative flex items-center justify-center">
                    {step.icon}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-theme"
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                      viewport={{ once: true }}
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
              {index < StaticSteps.length - 1 && (
                <motion.div
                  className="flex items-center justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ChevronRight className="text-muted-foreground hidden md:block" />
                  <ChevronDown className="text-muted-foreground md:hidden" />

                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection