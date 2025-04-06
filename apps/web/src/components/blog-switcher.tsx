"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"
import { useRouter, useParams } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { CreateBlogDialog } from "@/components/modals/create-blog-dialog"

export function BlogSwitcher({
  blogs,
  onBlogChange,
}: {
  blogs: {
    name: string
    logo: React.ElementType
    subtitle: string
  }[]
  onBlogChange: (blogId: string) => void
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const params = useParams()
  const currentBlogId = params.blog as string
  const activeBlog = blogs.find(blog => blog.name === currentBlogId) || blogs[0]
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)

  const handleCreateBlog = () => {
    setIsCreateDialogOpen(true)
  }
  
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {activeBlog && (
                <>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <activeBlog.logo className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {activeBlog.name}
                    </span>
                    <span className="truncate text-xs">{activeBlog.subtitle}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Blogs
            </DropdownMenuLabel>
            {blogs.map((blog, index) => (
              <DropdownMenuItem
                key={blog.name}
                onClick={() => {
                  onBlogChange(blog.name)
                  router.push(`/admin/${blog.name}`)
                }}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <blog.logo className="size-4 shrink-0" />
                </div>
                {blog.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2"  onClick={handleCreateBlog}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Create Blog</div>
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
      <CreateBlogDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </SidebarMenu>
  )
}