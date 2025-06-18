import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Search } from "lucide-react"

export default function TopicsPageLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <Skeleton className="h-12 w-3/4 md:w-1/2 mx-auto mb-4" />
        <Skeleton className="h-6 w-full max-w-xl mx-auto" />
      </header>

      <div className="mb-10 max-w-xl mx-auto">
        <div className="relative">
          <Skeleton className="w-full h-12 pl-10 pr-4 py-3 rounded-lg" />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-4 mb-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-7 w-3/4" />
              </div>
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-5/6" />
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-end">
              <Skeleton className="h-10 w-full mt-4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
