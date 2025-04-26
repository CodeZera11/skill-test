// "use client"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { useCurrentUser } from "@/hooks/use-current-user"
// import { SignInButton, UserButton } from "@clerk/clerk-react"
// import { Authenticated, Unauthenticated } from "convex/react"
// import Link from "next/link"

// export default function Home() {

//   const { isLoading, isAuthenticated } = useCurrentUser();



//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p>Loading...</p>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto py-10">
//       <h1 className="text-3xl font-bold mb-6">Test Platform</h1>
//       {isAuthenticated}

//       <Unauthenticated>
//         <SignInButton />
//       </Unauthenticated>
//       <Authenticated>
//         <UserButton />
//       </Authenticated>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Available Tests</CardTitle>
//             <CardDescription>Browse and take tests from various categories</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <p>Select a test from our collection to begin your assessment.</p>
//           </CardContent>
//           <CardFooter>
//             <Link href="/tests" className="w-full">
//               <Button className="w-full">Browse Tests</Button>
//             </Link>
//           </CardFooter>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>My Attempts</CardTitle>
//             <CardDescription>View your previous test attempts</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <p>Review your performance and track your progress over time.</p>
//           </CardContent>
//           <CardFooter>
//             <Link href="/my-attempts" className="w-full">
//               <Button className="w-full" variant="outline">
//                 View Attempts
//               </Button>
//             </Link>
//           </CardFooter>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Categories</CardTitle>
//             <CardDescription>Browse tests by category</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <p>Find tests organized by subject matter and difficulty level.</p>
//           </CardContent>
//           <CardFooter>
//             <Link href="/categories" className="w-full">
//               <Button className="w-full" variant="outline">
//                 View Categories
//               </Button>
//             </Link>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   )
// }


"use client"

import { useState } from "react"
import { motion } from "motion/react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, BookOpen, CheckCircle, BarChart, Brain, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useTheme } from "next-themes"
import { ModeToggle } from "@/components/theme-switcher"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme } = useTheme()

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
        staggerChildren: 0.2,
      },
    },
  }

  const categories = [
    {
      name: "Mathematics",
      icon: <BarChart className="h-6 w-6" />,
      subcategories: ["Algebra", "Calculus", "Geometry", "Statistics"],
    },
    {
      name: "Science",
      icon: <Brain className="h-6 w-6" />,
      subcategories: ["Physics", "Chemistry", "Biology", "Earth Science"],
    },
    {
      name: "Language Arts",
      icon: <BookOpen className="h-6 w-6" />,
      subcategories: ["Grammar", "Literature", "Vocabulary", "Writing"],
    },
  ]

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
            <Link href="#categories" className="text-sm font-medium hover:text-emerald-500 transition-colors">
              Categories
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-emerald-500 transition-colors">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-emerald-500 transition-colors">
              Testimonials
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
                href="#categories"
                className="text-sm font-medium hover:text-emerald-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium hover:text-emerald-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="#testimonials"
                className="text-sm font-medium hover:text-emerald-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </Link>
              <div className="flex items-center">
                <ModeToggle />
              </div>
              <Button>Get Started</Button>
            </div>
          </motion.div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/30 dark:to-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <motion.div
                className="md:w-1/2 mb-10 md:mb-0"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Master Any Test With <span className="text-emerald-500">Confidence</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg">
                  Practice thousands of MCQs across various subjects and track your progress with our intelligent
                  learning platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600">
                    Start Practicing
                  </Button>
                  <Button size="lg" variant="outline">
                    Explore Categories
                  </Button>
                </div>
              </motion.div>
              <motion.div
                className="md:w-1/2"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Image
                  src="/focused-learner-transparent.png"
                  width={600}
                  height={500}
                  alt="Student studying"
                  className="object-contain"
                  style={{
                    filter: "drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))",
                  }}
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section id="categories" className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Our Test Categories</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Browse through our extensive collection of tests organized by categories and subcategories
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
                          {category.icon}
                        </div>
                        <h3 className="text-xl font-bold">{category.name}</h3>
                      </div>

                      <ul className="space-y-2 mb-6">
                        {category.subcategories.map((sub, idx) => (
                          <motion.li
                            key={idx}
                            className="flex items-center"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * idx }}
                            viewport={{ once: true }}
                          >
                            <ChevronRight className="h-4 w-4 text-emerald-500 mr-2" />
                            <span>{sub}</span>
                          </motion.li>
                        ))}
                      </ul>

                      <Button variant="outline" className="w-full">
                        Explore {category.name}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-slate-50 dark:bg-slate-900/50">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How Skill Test Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our structured approach helps you master any subject through practice and repetition
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Choose a Category",
                  description: "Browse through our extensive library of test categories",
                  icon: "/minimal-folder.png",
                },
                {
                  title: "Select a Test",
                  description: "Pick from various tests organized by difficulty level",
                  icon: "/minimal-checklist-icon.png",
                },
                {
                  title: "Practice Questions",
                  description: "Answer MCQs and get instant feedback on your performance",
                  icon: "/minimal-question-mark.png",
                },
                {
                  title: "Track Progress",
                  description: "Monitor your improvement with detailed analytics",
                  icon: "/upward-trend-minimal.png",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="relative mb-6 mx-auto">
                    <div className="w-20 h-20 mx-auto relative">
                      <Image
                        src={step.icon || "/placeholder.svg"}
                        width={80}
                        height={80}
                        alt={step.title}
                        className="mx-auto dark:invert dark:opacity-80"
                      />
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-emerald-500"
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                        viewport={{ once: true }}
                      />
                    </div>
                    {index < 3 && (
                      <motion.div
                        className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-emerald-200"
                        initial={{ scaleX: 0, originX: 0 }}
                        whileInView={{ scaleX: 0.8 }}
                        transition={{ duration: 0.7, delay: index * 0.2 }}
                        viewport={{ once: true }}
                      />
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Structure Visualization - Improved */}
        <section className="py-20 bg-gradient-to-b from-white to-emerald-50 dark:from-background dark:to-emerald-950/30">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Structured Learning Path</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Navigate through our hierarchical content organization for efficient learning
              </p>
            </motion.div>

            <div className="max-w-5xl mx-auto">
              <motion.div
                className="relative"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                {/* Interactive structure visualization */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  {[
                    {
                      level: "Categories",
                      description: "Broad subject areas that organize all content",
                      examples: ["Mathematics", "Science", "Language Arts"],
                      icon: <BookOpen className="h-8 w-8" />,
                      color: "emerald",
                      count: "15+ Categories",
                    },
                    {
                      level: "Sub-Categories",
                      description: "Specific topics within each category",
                      examples: ["Algebra", "Calculus", "Geometry"],
                      icon: <ChevronRight className="h-8 w-8" />,
                      color: "teal",
                      count: "100+ Sub-Categories",
                    },
                    {
                      level: "Tests",
                      description: "Comprehensive assessments for each sub-category",
                      examples: ["Algebra Basics", "Advanced Algebra"],
                      icon: <CheckCircle className="h-8 w-8" />,
                      color: "cyan",
                      count: "500+ Tests",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <div className={`bg-${item.color}-500 h-2 w-full`}></div>
                      <div className="p-6">
                        <div
                          className={`bg-${item.color}-100 dark:bg-${item.color}-900/30 p-3 rounded-full inline-block mb-4`}
                        >
                          {item.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{item.level}</h3>
                        <p className="text-muted-foreground mb-4">{item.description}</p>
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 mb-4">
                          <p className="font-medium text-sm text-slate-500 dark:text-slate-400 mb-2">Examples:</p>
                          <ul className="space-y-1">
                            {item.examples.map((example, idx) => (
                              <motion.li
                                key={idx}
                                className="flex items-center text-sm"
                                initial={{ opacity: 0, x: -5 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + idx * 0.1 }}
                                viewport={{ once: true }}
                              >
                                <div className={`w-1.5 h-1.5 rounded-full bg-${item.color}-500 mr-2`}></div>
                                {example}
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                        <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{item.count}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Second row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:px-16">
                  {[
                    {
                      level: "Sections",
                      description: "Focused parts of a test targeting specific skills",
                      examples: ["Linear Equations", "Quadratic Equations", "Factoring"],
                      icon: <BarChart className="h-8 w-8" />,
                      color: "emerald",
                      count: "2,000+ Sections",
                    },
                    {
                      level: "Questions",
                      description: "Individual MCQs with detailed explanations",
                      examples: ["Multiple choice", "True/False", "Fill in the blanks"],
                      icon: <Brain className="h-8 w-8" />,
                      color: "teal",
                      count: "50,000+ Questions",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <div className={`bg-${item.color}-500 h-2 w-full`}></div>
                      <div className="p-6">
                        <div
                          className={`bg-${item.color}-100 dark:bg-${item.color}-900/30 p-3 rounded-full inline-block mb-4`}
                        >
                          {item.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{item.level}</h3>
                        <p className="text-muted-foreground mb-4">{item.description}</p>
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 mb-4">
                          <p className="font-medium text-sm text-slate-500 dark:text-slate-400 mb-2">Examples:</p>
                          <ul className="space-y-1">
                            {item.examples.map((example, idx) => (
                              <motion.li
                                key={idx}
                                className="flex items-center text-sm"
                                initial={{ opacity: 0, x: -5 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + idx * 0.1 }}
                                viewport={{ once: true }}
                              >
                                <div className={`w-1.5 h-1.5 rounded-full bg-${item.color}-500 mr-2`}></div>
                                {example}
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                        <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{item.count}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Connecting lines */}
                <div className="hidden md:block">
                  {/* Vertical line from first row to second row */}
                  <motion.div
                    className="absolute left-1/2 top-[calc(33%-30px)] h-[calc(67%+30px)] w-0.5 bg-emerald-200"
                    initial={{ height: 0 }}
                    whileInView={{ height: "calc(67% + 30px)" }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    viewport={{ once: true }}
                  />

                  {/* Horizontal lines in first row */}
                  <motion.div
                    className="absolute top-[33%] left-[calc(16.67%+20px)] h-0.5 w-[calc(66.67%-40px)] bg-emerald-200"
                    initial={{ width: 0 }}
                    whileInView={{ width: "calc(66.67% - 40px)" }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: true }}
                  />

                  {/* Horizontal line in second row */}
                  <motion.div
                    className="absolute top-[calc(100%-80px)] left-[calc(25%+20px)] h-0.5 w-[calc(50%-40px)] bg-emerald-200"
                    initial={{ width: 0 }}
                    whileInView={{ width: "calc(50% - 40px)" }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    viewport={{ once: true }}
                  />
                </div>
              </motion.div>

              <motion.div
                className="mt-16 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                viewport={{ once: true }}
              >
                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600">
                  Explore Our Content Structure
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 bg-slate-50 dark:bg-slate-900/50">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of satisfied students who have improved their test scores
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                {
                  name: "Alex Johnson",
                  role: "Medical Student",
                  content:
                    "Skill Test helped me prepare for my medical entrance exams. The structured approach and variety of questions were exactly what I needed.",
                  avatar: "/alex-avatar.jpg",
                },
                {
                  name: "Sarah Williams",
                  role: "High School Teacher",
                  content:
                    "I recommend Skill Test to all my students. The platform's organization makes it easy to assign relevant practice tests and track progress.",
                  avatar: "/confident-educator.png",
                },
                {
                  name: "Michael Chen",
                  role: "Engineering Graduate",
                  content:
                    "The technical questions on Skill Test are challenging and relevant. I credit my success in competitive exams to the regular practice on this platform.",
                  avatar: "/confident-asian-professional.png",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={fadeIn}
                  className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center mb-4">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      width={60}
                      height={60}
                      alt={testimonial.name}
                      className="rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="italic">"{testimonial.content}"</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              className="bg-emerald-500 text-white dark:bg-emerald-600 rounded-xl p-10 text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Ace Your Next Test?</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of students who are mastering subjects and improving their scores with Skill Test
              </p>
              <Button
                size="lg"
                className="bg-white text-emerald-500 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800"
              >
                Get Started For Free
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer - Improved */}
      <footer className="bg-slate-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <CheckCircle className="h-8 w-8 text-emerald-400" />
                <span className="font-bold text-2xl">Skill Test</span>
              </div>
              <p className="text-slate-400 mb-6 max-w-md">
                Your ultimate platform for test preparation and practice. We help students master subjects through
                structured learning paths and comprehensive practice tests.
              </p>
              <div className="flex space-x-4">
                {[
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-facebook"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    ),
                    label: "Facebook",
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-twitter"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                      </svg>
                    ),
                    label: "Twitter",
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-instagram"
                      >
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </svg>
                    ),
                    label: "Instagram",
                  },
                  {
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-linkedin"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect width="4" height="12" x="2" y="9" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    ),
                    label: "LinkedIn",
                  },
                ].map((social, idx) => (
                  <motion.a
                    key={idx}
                    href="#"
                    className="bg-slate-800 hover:bg-emerald-500 p-2 rounded-full transition-colors"
                    aria-label={social.label}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6 border-b border-slate-700 pb-2">Quick Links</h3>
              <ul className="space-y-3">
                {["Home", "About Us", "Pricing", "Contact", "FAQ"].map((item, idx) => (
                  <motion.li key={idx} whileHover={{ x: 3, transition: { duration: 0.2 } }}>
                    <Link
                      href="#"
                      className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center"
                    >
                      <ChevronRight className="h-4 w-4 mr-2" />
                      {item}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6 border-b border-slate-700 pb-2">Categories</h3>
              <ul className="space-y-3">
                {["Mathematics", "Science", "Language Arts", "Standardized Tests", "Professional Exams"].map(
                  (item, idx) => (
                    <motion.li key={idx} whileHover={{ x: 3, transition: { duration: 0.2 } }}>
                      <Link
                        href="#"
                        className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center"
                      >
                        <ChevronRight className="h-4 w-4 mr-2" />
                        {item}
                      </Link>
                    </motion.li>
                  ),
                )}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-6 border-b border-slate-700 pb-2">Newsletter</h3>
              <p className="text-slate-400 mb-4">Stay updated with new tests and features</p>
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-emerald-500 text-white"
                  />
                </div>
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600">Subscribe</Button>
                <p className="text-xs text-slate-500 mt-2">
                  By subscribing, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-400 text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} Skill Test. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <Link href="#" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                  Terms of Service
                </Link>
                <Link href="#" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
