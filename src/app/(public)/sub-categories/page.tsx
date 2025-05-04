"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight, ChevronLeft, CheckCircle, Search, FileText, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { fadeIn, staggerContainer } from "@/constants/animations"
import { format } from "date-fns"

export default function SubCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const subCategories = useQuery(api.subCategories.listWithTests, { onlyPublished: true })
  const categories = useQuery(api.categories.list, { onlyPublished: true })

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const isLoading = subCategories === undefined || categories === undefined

  if (subCategories === undefined || categories === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (subCategories === null || categories === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">No categories/sub-categories found</p>
      </div>
    )
  }

  const filteredSubCategories = subCategories?.filter((subCategory) => {
    const matchesSearch =
      subCategory.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      (subCategory.description && subCategory.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || subCategory.categoryId === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Page Header */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/30 dark:to-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                <Link
                  href="/categories"
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-emerald-500 mb-4"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to Categories
                </Link>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Sub-Categories</h1>
                <p className="text-muted-foreground max-w-2xl">
                  Browse our comprehensive collection of sub-categories. Each sub-category contains multiple tests
                  designed to help you master specific skills.
                </p>
              </motion.div>

              <motion.div
                className="w-full md:w-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search sub-categories..."
                      className="pl-10 w-full md:w-[300px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {subCategories?.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Sub-Categories Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {isLoading ? (
              // Loading state
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <Skeleton key={index} className="h-64 rounded-lg" />
                ))}
              </div>
            ) : filteredSubCategories.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {filteredSubCategories.map((subCategory) => {
                  const category = categories.find((cat) => cat._id === subCategory.categoryId)

                  return (
                    <motion.div
                      key={subCategory._id}
                      variants={fadeIn}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <Card
                        className="h-full overflow-hidden dark:bg-slate-900 border-t-4"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center mb-4">
                            <div className={`p-3 rounded-full mr-4`}>
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold">{subCategory.name}</h3>
                              <Badge variant="outline" className="mt-1">
                                {category?.name || "Unknown Category"}
                              </Badge>
                            </div>
                          </div>

                          <p className="text-muted-foreground mb-4">
                            {subCategory.description || "Practice tests in this subcategory"}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="outline" className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              <span className="font-bold">
                                {subCategory.tests.length} {subCategory.tests.length === 1 ? "Test" : "Tests"}
                              </span>
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span className="font-bold">Updated {format(subCategory.updatedAt, "MMM dd, yyyy")}</span>
                            </Badge>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button className="w-full" asChild>
                            <Link href={`/sub-categories/${subCategory._id}`}>
                              Explore Tests
                              <ChevronRight className="h-4 w-4 ml-2" />
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  )
                })}
              </motion.div>
            ) : (
              <motion.div className="text-center py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">No sub-categories found</h3>
                <p className="text-muted-foreground mb-6">
                  {`We couldn't find any sub-categories matching "${debouncedSearchQuery}"`}
                  {selectedCategory !== "all" && " in the selected category"}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
                  {selectedCategory !== "all" && (
                    <Button variant="outline" onClick={() => setSelectedCategory("all")}>
                      Show All Categories
                    </Button>
                  )}
                </div>
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
