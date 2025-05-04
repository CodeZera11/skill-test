"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Search, Users, Timer, BookOpen, BarChart, Filter, Dot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { useQuery } from "convex/react"
import { api } from "~/convex/_generated/api"
import { Id } from "~/convex/_generated/dataModel"
import { fadeIn, staggerContainer } from "@/constants/animations"
import { formatSeconds } from "@/lib/utils"
import { format } from "date-fns"

const TestsPageContainer = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState("newest")

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([])
  const [questionsRange, setQuestionsRange] = useState([0, 200])
  const tests = useQuery(api.tests.list, { onlyPublished: true });
  const categories = useQuery(api.categories.list, { onlyPublished: true });
  const subCategories = useQuery(api.subCategories.list, {});

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])


  if (tests === undefined || categories === undefined || subCategories === undefined) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold">Loading...</h1>
      </div>
    )
  }

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      (test.description && test.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))

    const subCategory = subCategories.find(sub => sub._id === test.subCategoryId)
    const categoryId = subCategory ? subCategory.categoryId : null

    const matchesCategory = selectedCategories.length === 0 ||
      (categoryId && selectedCategories.includes(categoryId))

    const matchesSubCategory = selectedSubCategories.length === 0 ||
      selectedSubCategories.includes(test.subCategoryId)


    const totalQuestions = test?.totalQuestions || 0
    const matchesQuestions = totalQuestions >= questionsRange[0] && totalQuestions <= questionsRange[1]

    return matchesSearch && matchesCategory && matchesSubCategory && matchesQuestions
  })

  console.log({ filteredTests, tests })

  // Sort tests
  const sortedTests = [...filteredTests].sort((a, b) => {
    const durationA = a.durationInSeconds || 0
    const durationB = b.durationInSeconds || 0
    const totalQuestionsA = a.totalQuestions || 0
    const totalQuestionsB = b.totalQuestions || 0
    switch (sortOption) {
      case "newest":
        return b.createdAt - a.createdAt
      case "oldest":
        return a.createdAt - b.createdAt
      case "a-z":
        return a.name.localeCompare(b.name)
      case "z-a":
        return b.name.localeCompare(a.name)
      case "duration-asc":
        return durationA - durationB
      case "duration-desc":
        return durationB - durationA
      case "questions-asc":
        return totalQuestionsA - totalQuestionsB
      case "questions-desc":
        return totalQuestionsB - totalQuestionsA
      default:
        return b.createdAt - a.createdAt
    }
  })


  const getSubCategoryName = (subCategoryId: Id<"subCategories">) => {
    const subCategory = subCategories.find(sub => sub._id === subCategoryId)

    return subCategory ? subCategory.name : "Unknown"
  }

  const getCategoryName = (subCategoryId: Id<"subCategories">) => {
    const subCategory = subCategories.find(sub => sub._id === subCategoryId)
    if (!subCategory) return "Unknown"

    const category = categories.find(cat => cat._id === subCategory.categoryId)
    return category ? category.name : "Unknown"
  }

  const resetFilters = () => {
    setSelectedCategories([])
    setSelectedSubCategories([])
    setQuestionsRange([0, 200])
  }

  // Check if any filters are active
  const hasActiveFilters = () => {
    return selectedCategories.length > 0 ||
      selectedSubCategories.length > 0 ||
      questionsRange[0] > 0 ||
      questionsRange[1] < 200
  }

  const isLoading = tests === undefined || categories === undefined || subCategories === undefined

  return (
    <main className="flex-1">
      <section className="py-12 md:py-16 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/30 dark:to-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">All Tests</h1>
              <p className="text-muted-foreground max-w-2xl">
                Browse our comprehensive collection of tests across various categories. Each test is designed to help you
                prepare for specific competitive exams.
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
                    placeholder="Search tests..."
                    className="pl-10 w-full md:w-[300px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Filters
                      {hasActiveFilters() && (
                        <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                          {selectedCategories.length + selectedSubCategories.length +
                            (questionsRange[0] > 0 || questionsRange[1] < 200 ? 1 : 0)}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="sm:max-w-md ">
                    <SheetHeader>
                      <SheetTitle>Filter Tests</SheetTitle>
                      <SheetDescription>
                        Narrow down tests based on your preferences
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-6 space-y-6 px-5">
                      <Accordion type="multiple" className="w-full">
                        <AccordionItem value="categories">
                          <AccordionTrigger>Categories</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              {categories.map(category => (
                                <div key={category._id} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`category-${category._id}`}
                                    checked={selectedCategories.includes(category._id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedCategories([...selectedCategories, category._id])
                                      } else {
                                        setSelectedCategories(selectedCategories.filter(id => id !== category._id))
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor={`category-${category._id}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {category.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="subcategories">
                          <AccordionTrigger>Sub-Categories</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2">
                              {subCategories.map(subCategory => (
                                <div key={subCategory._id} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`subcategory-${subCategory._id}`}
                                    checked={selectedSubCategories.includes(subCategory._id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedSubCategories([...selectedSubCategories, subCategory._id])
                                      } else {
                                        setSelectedSubCategories(selectedSubCategories.filter(id => id !== subCategory._id))
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor={`subcategory-${subCategory._id}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {subCategory.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="questions">
                          <AccordionTrigger>Number of Questions</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4">
                              <div className="flex justify-between">
                                <span className="text-sm">{questionsRange[0]}</span>
                                <span className="text-sm">{questionsRange[1]}</span>
                              </div>
                              <Slider
                                value={questionsRange}
                                min={0}
                                max={200}
                                step={10}
                                onValueChange={setQuestionsRange}
                              />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Few</span>
                                <span>Many</span>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                    <SheetFooter className="flex flex-row gap-3 sm:justify-between">
                      <Button variant="outline" onClick={resetFilters}>Reset Filters</Button>
                      <SheetClose asChild>
                        <Button>Apply Filters</Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tests List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">Available Tests</h2>
              <Badge variant="outline">{filteredTests.length} tests</Badge>
            </div>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="a-z">A-Z</SelectItem>
                <SelectItem value="z-a">Z-A</SelectItem>
                <SelectItem value="most-attempted">Most Attempted</SelectItem>
                <SelectItem value="duration-asc">Duration (Low to High)</SelectItem>
                <SelectItem value="duration-desc">Duration (High to Low)</SelectItem>
                <SelectItem value="questions-asc">Questions (Low to High)</SelectItem>
                <SelectItem value="questions-desc">Questions (High to Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            // Loading state
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <Skeleton key={index} className="h-64 rounded-lg" />
              ))}
            </div>
          ) : sortedTests.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {sortedTests.map((test) => (
                <motion.div
                  key={test._id}
                  variants={fadeIn}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className="h-full overflow-hidden dark:bg-slate-900">
                    <CardContent className="p-6">
                      <div className="flex flex-col mb-4">
                        <Badge variant="outline" className="self-start mb-2">
                          {getCategoryName(test.subCategoryId)}
                          <Dot />
                          {getSubCategoryName(test.subCategoryId)}
                        </Badge>
                        <h3 className="text-xl font-bold">{test.name}</h3>
                      </div>
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
                            <p className="font-medium">{formatSeconds(test?.durationInSeconds)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded-full">
                            <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Attempts</p>
                            <p className="font-medium">
                              {test?.attempts || 0}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground ">
                        Last updated {format(test.updatedAt, "dd MMM yyyy")}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex gap-3">
                      <Button className="flex-1" asChild>
                        <Link href={`/tests/${test._id}/instructions`}>
                          Start Test
                        </Link>
                      </Button>
                      {/* <Button variant="outline" className="flex-1" asChild>
                        <Link href={`/tests/${test._id}`}>
                          View Details
                        </Link>
                      </Button> */}
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
                {`We couldn't find any tests matching your search criteria`}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {debouncedSearchQuery && (
                  <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
                )}
                {hasActiveFilters() && (
                  <Button variant="outline" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  )
}

export default TestsPageContainer;