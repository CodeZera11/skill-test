"use client"

import Link from "next/link"
import { useQuery } from "convex/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Layers3, ChevronRight } from "lucide-react"
import { useState, useMemo } from "react"
import TopicsPageLoading from "./loading"
import { api } from "~/convex/_generated/api"

export default function TopicsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const allTopics = useQuery(api.topics.list, {
    onlyPublished: true
  })

  const topicsToDisplay = useMemo(() => {
    if (!allTopics) return []
    if (!searchTerm) return allTopics

    return allTopics.filter(topic =>
      topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (topic.description && topic.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [searchTerm, allTopics])

  const isLoading = allTopics === undefined

  if (isLoading) {
    return <TopicsPageLoading />
  }

  return (
    <div className="px-4 py-12 bg-gradient-to-b from-theme/20 to-white dark:from-theme/30 dark:to-background">
      <div className="mx-auto container">
        <header className="mb-12 text-center ">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Explore Exam Topics</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Dive into a wide array of exam topics, each structured to guide you through comprehensive categories and
            tests.
          </p>
        </header>

        <div className="mb-10 max-w-xl mx-auto">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for topics (e.g., Banking, SSC CGL)..."
              className="w-full pl-10 pr-4 py-3 rounded-lg text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        {topicsToDisplay && topicsToDisplay.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topicsToDisplay.map((topic) => (
              <Card
                key={topic._id}
                className="flex flex-col hover:shadow-xl transition-shadow duration-300 ease-in-out dark:bg-slate-800/50"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4 mb-3">
                    <CardTitle className="text-2xl font-semibold">{topic.name}</CardTitle>
                  </div>
                  <CardDescription className="text-sm text-muted-foreground h-12 overflow-hidden">
                    {topic.description || "Explore various categories and tests under this topic."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-end">
                  <Button asChild className="w-full mt-auto bg-theme hover:bg-theme/90 text-white">
                    <Link href={`/topics/${topic._id}`}>
                      Explore Topic <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Layers3 className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Topics Found</h2>
            <p className="text-muted-foreground">
              {searchTerm
                ? `No topics match your search "${searchTerm}". Try a different term.`
                : "It seems there are no topics available at the moment. Please check back later."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}