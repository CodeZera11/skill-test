"use client";

import { useEffect, useState } from "react"
import Link from "next/link"
import { CircleHelp, Clock, Filter, Plus, Search, SortAsc } from "lucide-react"
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns";
import { TSortOrder } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function TestsPage() {
  const [inputValue, setInputValue] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<TSortOrder>("asc")

  useEffect(() => {
    if (inputValue.length === 0) {
      setSearchQuery("")
      return
    }

    if (inputValue.length > 0) {
      const timer = setTimeout(() => {
        setSearchQuery(inputValue)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [inputValue])

  const tests = useQuery(api.tests.listWithDetails, {
    searchQuery,
    sortOrder
  });
  const deleteTest = useMutation(api.tests.remove)

  console.log("tests", tests)

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
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
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

          <Select value={sortOrder} onValueChange={(val: TSortOrder) => setSortOrder(val)}>
            <SelectTrigger className="w-[180px] shrink-0">
              <SortAsc className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {(tests === null || tests?.length === 0) ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No tests found</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            We couldn&apos;t find any tests matching your search. Try adjusting your search terms.
          </p>
        </div>
      ) : tests == undefined ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }, (_, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="w-full space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5">
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start pt-2 border-t">
                <div className="flex justify-between w-full text-xs text-muted-foreground">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <div className="flex justify-between w-full mt-4">
                  <Skeleton className="h-8 w-1/6" />
                  <Skeleton className="h-8 w-1/6" />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests?.map((test) => (
            <Card key={test._id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="line-clamp-1">{test.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {test.description || "No description provided"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-emerald-500" />
                    <p>{test.duration ? `${test.duration} min` : "No time limit"}</p>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <CircleHelp className="h-3.5 w-3.5 text-blue-500" />
                    <span className="font-medium">{test.totalQuestions}</span>
                    <span className="text-muted-foreground">questions</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5">
                  {/* <span className="text-sm text-muted-foreground">Sub-Category:</span> */}
                  <Badge variant="secondary" className="text-sm font-medium">{test.subCategory.name}</Badge>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start pt-2 border-t">
                <div className="flex justify-between w-full text-xs text-muted-foreground">
                  <p>Updated: <span className="text-foreground">{format(test.updatedAt, "dd MMMM yy, hh:mm a")}</span></p>
                  <p>Created: <span className="text-foreground">{format(test.createdAt, "dd MMMM yy, hh:mm a")}</span></p>
                </div>
                <div className="flex justify-between w-full mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/tests/${test._id}/edit`}>Edit</Link>
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteTest({ id: test._id })}>
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
