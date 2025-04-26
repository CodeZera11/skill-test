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
import { useParams, useSearchParams } from "next/navigation"

// Mock data based on the Convex schema
const mockCategories = [
  {
    _id: "cat1",
    name: "Clerk Exam",
    description: "Preparation materials for clerk exams",
    createdAt: Date.now() - 1000000,
    updatedAt: Date.now() - 500000,
  },
  {
    _id: "cat2",
    name: "SSC Exams",
    description: "Staff Selection Commission exam preparation",
    createdAt: Date.now() - 2000000,
    updatedAt: Date.now() - 300000,
  },
  {
    _id: "cat3",
    name: "Banking Exams",
    description: "Preparation for various banking exams",
    createdAt: Date.now() - 3000000,
    updatedAt: Date.now() - 100000,
  },
]

const mockSubCategories = [
  {
    _id: "sub1",
    name: "Memory Based Papers",
    description: "Papers based on candidates' memory after exams",
    categoryId: "cat1",
    imageStorageId: "img1",
    createdAt: Date.now() - 900000,
    updatedAt: Date.now() - 400000,
  },
  {
    _id: "sub2",
    name: "Practice Papers",
    description: "Practice papers for clerk exams",
    categoryId: "cat1",
    imageStorageId: "img2",
    createdAt: Date.now() - 800000,
    updatedAt: Date.now() - 300000,
  },
  {
    _id: "sub3",
    name: "Previous Year Papers",
    description: "Previous year papers for clerk exams",
    categoryId: "cat1",
    imageStorageId: "img3",
    createdAt: Date.now() - 700000,
    updatedAt: Date.now() - 200000,
  },
  {
    _id: "sub4",
    name: "CGL",
    description: "Combined Graduate Level exam preparation",
    categoryId: "cat2",
    imageStorageId: "img4",
    createdAt: Date.now() - 600000,
    updatedAt: Date.now() - 100000,
  },
  {
    _id: "sub5",
    name: "CHSL",
    description: "Combined Higher Secondary Level exam preparation",
    categoryId: "cat2",
    imageStorageId: "img5",
    createdAt: Date.now() - 500000,
    updatedAt: Date.now() - 50000,
  },
  {
    _id: "sub6",
    name: "IBPS PO",
    description: "Institute of Banking Personnel Selection - Probationary Officer",
    categoryId: "cat3",
    imageStorageId: "img6",
    createdAt: Date.now() - 400000,
    updatedAt: Date.now() - 40000,
  },
  {
    _id: "sub7",
    name: "SBI PO",
    description: "State Bank of India - Probationary Officer",
    categoryId: "cat3",
    imageStorageId: "img7",
    createdAt: Date.now() - 300000,
    updatedAt: Date.now() - 30000,
  },
]

const mockTests = [
  {
    _id: "test1",
    name: "Memory Based Paper - July 2023",
    description: "Based on candidates' memory from July 2023 exam",
    subCategoryId: "sub1",
    totalQuestions: 100,
    totalMarks: 100,
    duration: 60, // minutes
    createdAt: Date.now() - 800000,
    updatedAt: Date.now() - 350000,
  },
  {
    _id: "test2",
    name: "Memory Based Paper - August 2023",
    description: "Based on candidates' memory from August 2023 exam",
    subCategoryId: "sub1",
    totalQuestions: 100,
    totalMarks: 100,
    duration: 60,
    createdAt: Date.now() - 750000,
    updatedAt: Date.now() - 300000,
  },
  {
    _id: "test3",
    name: "Memory Based Paper - September 2023",
    description: "Based on candidates' memory from September 2023 exam",
    subCategoryId: "sub1",
    totalQuestions: 100,
    totalMarks: 100,
    duration: 60,
    createdAt: Date.now() - 700000,
    updatedAt: Date.now() - 250000,
  },
  {
    _id: "test4",
    name: "Practice Paper - Set 1",
    description: "Practice paper for clerk exam preparation",
    subCategoryId: "sub2",
    totalQuestions: 100,
    totalMarks: 100,
    duration: 60,
    createdAt: Date.now() - 650000,
    updatedAt: Date.now() - 200000,
  },
  {
    _id: "test5",
    name: "Practice Paper - Set 2",
    description: "Practice paper for clerk exam preparation",
    subCategoryId: "sub2",
    totalQuestions: 100,
    totalMarks: 100,
    duration: 60,
    createdAt: Date.now() - 600000,
    updatedAt: Date.now() - 150000,
  },
  {
    _id: "test6",
    name: "Previous Year Paper - 2022",
    description: "Actual paper from 2022 clerk exam",
    subCategoryId: "sub3",
    totalQuestions: 100,
    totalMarks: 100,
    duration: 60,
    createdAt: Date.now() - 550000,
    updatedAt: Date.now() - 100000,
  },
  {
    _id: "test7",
    name: "Previous Year Paper - 2021",
    description: "Actual paper from 2021 clerk exam",
    subCategoryId: "sub3",
    totalQuestions: 100,
    totalMarks: 100,
    duration: 60,
    createdAt: Date.now() - 500000,
    updatedAt: Date.now() - 50000,
  },
]

// Mock attempt counts for tests
const mockAttemptCounts = {
  test1: 1245,
  test2: 987,
  test3: 756,
  test4: 1532,
  test5: 843,
  test6: 2156,
  test7: 1876,
}

export default function SubCategoryDetailPage() {
  const id = useParams().id
  console.log({ id })
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState("newest")
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Get subcategory details
  const subCategory = mockSubCategories.find((sub) => sub._id === id)
  const category = subCategory ? mockCategories.find((cat) => cat._id === subCategory.categoryId) : null

  // Get tests for this subcategory
  const subCategoryTests = mockTests.filter((test) => test.subCategoryId === id)

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
      case "most-attempted":
        return (mockAttemptCounts[b._id] || 0) - (mockAttemptCounts[a._id] || 0)
      default:
        return b.createdAt - a.createdAt
    }
  })

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  // Function to format date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Function to format duration
  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours} hr ${remainingMinutes} min` : `${hours} hr`
  }

  if (isLoading) {
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

  if (!subCategory) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">Sub-category not found</h3>
            <p className="text-muted-foreground mb-6">We couldn't find the sub-category you're looking for.</p>
            <Button asChild>
              <Link href="/sub-categories">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Sub-Categories
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
                      <span>Created {formatDate(subCategory.createdAt)}</span>
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Updated {formatDate(subCategory.updatedAt)}</span>
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
                {sortedTests.map((test) => (
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
                              <p className="font-medium">{formatDuration(test.duration)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded-full">
                              <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Attempts</p>
                              <p className="font-medium">{mockAttemptCounts[test._id]?.toLocaleString() || 0}</p>
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground mb-4">
                          Last updated {formatDate(test.updatedAt)}
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex gap-3">
                        <Button className="flex-1" asChild>
                          <Link href={`/tests/${test._id}`}>Start Test</Link>
                        </Button>
                        <Button variant="outline" className="flex-1" asChild>
                          <Link href={`/tests/${test._id}`}>View Details</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div className="text-center py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">No tests found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any tests matching "{debouncedSearchQuery}"
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
