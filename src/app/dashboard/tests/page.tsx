"use client";

import { useState } from "react"
import Link from "next/link"
import { Clock, Filter, Plus, Search, SortAsc } from "lucide-react"
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { Id } from "../../../../convex/_generated/dataModel";

export default function TestsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const tests = useQuery(api.tests.listWithDetails);
  const deleteTest = useMutation(api.tests.remove)

  if (tests === undefined) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tests Dashboard</h1>
            <p className="text-muted-foreground">Manage and create quiz tests for your students</p>
          </div>
          <Button className="shrink-0" disabled>
            <Plus className="mr-2 h-4 w-4" />
            Create New Test
          </Button>
        </div>
        <TableSkeleton columnCount={3} />
      </div>
    )
  }

  // Filter and sort tests
  const filteredTests = tests
    .filter(
      (test) =>
        test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.createdAt - a.createdAt
        case "oldest":
          return a.createdAt - b.createdAt
        case "name-asc":
          return a.name.localeCompare(b.name)
        case "name-desc":
          return b.name.localeCompare(a.name)
        case "questions":
          return b.totalQuestions - a.totalQuestions
        default:
          return 0
      }
    })

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleDelete = (testId: Id<"tests">) => {
    deleteTest({ id: testId })
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tests Dashboard</h1>
          <p className="text-muted-foreground">Manage and create quiz tests for your students</p>
        </div>
        <Button className="shrink-0" asChild>
          <Link href="/dashboard/tests/add">
            <Plus className="mr-2 h-4 w-4" />
            Create New Test
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tests..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="shrink-0">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem>All Tests</DropdownMenuItem>
              <DropdownMenuItem>Recently Updated</DropdownMenuItem>
              <DropdownMenuItem>No Time Limit</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] shrink-0">
              <SortAsc className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="questions">Most Questions</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {filteredTests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No tests found</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            We couldn&apos;t find any tests matching your search. Try adjusting your search terms.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <Card key={test._id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="line-clamp-1">{test.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {test.description || "No description provided"}
                    </CardDescription>
                  </div>
                  {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="-mr-2 -mt-2">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/tests/${test._id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Test
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Test
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu> */}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="rounded-full bg-primary/10 p-1">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span>{test.duration ? `${test.duration} min` : "No time limit"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className="font-medium">{test.totalQuestions}</span>
                    <span className="text-muted-foreground">questions</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5">
                  <span className="text-sm text-muted-foreground">Category:</span>
                  <span className="text-sm font-medium">{test.subCategory.name}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start pt-2 border-t">
                <div className="flex justify-between w-full text-xs text-muted-foreground">
                  <span>Created: {formatDate(test.createdAt)}</span>
                  <span>Updated: {formatDate(test.updatedAt)}</span>
                </div>
                <div className="flex justify-between w-full mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/tests/${test._id}/edit`}>Edit</Link>
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(test._id)}>
                    Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
