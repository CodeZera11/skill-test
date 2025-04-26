// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import Link from "next/link"
// import Image from "next/image"

// export default function CategoriesPage() {
//   return (
//     <div className="container mx-auto py-10">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold">Test Categories</h1>
//         <Link href="/">
//           <Button variant="outline">Back to Home</Button>
//         </Link>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {mockCategories.map((category) => (
//           <Card key={category.id} className="overflow-hidden">
//             <div className="h-40 relative bg-muted">
//               <Image
//                 src={`/abstract-geometric-shapes.png?height=200&width=400&query=${category.name}`}
//                 alt={category.name}
//                 fill
//                 className="object-cover"
//               />
//             </div>
//             <CardHeader>
//               <CardTitle>{category.name}</CardTitle>
//               <CardDescription>{category.description}</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-2">
//                 <p className="text-sm font-medium">Sub-categories:</p>
//                 <ul className="space-y-1">
//                   {category.subCategories.map((sub) => (
//                     <li key={sub.id} className="text-sm flex justify-between">
//                       <span>{sub.name}</span>
//                       <span className="text-muted-foreground">{sub.count} tests</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </CardContent>
//             <CardFooter>
//               <Link href={`/categories/${category.id}`} className="w-full">
//                 <Button className="w-full">View Category</Button>
//               </Link>
//             </CardFooter>
//           </Card>
//         ))}
//       </div>
//     </div>
//   )
// }


"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Menu,
  X,
  Search,
  Zap,
  Code,
  Calculator,
  FlaskRoundIcon as Flask,
  BookText,
  GraduationCap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ModeToggle } from "@/components/theme-switcher"

export default function CategoriesPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

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

  const categories = [
    {
      id: "mathematics",
      name: "Mathematics",
      description: "Master mathematical concepts from basic arithmetic to advanced calculus",
      icon: <Calculator className="h-6 w-6" />,
      color: "emerald",
      subcategories: [
        {
          id: "algebra",
          name: "Algebra",
          description: "Equations, inequalities, functions, and graphs",
          testCount: 42,
          questionCount: 1250,
          difficulty: "Medium",
        },
        {
          id: "calculus",
          name: "Calculus",
          description: "Limits, derivatives, integrals, and applications",
          testCount: 38,
          questionCount: 980,
          difficulty: "Hard",
        },
        {
          id: "geometry",
          name: "Geometry",
          description: "Shapes, sizes, properties of space",
          testCount: 35,
          questionCount: 890,
          difficulty: "Medium",
        },
        {
          id: "statistics",
          name: "Statistics",
          description: "Data collection, analysis, interpretation, and presentation",
          testCount: 28,
          questionCount: 720,
          difficulty: "Medium",
        },
        {
          id: "trigonometry",
          name: "Trigonometry",
          description: "Study of triangles, angles, and trigonometric functions",
          testCount: 22,
          questionCount: 550,
          difficulty: "Hard",
        },
      ],
    },
    {
      id: "science",
      name: "Science",
      description: "Explore scientific disciplines and understand the natural world",
      icon: <Flask className="h-6 w-6" />,
      color: "blue",
      subcategories: [
        {
          id: "physics",
          name: "Physics",
          description: "Matter, energy, and the fundamental forces of nature",
          testCount: 45,
          questionCount: 1100,
          difficulty: "Hard",
        },
        {
          id: "chemistry",
          name: "Chemistry",
          description: "Composition, structure, properties, and reactions of matter",
          testCount: 40,
          questionCount: 950,
          difficulty: "Hard",
        },
        {
          id: "biology",
          name: "Biology",
          description: "Study of living organisms and their interactions",
          testCount: 38,
          questionCount: 920,
          difficulty: "Medium",
        },
        {
          id: "earth-science",
          name: "Earth Science",
          description: "Geology, meteorology, oceanography, and astronomy",
          testCount: 25,
          questionCount: 600,
          difficulty: "Medium",
        },
      ],
    },
    {
      id: "language-arts",
      name: "Language Arts",
      description: "Develop language skills through reading, writing, and comprehension",
      icon: <BookText className="h-6 w-6" />,
      color: "purple",
      subcategories: [
        {
          id: "grammar",
          name: "Grammar",
          description: "Rules and structure of language",
          testCount: 30,
          questionCount: 750,
          difficulty: "Easy",
        },
        {
          id: "literature",
          name: "Literature",
          description: "Analysis and interpretation of literary works",
          testCount: 35,
          questionCount: 820,
          difficulty: "Medium",
        },
        {
          id: "vocabulary",
          name: "Vocabulary",
          description: "Word meanings, usage, and context",
          testCount: 28,
          questionCount: 700,
          difficulty: "Easy",
        },
        {
          id: "writing",
          name: "Writing",
          description: "Composition, style, and effective communication",
          testCount: 25,
          questionCount: 600,
          difficulty: "Medium",
        },
      ],
    },
    {
      id: "computer-science",
      name: "Computer Science",
      description: "Learn programming, algorithms, and computational thinking",
      icon: <Code className="h-6 w-6" />,
      color: "cyan",
      subcategories: [
        {
          id: "programming",
          name: "Programming",
          description: "Coding concepts and language fundamentals",
          testCount: 40,
          questionCount: 950,
          difficulty: "Medium",
        },
        {
          id: "data-structures",
          name: "Data Structures",
          description: "Organization and storage of data",
          testCount: 30,
          questionCount: 720,
          difficulty: "Hard",
        },
        {
          id: "algorithms",
          name: "Algorithms",
          description: "Problem-solving methods and efficiency",
          testCount: 28,
          questionCount: 680,
          difficulty: "Hard",
        },
        {
          id: "web-development",
          name: "Web Development",
          description: "HTML, CSS, JavaScript, and web technologies",
          testCount: 35,
          questionCount: 850,
          difficulty: "Medium",
        },
      ],
    },
    {
      id: "standardized-tests",
      name: "Standardized Tests",
      description: "Prepare for major standardized exams with comprehensive practice",
      icon: <GraduationCap className="h-6 w-6" />,
      color: "amber",
      subcategories: [
        {
          id: "sat",
          name: "SAT",
          description: "College admission test covering math, reading, and writing",
          testCount: 50,
          questionCount: 1500,
          difficulty: "Medium",
        },
        {
          id: "act",
          name: "ACT",
          description: "College readiness assessment with science section",
          testCount: 45,
          questionCount: 1350,
          difficulty: "Medium",
        },
        {
          id: "gre",
          name: "GRE",
          description: "Graduate school admission test",
          testCount: 40,
          questionCount: 1200,
          difficulty: "Hard",
        },
        {
          id: "gmat",
          name: "GMAT",
          description: "Business school admission test",
          testCount: 38,
          questionCount: 1150,
          difficulty: "Hard",
        },
      ],
    },
  ]

  // Filter categories and subcategories based on search query
  const filteredCategories = categories
    .map((category) => {
      const filteredSubcategories = category.subcategories.filter(
        (subcategory) =>
          subcategory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          subcategory.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )

      return {
        ...category,
        subcategories: filteredSubcategories,
        isVisible:
          category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          filteredSubcategories.length > 0,
      }
    })
    .filter((category) => category.isVisible)

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "Medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      case "Hard":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <CheckCircle className="h-6 w-6 text-emerald-500" />
            <span className="font-bold text-xl">Skill Test</span>
          </Link>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium hover:text-emerald-500 transition-colors">
              Home
            </Link>
            <Link href="/categories" className="text-sm font-medium text-emerald-500 transition-colors">
              Categories
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-emerald-500 transition-colors">
              How It Works
            </Link>
            <ModeToggle />
            <Button>Get Started</Button>
          </nav>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link
                href="/"
                className="text-sm font-medium hover:text-emerald-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/categories"
                className="text-sm font-medium text-emerald-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="#"
                className="text-sm font-medium hover:text-emerald-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <div className="flex items-center">
                <ModeToggle />
              </div>
              <Button>Get Started</Button>
            </div>
          </motion.div>
        )}
      </header>

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
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-md bg-${category.color}-100 dark:bg-${category.color}-900/30`}>
                        {category.icon}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{category.name}</h2>
                        <p className="text-muted-foreground">{category.description}</p>
                      </div>
                    </div>

                    {category.subcategories.length > 0 ? (
                      <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                      >
                        {category.subcategories.map((subcategory, subIndex) => (
                          <motion.div
                            key={subcategory.id}
                            variants={fadeIn}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                          >
                            <Card
                              className="h-full overflow-hidden dark:bg-slate-900 border-t-4"
                              style={{ borderTopColor: `var(--${category.color}-500)` }}
                            >
                              <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-2">{subcategory.name}</h3>
                                <p className="text-muted-foreground mb-4">{subcategory.description}</p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    <span>{subcategory.testCount} Tests</span>
                                  </Badge>
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <Zap className="h-3 w-3" />
                                    <span>{subcategory.questionCount} Questions</span>
                                  </Badge>
                                  <Badge className={`${getDifficultyColor(subcategory.difficulty)}`}>
                                    {subcategory.difficulty}
                                  </Badge>
                                </div>
                              </CardContent>
                              <CardFooter className="p-4 pt-0">
                                <Button className="w-full" variant="outline">
                                  Explore Tests
                                  <ChevronRight className="h-4 w-4 ml-2" />
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
                <p className="text-muted-foreground mb-6">We couldn't find any categories matching "{searchQuery}"</p>
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
