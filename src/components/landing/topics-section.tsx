"use client"

import { fadeIn, staggerContainer } from "@/constants/animations"
import { ChartBar, Dot } from "lucide-react"
import { motion } from "motion/react"
import { Card, CardContent, CardFooter } from "../ui/card"
import { Button } from "../ui/button"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import Link from "next/link"
import { PageRoutes } from "@/constants/page-routes"
import { Skeleton } from "../ui/skeleton"

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
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="h-full hover:shadow-lg transition-shadow dark:bg-slate-900">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Skeleton className="h-12 w-12 rounded-full mr-4" />
                      <Skeleton className="h-6 w-32" />
                    </div>

                    <ul className="space-y-2 mb-6">
                      {Array.from({ length: 2 }).map((_, idx) => (
                        <motion.li
                          key={idx}
                          className="flex items-center"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * idx }}
                          viewport={{ once: true }}
                        >
                          <Skeleton className="h-8 w-8 rounded-full mr-2" />
                          <Skeleton className="h-4 w-24" />
                        </motion.li>
                      ))}
                    </ul>

                    <Skeleton className="h-10 w-full rounded-md" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    )
  }

  if (topics === null) return null

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
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {topics.map((topic, index) => (
            <motion.div key={index} variants={fadeIn}>
              <Card className="h-full hover:shadow-lg transition-shadow dark:bg-slate-900">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-theme/10 dark:bg-theme/30 p-3 rounded-full mr-4">
                      <ChartBar />
                    </div>
                    <h3 className="text-xl font-bold">{topic.name}</h3>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {topic?.categories?.slice(0, 2).map((category, idx) => (
                      <motion.li
                        key={idx}
                        className="flex items-center"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx }}
                        viewport={{ once: true }}
                      >
                        <Dot className="h-8 w-8 text-theme" />
                        <span>{category.name}</span>
                      </motion.li>
                    ))}
                    {!topic?.categories?.length && (
                      <motion.li
                        className="text-muted-foreground text-center flex items-center justify-center w-full h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        No categories available for this topic.
                      </motion.li>
                    )}
                  </ul>


                </CardContent>
                <CardFooter className="mt-auto">
                  <Button variant="outline" className="w-full mt-auto" asChild>
                    <Link href={PageRoutes.TOPICS + `/${topic._id}`}>
                      Explore {topic.name}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default TopicsSection