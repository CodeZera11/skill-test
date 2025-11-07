"use client"

import { motion } from "motion/react"
import { Button } from "../ui/button"
import Link from "next/link"
import { PageRoutes } from "@/constants/page-routes"
import Image from "next/image"
import { fadeIn } from "@/constants/animations"



const HeroSection = () => {

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-theme/15 to-white dark:from-theme/30 dark:to-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div
            className="md:w-1/2 mb-10 md:mb-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Master Your Exam With <span className="text-theme">Confidence</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg">
              Practice thousands of MCQs across various competitive exams and track your progress with our
              intelligent learning platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={PageRoutes.TOPICS}>
                <Button size="lg" className="bg-theme text-white hover:bg-theme/80">
                  Start Practicing
                </Button>
              </Link>
              <Button size="lg" variant="outline" asChild>
                <Link href={PageRoutes.CATEGORIES}>
                  Explore Categories
                </Link>
              </Button>
            </div>
          </motion.div>
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Image
              src="/hero-section.png"
              width={600}
              height={500}
              alt="Student studying"
              className="object-contain"
              style={{
                filter: "drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection