import { Book, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command"
import type { SearchResultsProps, Book as BookType, Recipe } from "./types"

interface RecipeResultsProps extends SearchResultsProps {
  recipes: Recipe[] | undefined
}

interface BookResultsProps extends SearchResultsProps {
  books: BookType[] | undefined
}

export function RecipeResults({ recipes, onClose }: RecipeResultsProps) {
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

export function BookResults({ books, onClose }: BookResultsProps) {
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

export function SearchResults({ 
  recipes, 
  books, 
  onClose,
  isLoading,
  hasSearchQuery
}: SearchResultsProps & { 
  recipes: Recipe[] | undefined
  books: BookType[] | undefined
  isLoading: boolean
  hasSearchQuery: boolean
}) {
  if (isLoading) {
    return null // Loading state is handled by parent
  }

  if (!hasSearchQuery) {
    return null
  }

  if (!recipes?.length && !books?.length) {
    return null // Empty state is handled by parent
  }

  return (
    <>
      <BookResults books={books} onClose={onClose} />
      {(books?.length ?? 0) > 0 && (recipes?.length ?? 0) > 0 && <CommandSeparator />}
      <RecipeResults recipes={recipes} onClose={onClose} />
    </>
  )
} 