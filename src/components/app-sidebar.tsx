"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  BookOpen,
  FolderTree,
  GraduationCap,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Sidebar, SidebarHeader, SidebarMenu, SidebarMenuButton, useSidebar } from "@/components/ui/sidebar"

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className={cn(state === "expanded" ? "p-4" : "p-2")}>


        <div className={cn(
          "flex items-center justify-center w-full",
          state === "expanded"
            ? "size-10 rounded-lg bg-primary text-primary-foreground"
            : "size-6 text-foreground p-0 mx-auto"
        )}>
          <GraduationCap className={state === "expanded" ? "size-5" : "size-4"} />
        </div>
        {state === "expanded" && <span className="font-semibold">Quiz Admin</span>}
      </SidebarHeader>

      <SidebarMenu className={cn(state === "expanded" ? "" : "w-full flex items-center justify-center")}>
        {/* <SidebarMenuButton
          asChild
          isActive={pathname === "/dashboard"}
        >
          <Link href="/dashboard" className="flex items-center gap-2 ">
            <LayoutGrid className="size-4" />
            <span>Dashboard</span>
          </Link>
        </SidebarMenuButton> */}

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
          isActive={pathname.includes("/dashboard/questions")}
        >
          <Link href="/dashboard/questions" className="flex items-center gap-2">
            <BarChart3 className="size-4" />
            <span>Questions</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenu>
    </Sidebar>
  )
}
