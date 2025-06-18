import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function TopicDetailPageLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-12">
        <div className="text-sm mb-4 flex space-x-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-2" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-2" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-12 w-3/4 md:w-1/2 mb-3" />
        <Skeleton className="h-6 w-full max-w-2xl" />
      </header>

      <div>
        <Skeleton className="h-8 w-1/3 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-6 w-3/4" />
                </div>
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-5/6" />
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-end">
                <Skeleton className="h-4 w-1/2 mb-3" />
                <Skeleton className="h-10 w-full mt-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
