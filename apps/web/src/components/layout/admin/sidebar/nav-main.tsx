"use client"

import { FileText, Link2, MoreHorizontal, Pencil, Plus, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { usePathname, useRouter } from "next/navigation"
import { ScrapeRecipeDialog } from "@/components/modals/scare-recipe-modal"

export function NavMain({
  items,
  disabled = false,
  activeBookId
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
  }[]
  disabled  ?: boolean
  activeBookId?: string
}) {
  const { isMobile } = useSidebar()
  const [isScrapeModalOpen, setIsScrapeModalOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  return (
    <>
      <SidebarMenu className="px-2">
        {items.map((item) => (
          <SidebarMenuItem key={item.title} >
            <SidebarMenuButton asChild  isActive={pathname === item.url} disabled={disabled}>
              <Link href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem key="Create">
          <SidebarMenuButton asChild isActive={false} disabled={false}>
            <Link href={`/admin/${activeBookId}/create`}>
              <Plus />
              <span>Create</span>
            </Link>
          </SidebarMenuButton>
          <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem  onClick={() => router.push(`/admin/${activeBookId}/create`)}>
                    <Pencil className="text-muted-foreground" />
                    <span>Create from scratch</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`/admin/${activeBookId}/create?template=true`)}>
                    <FileText className="text-muted-foreground" />
                    <span>Use recipe template</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsScrapeModalOpen(true)}>
                    <Link2 className="text-muted-foreground" />
                    <span>Import from URL</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
     {
      isScrapeModalOpen && (
        <ScrapeRecipeDialog 
          open={isScrapeModalOpen} 
          onOpenChange={setIsScrapeModalOpen}
          activeBookId={activeBookId || ""  }
        />
      )
     }
    </>
  )
}
