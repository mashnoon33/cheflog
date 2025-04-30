"use client"

import type { RouterOutputs } from "@/trpc/react"
import { api } from "@/trpc/react"
import { Book, FileText, Plus, LayoutDashboard, Link } from "lucide-react"
import { useRouter, usePathname, useParams } from "next/navigation"
import * as React from "react"
import { useSession } from "next-auth/react"

type Book = RouterOutputs["search"]["searchBooks"][number]

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

function RecipeResults({ recipes, onClose }: { recipes: RouterOutputs["search"]["searchRecipes"] | undefined, onClose: () => void }) {
  const router = useRouter()
  


  if (!recipes?.length) {
    return null
  }

  return (
    <CommandGroup heading="Recipes">
      {recipes.map((recipe) => (
        <CommandItem
          key={`recipe-${recipe.recipe.id}`}
          value={`${recipe.recipe.id}`}
          keywords={[recipe.recipe.slug ?? "", "recipe"]}
          onSelect={() => {
            router.push(`/${recipe.recipe.book.id}/${recipe.recipe.slug ?? recipe.recipe.id}`)
            onClose()
          }}
          className="whitespace-nowrap"
        >
          <FileText className="mr-1 h-3 w-3 shrink-0 text-muted-foreground" />
          <span className="truncate">{recipe.name}</span>
            <span className="ml-2 text-sm text-muted-foreground shrink-0">
              @{recipe.recipe.createdBy.handle}/{recipe.recipe.book.id}
            </span>
        </CommandItem>
      ))}
    </CommandGroup>
  )
}

function BookResults({ books, onClose }: { books: RouterOutputs["search"]["searchBooks"] | undefined, onClose: () => void }) {
  const router = useRouter()

  if (!books?.length) {
    return null
  }

  return (
    <CommandGroup heading="Books">
      {books.map((book) => (
        <CommandItem
          key={`book-${book.id}`}
          value={book.name ?? ""}
          keywords={[`${book._count.recipes} recipes`, "book"]}
          onSelect={() => {
            router.push(`/admin/${book.id}`)
            onClose()
          }}
          className="whitespace-nowrap"
        >
          <Book className="mr-1 h-3 w-3 shrink-0 text-muted-foreground" />
          <span className="truncate">{book.name}</span>
          <span className="ml-2 text-sm text-muted-foreground shrink-0">
            {book._count.recipes} recipes
          </span>
        </CommandItem>
      ))}
    </CommandGroup>
  )
}

function AdminActions({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const { data: session } = useSession()
  const params = useParams()
  const book = params.book as string | undefined
  if (!session?.user) {
    return null
  }

  return (
    <CommandGroup heading="Admin">

      <CommandItem
        value="Create from template"
        onSelect={() => {
          router.push(`/admin/${book}/create?template=true`)
          onClose()
        }}
      >
        <FileText className="mr-1 h-3 w-3 shrink-0 text-muted-foreground" />
        <span>Create from template</span>
      </CommandItem>
      <CommandItem
        value="Create new recipe"
        onSelect={() => {
          router.push(`/admin/${book}/create`)
          onClose()
        }}
      >
        <Plus className="mr-1 h-3 w-3 shrink-0" />
        <span>Create new recipe</span>
      </CommandItem>
      <CommandItem
        value="Dashboard"
        onSelect={() => {
          router.push(`/admin/${book}`)
          onClose()
        }}
      >
        <LayoutDashboard className="mr-1 h-3 w-3 shrink-0 text-muted-foreground" />
        <span>Admin Dashboard</span>
      </CommandItem>
    </CommandGroup>
  )
}

export function CommandPallete() {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const {
    data: recipes,
    isLoading: recipesLoading,
  } = api.search.searchRecipes.useQuery(
    {
      query: search,
      includePrivate: true,
    },
    {
      enabled: true,
    }
  )

  const {
    data: books,
    isLoading: booksLoading,
  } = api.search.searchBooks.useQuery(
    {
      query: search,
    },
    {
      enabled: true,
    }
  )

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleClose = () => {
    setOpen(false)
    setSearch("")
  }

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search recipes and books..." 
          value={search}
          onValueChange={setSearch}
        />
        <CommandList className="h-[300px]">
          <AdminActions onClose={handleClose} />
          <CommandSeparator />
          {(recipesLoading || booksLoading) && (
            <CommandEmpty>Loading...</CommandEmpty>
          )}
          {!recipesLoading && !booksLoading && !recipes?.length && !books?.length && search && (
            <CommandEmpty>No results found.</CommandEmpty>
          )}
          {!recipesLoading && !booksLoading && (
            <>
              <BookResults books={books} onClose={handleClose} />
              {(books?.length ?? 0) > 0 && (recipes?.length ?? 0) > 0 && <CommandSeparator />}
              <RecipeResults recipes={recipes} onClose={handleClose} />
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
