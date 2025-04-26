"use client"

import { fadeIn, staggerContainer } from "@/constants/animations"
import { ChartBar, Dot, } from "lucide-react"
import { motion } from "motion/react"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import Link from "next/link"
import { PageRoutes } from "@/constants/page-routes"

const CategoriesSection = () => {

  const categories = useQuery(api.categories.listWithSubCategories, {})

  if (categories === undefined) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  if (categories === null) return null


  return (
    <section id="categories" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Our Exam Categories</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse through our extensive collection of tests organized by exam categories and subcategories
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {categories.map((category, index) => (
            <motion.div key={index} variants={fadeIn}>
              <Card className="h-full hover:shadow-lg transition-shadow dark:bg-slate-900">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full mr-4">
                      {/* {category.icon} */}
                      <ChartBar />
                    </div>
                    <h3 className="text-xl font-bold">{category.name}</h3>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {category.subCategories.slice(0, 2).map((sub, idx) => (
                      <motion.li
                        key={idx}
                        className="flex items-center"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx }}
                        viewport={{ once: true }}
                      >
                        <Dot className="h-8 w-8 text-emerald-500" />
                        <span>{sub.name}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <Button variant="outline" className="w-full" asChild>
                    <Link href={PageRoutes.CATEGORIES + `/${category._id}`}>
                      Explore {category.name}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default CategoriesSection