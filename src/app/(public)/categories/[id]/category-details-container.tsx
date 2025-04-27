"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Search,
  FileText,
  Clock,
  Layers,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Id } from "../../../../../convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { api } from "../../../../../convex/_generated/api"
import { fadeIn, staggerContainer } from "@/constants/animations"
import { format } from "date-fns"


const CategoryDetailsContainer = ({ id }: { id: Id<"categories"> }) => {

  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState("newest")

  const category = useQuery(api.categories.getById, { id });
  const categorySubCategories = useQuery(api.subCategories.getByCategory, { categoryId: id, populateTests: true });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])


  if (category === undefined || categorySubCategories === undefined) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-12">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-12 w-3/4 mb-8" />
          <Skeleton className="h-32 w-full mb-8 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <Skeleton key={index} className="h-64 rounded-lg" />
            ))}
          </div>
        </main>
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


  const filteredSubCategories = categorySubCategories.filter(
    (subCategory) =>
      subCategory.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      (subCategory.description && subCategory.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase())),
  )

  const sortedSubCategories = [...filteredSubCategories].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return b.createdAt - a.createdAt
      case "oldest":
        return a.createdAt - b.createdAt
      case "a-z":
        return a.name.localeCompare(b.name)
      case "z-a":
        return b.name.localeCompare(a.name)
      default:
        return b.createdAt - a.createdAt
    }
  })

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">Category not found</h3>
            <p className="text-muted-foreground mb-6">{`We couldn't find the category you're looking for.`}</p>
            <Button asChild>
              <Link href="/categories">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Categories
              </Link>
            </Button>
          </div>
        </main>
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

  const categoryStats = {
    totalSubCategories: 0 || categorySubCategories.length,
    totalTests: 0 || categorySubCategories.reduce((acc, subCategory) => acc + (subCategory?.tests?.length || 0), 0),
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Breadcrumb and Header */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/30 dark:to-background">
          <div className="container mx-auto px-4">
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <div className="flex flex-wrap items-center text-sm text-muted-foreground mb-4 gap-2">
                <Link href="/" className="hover:text-emerald-500 transition-colors">
                  Home
                </Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/categories" className="hover:text-emerald-500 transition-colors">
                  Categories
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">{category.name}</span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{category.name}</h1>
                  <p className="text-muted-foreground max-w-2xl mb-4">
                    {category.description || "Explore subcategories and tests in this category"}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Layers className="h-3 w-3" />
                      <span>{categoryStats.totalSubCategories} Sub-Categories</span>
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      <span>{categoryStats.totalTests} Tests</span>
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Updated {format(category.updatedAt, "MMM dd, yyyy")}</span>
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Sub-Categories List */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">Sub-Categories</h2>
                <Badge variant="outline">{categorySubCategories.length} sub-categories</Badge>
              </div>
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
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="a-z">A-Z</SelectItem>
                    <SelectItem value="z-a">Z-A</SelectItem>
                    <SelectItem value="most-tests">Most Tests</SelectItem>
                    <SelectItem value="most-questions">Most Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {sortedSubCategories.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {sortedSubCategories.map((subCategory) => {
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
                            <div>
                              <h3 className="text-xl font-bold">{subCategory.name}</h3>
                            </div>
                          </div>

                          <p className="text-muted-foreground mb-4">
                            {subCategory.description || "Practice tests in this subcategory"}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {/* <Badge variant="outline" className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              <span>{mockTestCounts[subCategory._id] || 0} Tests</span>
                            </Badge> */}
                            {/* <Badge variant="outline" className="flex items-center gap-1">
                              <BarChart className="h-3 w-3" />
                              <span>{mockQuestionCounts[subCategory._id] || 0} Questions</span>
                            </Badge> */}
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Updated {format(subCategory.updatedAt, "MMM dd, yyyy")}</span>
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
                </p>
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

export default CategoryDetailsContainer