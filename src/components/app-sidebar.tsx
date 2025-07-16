"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  FolderTree,
  GraduationCap,
  Newspaper,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Sidebar, SidebarHeader, SidebarMenu, SidebarMenuButton, useSidebar } from "@/components/ui/sidebar"
import { PageRoutes } from "@/constants/page-routes"

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className={cn(state === "expanded" ? "p-4" : "p-2")}>
        <Link
          href={PageRoutes.HOME}>
          {state === "expanded" && <span className="font-semibold">
            Skill Test
          </span>}
        </Link>

      </SidebarHeader>

      <SidebarMenu className={cn(state === "expanded" ? "px-2" : "w-full flex items-center justify-center")}>
        <SidebarMenuButton
          asChild
          isActive={pathname.includes("/dashboard/topics")}
        >
          <Link href="/dashboard/topics" className="flex items-center gap-2">
            <BookOpen className="size-4" />
            <span>Topics</span>
          </Link>
        </SidebarMenuButton>
        <SidebarMenuButton
          asChild
          isActive={pathname.includes("/dashboard/categories")}
        >
          <Link href="/dashboard/categories" className="flex items-center gap-2">
            <FolderTree className="size-4" />
            <span>Categories</span>
          </Link>
        </SidebarMenuButton>

        <SidebarMenuButton
          asChild
          isActive={pathname.includes("/dashboard/subcategories")}
        >
          <Link href="/dashboard/subcategories" className="flex items-center gap-2">
            <BookOpen className="size-4" />
            <span>Sub Categories</span>
          </Link>
        </SidebarMenuButton>

        <SidebarMenuButton
          asChild
          isActive={pathname.includes("/dashboard/tests")}
        >
          <Link href="/dashboard/tests" className="flex items-center gap-2">
            <GraduationCap className="size-4" />
            <span>Tests</span>
          </Link>
        </SidebarMenuButton>
        <SidebarMenuButton
          asChild
          isActive={pathname.includes("/dashboard/news")}
        >
          <Link href="/dashboard/news" className="flex items-center gap-2">
            <Newspaper className="size-4" />
            <span>
              News
            </span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenu>
    </Sidebar>
  )
}
