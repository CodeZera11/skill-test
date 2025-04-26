"use client"

import { fadeIn, staggerContainer } from "@/constants/animations"
import { motion } from "motion/react"
import Image from "next/image"
import { AnimatedTestimonials } from "../ui/animated-testimonials"

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote:
        "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
      name: "Sarah Chen",
      designation: "Product Manager at TechFlow",
      src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
      name: "Michael Rodriguez",
      designation: "CTO at InnovateSphere",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple.",
      name: "Emily Watson",
      designation: "Operations Director at CloudScale",
      src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "Outstanding support and robust features. It's rare to find a product that delivers on all its promises.",
      name: "James Kim",
      designation: "Engineering Lead at DataPro",
      src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      quote:
        "The scalability and performance have been game-changing for our organization. Highly recommend to any growing business.",
      name: "Lisa Thompson",
      designation: "VP of Technology at FutureNet",
      src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-white to-emerald-50 dark:from-background dark:to-emerald-950/30 h-[80vh] flex items-center justify-center">
      <AnimatedTestimonials testimonials={testimonials} />
    </section>
  )

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-white to-emerald-50 dark:from-background dark:to-emerald-950/30">
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