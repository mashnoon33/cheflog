"use client"

import { type LucideIcon } from "lucide-react"
import Link from "next/link"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
export function NavMain({
  items,
  disabled = false
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
  }[]
  disabled  ?: boolean
}) {
  const pathname = usePathname()
  return (
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
    </SidebarMenu>
  )
}
