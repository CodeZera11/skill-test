"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Search,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { fadeIn, staggerContainer } from "@/constants/animations"
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { PageRoutes } from "@/constants/page-routes"

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const categories = useQuery(api.categories.listWithSubCategoriesAndTests);

  if (categories === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (categories === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">No categories found</p>
      </div>
    )
  }

  console.log({ categories })


  const filteredCategories = categories
    .map((category) => {
      const filteredSubCategories = category.subCategories.filter(
        (subcategory) =>
          subcategory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          subcategory?.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )

      return {
        ...category,
        subCategories: filteredSubCategories,
        isVisible:
          category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category?.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          filteredSubCategories.length > 0,
      }
    })
    .filter((category) => category.isVisible)

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Page Header */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/30 dark:to-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                <Link
                  href="/"
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-emerald-500 mb-4"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to Home
                </Link>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Test Categories</h1>
                <p className="text-muted-foreground max-w-2xl">
                  Browse our comprehensive collection of test categories and subcategories. Each subcategory contains
                  multiple tests designed to help you master specific skills.
                </p>
              </motion.div>

              <motion.div
                className="w-full md:w-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search categories..."
                    className="pl-10 w-full md:w-[300px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Categories List */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {filteredCategories.length > 0 ? (
              <div className="space-y-16">
                {filteredCategories.map((category, index) => (
                  <motion.div
                    key={category._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center space-x-3">
                      <div>
                        <h2 className="text-2xl font-bold">{category.name}</h2>
                        <p className="text-muted-foreground">{category.description}</p>
                      </div>
                    </div>

                    {category.subCategories.length > 0 ? (
                      <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                      >
                        {category.subCategories.map((subcategory) => (
                          <motion.div
                            key={subcategory._id}
                            variants={fadeIn}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                          >
                            <Card
                              className="h-full overflow-hidden dark:bg-slate-900 border-t-4"
                            >
                              <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-2">{subcategory.name}</h3>
                                <p className="text-muted-foreground mb-4">{subcategory.description}</p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    <span>
                                      {subcategory?.tests?.length + " "}
                                      Tests
                                    </span>
                                  </Badge>
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <Zap className="h-3 w-3" />
                                    <span>
                                      {subcategory?.tests?.reduce((acc, test) => acc + (test.totalQuestions || 0), 0) + " "}
                                      Questions
                                    </span>
                                  </Badge>
                                </div>
                              </CardContent>
                              <CardFooter className="p-4 pt-0">
                                <Button className="w-full" variant="outline" asChild>
                                  <Link href={PageRoutes.SUB_CATEGORIES + "/" + subcategory._id}>
                                    Explore Tests
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                  </Link>
                                </Button>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <p className="text-muted-foreground italic">No subcategories match your search.</p>
                    )}

                    <div className="border-b border-slate-200 dark:border-slate-800 mt-8"></div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div className="text-center py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">No categories found</h3>
                <p className="text-muted-foreground mb-6">{`We couldn't find any categories matching "${searchQuery}"`}</p>
                <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-100 dark:bg-slate-900/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <span className="font-medium">Skill Test</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Skill Test. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
