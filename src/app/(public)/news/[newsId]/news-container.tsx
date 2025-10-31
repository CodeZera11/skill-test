"use client"

import { useQuery } from "convex/react"
import { api } from "~/convex/_generated/api"
import { Id } from "~/convex/_generated/dataModel"
import DOMPurify from "isomorphic-dompurify"
import Link from "next/link"
import { Calendar, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { PageRoutes } from "@/constants/page-routes"

const sanitizeHtml = (html?: string) => {
  if (!html) return ""
  const clean = DOMPurify.sanitize(html, {
    // allow only sensible content tags
    ALLOWED_TAGS: [
      "p", "strong", "b", "em", "i", "u", "a", "ul", "ol", "li", "br", "span", "blockquote"
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "class", "style"],
    // OPTIONAL: strip inline styles if you don’t trust upstream
    // FORBID_ATTR: ["style"],
  })

  // Ensure external links are safe + open in new tab
  // (only adds attributes if missing)
  return clean.replace(
    /<a\s/gi,
    '<a target="_blank" rel="noopener noreferrer nofollow" '
  )
}

const NewsContainer = ({ newsId }: { newsId: Id<"news"> }) => {

  const article = useQuery(api.news.getNewsById, { id: newsId });


  if (article === undefined) {
    return (
      <div className="h-[calc(100vh-75px)] flex items-center justify-center ">
        Loading...
      </div>
    )
  }

  if (article === null) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">News not found</h1>
        <Link href="/tests">
          <Button>Back to News Page</Button>
        </Link>
      </div>
    )
  }

  const date = format(new Date(article.publishedAt || ""), "MMMM dd, yyyy")

  return (
    <section className="py-10">

      <div className="container mx-auto px-4">

        <Button variant="outline" className="mb-6" asChild>
          <Link href={PageRoutes.NEWS}>← Back to News Page</Link>
        </Button>
        <Card className="mx-auto ">
          <CardHeader className="space-y-2">
            <div className="flex items-start gap-3">
              <CardTitle className="text-2xl md:text-3xl leading-snug">
                {article.title}
              </CardTitle>
            </div>
            {date && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{date}</span>
              </div>
            )}
          </CardHeader>

          <CardContent>
            {/* The prose classes make HTML look nice; the prose-a:* ensure links look like links */}
            <div
              className="
              prose prose-lg dark:prose-invert
              prose-a:underline prose-a:text-blue-600 hover:prose-a:text-blue-700
              prose-blockquote:border-l-4 prose-blockquote:border-muted
              max-w-none
            "
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.description) }}
            />
            {article.externalLink && (
              <div className="mt-6">
                <Link href={article.externalLink} target="_blank" className="inline-flex items-center gap-2 text-sm">
                  Read original <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default NewsContainer