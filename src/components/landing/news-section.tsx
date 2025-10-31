"use client"

import { fadeIn, staggerContainer } from "@/constants/animations"
import { useQuery } from "convex/react"
import { Calendar, ChevronRight, ExternalLink, Newspaper } from "lucide-react"
import { motion } from "motion/react"
import { api } from "~/convex/_generated/api"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import Link from "next/link"
import DOMPurify from "isomorphic-dompurify"
import { PageRoutes } from "@/constants/page-routes"

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const NewsSection = () => {
  const latestNews = useQuery(api.news.getLatestNews, { limit: 6 })

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


  if (latestNews === undefined) {
    // Loading state
    return (
      <section id="news" className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="flex items-center justify-center mb-4">
              <Newspaper className="h-8 w-8 text-theme mr-3" />
              <h2 className="text-3xl md:text-4xl font-bold">Latest News & Updates</h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay updated with the latest exam notifications, results, and important announcements
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
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
        </div>
      </section>
    )
  }

  if (latestNews.length === 0) {
    // No news state
    return (
      <section id="news" className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center py-12 border rounded-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <Newspaper className="h-16 w-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No News Available</h3>
            <p>Check back later for the latest updates and announcements.</p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="news" className="py-20  border-t bg-gradient-to-t from-theme/15 to-white dark:from-theme/30 dark:to-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className="flex items-center justify-center mb-4">
            <Newspaper className="h-8 w-8 text-theme mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold">Latest News & Updates</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest exam notifications, results, and important announcements
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
        >
          {latestNews.map((article, index) => (
            <div
              key={article._id}
              className={`${index === 0 ? "md:col-span-2 lg:col-span-1" : ""}`}
            >
              <Card
                className={`h-full hover:shadow-lg transition-all duration-300 ${index === 0 ? "border-theme/40 dark:border-theme/60" : ""
                  }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle
                      className={`line-clamp-2 group-hover:text-theme transition-colors ${index === 0 ? "text-lg" : "text-base"
                        }`}
                    >
                      {article.title}
                    </CardTitle>
                    {index === 0 && (
                      <Badge
                        variant="secondary"
                        className="bg-theme/10 text-theme dark:bg-theme/70 dark:text-white flex-shrink-0"
                      >
                        Latest
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(article.publishedAt || article.createdAt)}
                  </div>
                </CardHeader>
                {/* <CardContent className="pt-0">
                  <p className={`text-muted-foreground mb-4 ${index === 0 ? "line-clamp-4" : "line-clamp-3"}`}>
                    {article.description}
                  </p>
                </CardContent> */}

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
            </div>
          ))}
        </motion.div>

        {/* View All News Button */}
        {latestNews && latestNews.length > 0 && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Button asChild size="lg" variant="outline">
              <Link href="/news">
                View All News
                <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default NewsSection