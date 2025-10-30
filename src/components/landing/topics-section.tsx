"use client"

import { fadeIn } from "@/constants/animations"

import { motion } from "motion/react"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"

import { Skeleton } from "../ui/skeleton"
import Image from "next/image"
import Link from "next/link"
import { PageRoutes } from "@/constants/page-routes"

const TopicsSection = () => {
  const topics = useQuery(api.topics.list, {
    onlyPublished: true,
  })

  if (topics === undefined) {
    return (
      <section id="topics" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore Our Topics
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse through our extensive collection of topics, each containing categories to guide you through comprehensive tests.
            </p>
          </motion.div>

          <motion.div
            className="flex items-center overflow-x-scroll gap-8"
            // variants={staggerContainer}
            // initial="hidden"
            // whileInView="visible"
            viewport={{ once: true }}
          >
            {Array.from({ length: 12 }).map((_, index) => (
              <motion.div key={index} variants={fadeIn} className="flex flex-col gap-2">
                {/* logo div */}
                <div className="h-24 w-full bg-blue-200/20 rounded-lg flex items-center justify-center">
                  <Skeleton className="h-12 w-12 rounded-full bg-neutral-200" />
                </div>
                <p>
                  <Skeleton className="h-4 w-32 mb-4" />
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    )
  }

  if (topics === null) return null


  console.log(topics)

  return (
    <section id="topics" className="py-20">
      <div className="container mx-auto px-4">

        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore Our Topics
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse through our extensive collection of topics, each containing categories to guide you through comprehensive tests.
          </p>
        </motion.div>

        <motion.div
          className="flex items-center overflow-x-scroll gap-8"
          // variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {topics?.map((topic) => (
            <Link href={PageRoutes.TOPICS + `/${topic._id}`} key={topic._id} className="flex flex-col gap-2 items-center text-center w-30">
              <div className="h-24 w-full text-wrap bg-blue-200/20 rounded-lg flex items-center justify-center">
                <Image
                  src={topic.topicUrl || "/placeholder-logo.png"}
                  alt={topic.name}
                  width={200}
                  height={200}
                  className="h-14 w-14 md:h-18 md:w-18 rounded-full object-cover"
                />
              </div>
              <p className="text-center text-sm md:text-md font-medium text-wrap w-20 text-neutral-500">
                {topic.name}
              </p>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default TopicsSection