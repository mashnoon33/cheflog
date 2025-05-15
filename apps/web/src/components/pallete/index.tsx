"use client"

import { api } from "@/trpc/react"
import { useRouter, useParams } from "next/navigation"
import * as React from "react"
import { useSession } from "next-auth/react"

import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

import { AdminActions } from "./admin-actions"
import { SearchResults } from "./search-results"

export function CommandPallete() {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const { status } = useSession()
  const params = useParams()
  const bookId = params.book as string | undefined
  const isAuthenticated = status === "authenticated"

  const {
    data: recipes,
    isLoading: recipesLoading,
  } = api.search.searchRecipes.useQuery(
    {
      query: search,
      includePrivate: isAuthenticated,
    },
    {
      enabled: open,
      retry: false,
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
      enabled: open,
      retry: false,
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

  const isLoading = recipesLoading || booksLoading
  const hasSearchQuery = search.length > 0
  const hasResults = (recipes?.length ?? 0) > 0 || (books?.length ?? 0) > 0

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder="Search recipes and books..." 
        value={search}
        onValueChange={setSearch}
      />
      <CommandList className="h-[300px]">
        <AdminActions 
          onClose={handleClose} 
          bookId={bookId}
          isAuthenticated={isAuthenticated}
        />
        <CommandSeparator />
        
        {isLoading && (
          <CommandEmpty>Loading...</CommandEmpty>
        )}
        
        {!isLoading && hasSearchQuery && !hasResults && (
          <CommandEmpty>No results found.</CommandEmpty>
        )}
        
        {!isLoading && (
          <SearchResults
            recipes={recipes}
            books={books}
            onClose={handleClose}
            isLoading={isLoading}
            hasSearchQuery={hasSearchQuery}
          />
        )}
      </CommandList>
    </CommandDialog>
  )
}
