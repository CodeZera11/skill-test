"use client"

import { fadeIn, staggerContainer } from "@/constants/animations"
import { motion } from "motion/react"
import Image from "next/image"

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied students who have improved their exam scores
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            {
              name: "Alex Johnson",
              role: "Bank PO Aspirant",
              content:
                "Skill Test helped me prepare for my banking exams. The structured approach and variety of questions were exactly what I needed.",
              avatar: "/alex-avatar.jpg",
            },
            {
              name: "Sarah Williams",
              role: "SSC Exam Coach",
              content:
                "I recommend Skill Test to all my students. The platform's organization makes it easy to assign relevant practice tests and track progress.",
              avatar: "/confident-educator.png",
            },
            {
              name: "Michael Chen",
              role: "Clerk Exam Qualifier",
              content:
                "The questions on Skill Test are challenging and relevant. I credit my success in competitive exams to the regular practice on this platform.",
              avatar: "/confident-asian-professional.png",
            },
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center mb-4">
                <Image
                  src={testimonial.avatar || "/placeholder.svg"}
                  width={60}
                  height={60}
                  alt={testimonial.name}
                  className="rounded-full mr-4"
                />
                <div>
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <p className="italic">{testimonial.content}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default TestimonialsSection