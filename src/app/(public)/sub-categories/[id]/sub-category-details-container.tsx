"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Search,
  Clock,
  FileText,
  Users,
  Calendar,
  Timer,
  BookOpen,
  BarChart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Id } from "~/convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { api } from "~/convex/_generated/api"
import { fadeIn, staggerContainer } from "@/constants/animations"

import { format, intervalToDuration } from "date-fns"
const SubCategoryDetailsContainer = ({ id }: { id: Id<"subCategories"> }) => {

  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState("newest")
  const subCategory = useQuery(api.subCategories.getByIdWithCategoryAndTests, { id, onlyPublished: true })


  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const category = subCategory?.category
  const subCategoryTests = subCategory?.tests || []

  // Filter tests based on search
  const filteredTests = subCategoryTests.filter(
    (test) =>
      test.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      (test.description && test.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase())),
  )

  // Sort tests
  const sortedTests = [...filteredTests].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return b.createdAt - a.createdAt
      case "oldest":
        return a.createdAt - b.createdAt
      case "a-z":
        return a.name.localeCompare(b.name)
      case "z-a":
        return b.name.localeCompare(a.name)
      // case "most-attempted":
      //   return b.attempts - a.attempts
      default:
        return b.createdAt - a.createdAt
    }
  })

  if (subCategory === undefined) {
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

  if (subCategory === null) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">Sub-category not found</h3>
            <p className="text-muted-foreground mb-6">{`We couldn't find the sub-category you're looking for.`}</p>
            <Button asChild>
              <Link href="/sub-categories">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Sub-Categories
              </Link>
            </Button>
          </div>
        </main>
      </div>
    )
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
                <Link href="/sub-categories" className="hover:text-emerald-500 transition-colors">
                  Sub-Categories
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">{subCategory.name}</span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold">{subCategory.name}</h1>
                    <Badge variant="outline" className="ml-2">
                      {category?.name || "Unknown Category"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground max-w-2xl mb-4">
                    {subCategory.description || "Practice tests in this subcategory"}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      <span>{subCategoryTests.length} Tests</span>
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Created {format(subCategory.createdAt, "MMM dd, yyyy")}</span>
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Updated {format(subCategory.updatedAt, "MMM dd, yyyy")}</span>
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Tests List */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <h2 className="text-2xl font-bold">Available Tests</h2>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search tests..."
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
                    <SelectItem value="most-attempted">Most Attempted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {sortedTests.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {sortedTests.map((test) => {

                  const duration = test.durationInSeconds || 0;
                  const durationInMs = duration * 1000;
                  const durationObj = intervalToDuration({ start: 0, end: durationInMs });
                  const formatted = `${durationObj.hours ? `${durationObj.hours}h ` : ""}${durationObj.minutes ? `${durationObj.minutes}m ` : ""
                    }${durationObj.seconds ? `${durationObj.seconds}s` : ""}`.trim();

                  return (
                    <motion.div key={test._id} variants={fadeIn} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                      <Card className="h-full overflow-hidden dark:bg-slate-900">
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold mb-2">{test.name}</h3>
                          <p className="text-muted-foreground mb-4">
                            {test.description || "Take this test to practice your skills"}
                          </p>

                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="flex items-center gap-2">
                              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-1.5 rounded-full">
                                <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Questions</p>
                                <p className="font-medium">{test.totalQuestions}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-full">
                                <BarChart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Marks</p>
                                <p className="font-medium">{test.totalMarks}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="bg-amber-100 dark:bg-amber-900/30 p-1.5 rounded-full">
                                <Timer className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Duration</p>
                                <p className="font-medium">{formatted}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded-full">
                                <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Attempts</p>
                                <p className="font-medium">{test?.attempts || 0}</p>
                              </div>
                            </div>
                          </div>

                          <div className="text-xs text-muted-foreground mb-4">
                            Last updated {format(test.updatedAt, "MMM dd, yyyy")}
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex gap-3">
                          <Button className="flex-1" asChild>
                            <Link href={`/tests/${test._id}/instructions`}>Start Test</Link>
                          </Button>
                          <Button variant="outline" className="flex-1" asChild>
                            <Link href={`/tests/${test._id}`}>View Details</Link>
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
                <h3 className="text-xl font-medium mb-2">No tests found</h3>
                <p className="text-muted-foreground mb-6">
                  {`We couldn't find any tests matching "${debouncedSearchQuery}"`}
                </p>
                <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
              </motion.div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default SubCategoryDetailsContainer