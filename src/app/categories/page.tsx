import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

// This would normally fetch from your Convex database
const mockCategories = [
  {
    id: "cat1",
    name: "Clerk Exam",
    description: "Prepare for clerk exams with our comprehensive test series",
    subCategories: [
      { id: "sub1", name: "Memory Based Papers", count: 5 },
      { id: "sub2", name: "Practice Papers", count: 10 },
    ],
    createdAt: Date.now(),
  },
  {
    id: "cat2",
    name: "Banking Exams",
    description: "Tests for various banking and financial sector examinations",
    subCategories: [
      { id: "sub3", name: "SBI PO", count: 8 },
      { id: "sub4", name: "IBPS Clerk", count: 6 },
    ],
    createdAt: Date.now(),
  },
  {
    id: "cat3",
    name: "Civil Services",
    description: "Preparation material for civil services examinations",
    subCategories: [
      { id: "sub5", name: "Prelims", count: 12 },
      { id: "sub6", name: "Mains", count: 8 },
    ],
    createdAt: Date.now(),
  },
]

export default function CategoriesPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Test Categories</h1>
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCategories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <div className="h-40 relative bg-muted">
              <Image
                src={`/abstract-geometric-shapes.png?height=200&width=400&query=${category.name}`}
                alt={category.name}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle>{category.name}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-medium">Sub-categories:</p>
                <ul className="space-y-1">
                  {category.subCategories.map((sub) => (
                    <li key={sub.id} className="text-sm flex justify-between">
                      <span>{sub.name}</span>
                      <span className="text-muted-foreground">{sub.count} tests</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/categories/${category.id}`} className="w-full">
                <Button className="w-full">View Category</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
