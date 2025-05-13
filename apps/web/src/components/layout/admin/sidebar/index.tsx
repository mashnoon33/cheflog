"use client"

import * as React from "react"
import { useSession } from "next-auth/react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { api } from "@/trpc/react"
import { Home, Plus, BookOpen, ArrowUpRight } from "lucide-react"
import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation";
import { BookSwitcher } from "./book-switcher"
import { NavMain } from "./nav-main"
import { NavRecipies } from "./nav-projects"
import { NavUser } from "./nav-user"



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const router = useRouter()
  const { data: books = [] } = api.book.getAll.useQuery()
  const [activeBookId, setActiveBookId] = React.useState("")
  const { data: recipes = [] } = api.recipe.getAll.useQuery({ bookId: activeBookId, draft: true }, {
    enabled: !!activeBookId
  })
  const params = useParams()

  // Update active book when books are loaded
  useEffect(() => {
    if (books.length > 0 && !activeBookId) {
      const firstBook = books[0]
      if (firstBook) {
        setActiveBookId(firstBook.id)
      }
    }
  }, [books, activeBookId])

  const navItems = [
    {
      title: "Home",
      url: activeBookId ? `/admin/${activeBookId}` : "/",
      icon: Home,
    },
    {
      title: "Create Recipe",
      url: `/admin/${activeBookId}/create`,
      icon: Plus,
    },
    {
      title: "Public site",
      url: `/${activeBookId}`,
      icon: ArrowUpRight,
    }
  ]
  const recipeItems = recipes.map((recipe) => ({
    id: recipe.id,
    bookId: recipe.bookId,
    name: recipe.metadata?.name || "Untitled Recipe",
    url: `/admin/${activeBookId}/${recipe.id}`,
    latestVersion: recipe.version || 1,
    draft: recipe.draft,
    public: recipe.public
  }))

  const handleBookChange = (bookId: string) => {
    setActiveBookId(bookId)
    router.push(`/${bookId}`)
  }

  useEffect(() => {
    const currentBookId = params.book as string
    setActiveBookId(currentBookId)
  }, [params.book])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <BookSwitcher
          books={books.map((book) => ({
            name: book.id,
            logo: BookOpen,
            subtitle: `${book.recipes.length} recipes`
          }))}
          onBookChange={handleBookChange}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} disabled={!activeBookId} />
        <NavRecipies recipes={recipeItems} />
      </SidebarContent>
      <SidebarFooter>
        {session?.user && (
          <NavUser user={{
            name: session.user.name || "",
            email: session.user.email || "",
            avatar: session.user.image || "",
          }} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
