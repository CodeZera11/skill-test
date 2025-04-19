"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/theme-switcher"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

const getBreadcrumbTitle = (path: string) => {
  const parts = path.split("/").filter(Boolean)
  const lastPart = parts[parts.length - 1]
  if (!lastPart) return "Dashboard"

  // Handle dynamic routes
  if (lastPart.startsWith("[") && lastPart.endsWith("]")) {
    return "Edit"
  }

  // Capitalize and clean up the path
  return lastPart.charAt(0).toUpperCase() + lastPart.slice(1)
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const title = getBreadcrumbTitle(pathname)

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full ">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b justify-between">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb className="">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage>{title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4">
              <ModeToggle />
            </div>
          </header>
          <main className="flex-1 w-full">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
