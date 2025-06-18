"use client"

import Link from "next/link"
import { useQuery } from "convex/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, Layers, Library, FileText, AlertTriangle, Home } from "lucide-react"
import TopicDetailsPageContainerLoading from "./loading" // Import loading component
import { Id } from "~/convex/_generated/dataModel"
import { api } from "~/convex/_generated/api"
import { motion } from "framer-motion"
import { fadeIn } from "@/constants/animations"

// Helper to get an icon for a category (can be expanded)
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase()
  if (name.includes("clerk")) return <FileText className="h-6 w-6 text-indigo-500" />
  if (name.includes("ssc")) return <Library className="h-6 w-6 text-sky-500" />
  if (name.includes("bank")) return <Library className="h-6 w-6 text-amber-500" />
  return <Layers className="h-6 w-6 text-gray-500" />
}

interface TopicDetailsPageContainerProps {
  id: string
}

export default function TopicDetailsPageContainer({ id }: TopicDetailsPageContainerProps) {
  const topicId = id as Id<"topics">
  const topicWithCategories = useQuery(api.topics.getTopicByIdWithCategories, { topicId })

  if (topicWithCategories === undefined) {
    return <TopicDetailsPageContainerLoading />
  }

  if (topicWithCategories === null) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Topic Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The topic you are looking for does not exist or may have been removed.
        </p>
        <Button asChild>
          <Link href="/topics">
            <Home className="mr-2 h-4 w-4" /> Back to All Topics
          </Link>
        </Button>
      </div>
    )
  }

  const { name, description, categories } = topicWithCategories

  return (
    <div className="bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/30 dark:to-background">
      <div className="container mx-auto px-4 py-12">
        <section className=" mb-7">
          <div className="container mx-auto">
            <motion.div initial="hidden" animate="visible" variants={fadeIn}>
              <div className="flex flex-wrap items-center text-sm text-muted-foreground mb-4 gap-2">
                <Link href="/" className="hover:text-emerald-500 transition-colors">
                  Home
                </Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/topics" className="hover:text-emerald-500 transition-colors">
                  Topics
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">{name}</span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{name}</h1>
                  <p className="text-muted-foreground max-w-2xl mb-4">
                    {description || "Explore various categories and sub-categories related to this topic."}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>


        {categories && categories.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-semibold mb-8">Categories in {name}</h2>

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Card
                  key={category._id}
                  className="flex flex-col hover:shadow-xl transition-shadow duration-300 ease-in-out dark:bg-slate-800/50"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-muted rounded-full">{getCategoryIcon(category.name)}</div>
                      <CardTitle className="text-xl font-semibold">{category.name}</CardTitle>
                    </div>
                    <CardDescription className="text-sm text-muted-foreground h-10 overflow-hidden">
                      {category.description || `Explore sub-categories and tests within ${category.name}.`}
                    </CardDescription>
                    <div className="flex flex-col mb-4">
                      {category?.subCategories?.length > 0 && category.subCategories.slice(0, 3).map((sub) => (
                        <div key={sub._id} className="flex items-center">
                          <ChevronRight className="h-4 w-4 text-muted-foreground mr-2" />
                          <Link
                            key={sub._id}
                            href={`/sub-categories/${sub._id}`}
                            className="text-sm text-emerald-600 hover:underline"
                          >
                            {sub.name}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-end">

                    <p className="text-sm text-muted-foreground mb-3">{category.subCategories.length || 0} Sub-categories</p>
                    <Button asChild className="w-full mt-auto">
                      <Link href={`/categories/${category._id}`}>
                        View Categories <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Layers className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Categories Found</h2>
            <p className="text-muted-foreground">{`There are currently no categories available under the "${name}" topic.`}</p>
          </div>
        )}
      </div>
    </div>
  )
}
