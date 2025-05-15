import type { RouterOutputs } from "@/trpc/react"

export type Book = RouterOutputs["search"]["searchBooks"][number]
export type Recipe = RouterOutputs["search"]["searchRecipes"][number]

export interface SearchResultsProps {
  onClose: () => void
}

export interface AdminActionsProps extends SearchResultsProps {
  bookId?: string
  isAuthenticated: boolean
} 