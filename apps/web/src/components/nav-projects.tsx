"use client"

import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  Pencil,
  type LucideIcon,
} from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { api } from "@/trpc/react"
import { toast } from "sonner"
import { ReactElement } from "react"

export function NavRecipies({
  recipes,
}: {
  recipes: {
    id: string
    blogId: string
    name: string
    url: string
    icon: ReactElement
  }[]
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const pathname = usePathname()
  const utils = api.useUtils()
  const { mutate: deleteRecipe } = api.recipe.delete.useMutation({
    onSuccess: async () => {
      await utils.recipe.getAll.invalidate();
      toast.success("Recipe deleted successfully!")
      router.push(`/admin/${recipes[0]?.blogId}`)
    },
  })
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Recipes</SidebarGroupLabel>
      <SidebarMenu>
        {recipes.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild isActive={pathname.includes(item.url)}>
              <div className="cursor-pointer" onClick={() => router.push(item.url)}>
                {item.icon}
                <span>{item.name}</span>
              </div>
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
                <DropdownMenuItem onClick={() => router.push(item.url)}>
                  <Folder className="text-muted-foreground" />
                  <span>View Recipe</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`${item.url}/edit`)}>
                  <Pencil className="text-muted-foreground" />
                  <span>Edit Recipe</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Share Recipe</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => deleteRecipe({ id: item.id, blogId: item.blogId })}>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Recipe</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
