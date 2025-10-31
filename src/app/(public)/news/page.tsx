"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Calendar, ExternalLink, Search, Newspaper, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useQuery } from "convex/react"
import { api } from "~/convex/_generated/api"
import DOMPurify from "isomorphic-dompurify"
import { PageRoutes } from "@/constants/page-routes"

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch all published news
  const allNews = useQuery(api.news.getPublishedNews)
  const searchResults = useQuery(api.news.searchNews, { searchTerm })

  const displayNews = searchTerm ? searchResults : allNews

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

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    return `${Math.floor(days / 30)} months ago`
  }

  const sanitize = (html?: string) => {
    if (!html) return ""
    const clean = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        "p", "strong", "b", "em", "i", "u", "ul", "ol", "li", "br", "a", "span", "blockquote"
      ],
      ALLOWED_ATTR: ["href", "target", "rel", "class", "style"],
    })
    // Ensure links open safely in a new tab
    return clean.replace(
      /<a\s/gi,
      '<a target="_blank" rel="noopener noreferrer" '
    )
  }

  return (
    <div className="bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <Newspaper className="h-6 w-6 text-theme" />
                <h1 className="text-2xl font-bold">News & Updates</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <motion.div className="mb-8" initial="hidden" animate="visible" variants={fadeIn}>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search news articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-sm">
                {displayNews?.length || 0} articles
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* News Grid */}
        {displayNews === undefined ? (
          // Loading state
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                  </div>
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mt-4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : displayNews.length === 0 ? (
          // No news state
          <motion.div className="text-center py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Newspaper className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
              {searchTerm ? "No articles found" : "No news available"}
            </h3>
            <p className="text-slate-500 dark:text-slate-500 mb-4">
              {searchTerm
                ? `No articles match your search for "${searchTerm}"`
                : "Check back later for the latest updates and announcements."}
            </p>
            {searchTerm && (
              <Button onClick={() => setSearchTerm("")} variant="outline">
                Clear search
              </Button>
            )}
          </motion.div>
        ) : (
          // News grid
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {displayNews.map((article, index) => (
              <motion.div key={article._id} variants={fadeIn}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 ">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <CardTitle className="line-clamp-2 group-hover:text-theme transition-colors text-base">
                        {article.title}
                      </CardTitle>
                      {index < 3 && (
                        <Badge
                          variant="secondary"
                          className="bg-theme/20 text-theme dark:bg-theme/20 dark:text-theme flex-shrink-0 text-xs"
                        >
                          New
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(article.publishedAt || article.createdAt)}
                      </div>
                      <span className="text-xs">{getTimeAgo(article.publishedAt || article.createdAt)}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 line-clamp-5">
                    <div
                      className={`prose prose-sm dark:prose-invert text-muted-foreground mb-4 ${index === 0 ? "" : ""
                        }`}
                      // Renders proper HTML (bold, lists, line breaks, links)
                      dangerouslySetInnerHTML={{ __html: sanitize(article.description) }}
                    />
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full group-hover:bg-emerald-50 group-hover:border-emerald-200 dark:group-hover:bg-emerald-950 dark:group-hover:border-emerald-800 bg-transparent"
                    >
                      <Link href={PageRoutes.NEWS + "/" + article._id}>
                        Read More
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
