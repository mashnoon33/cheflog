import { FileText, Plus, LayoutDashboard } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import type { AdminActionsProps } from "./types"

export function AdminActions({ onClose, bookId, isAuthenticated }: AdminActionsProps) {
  const router = useRouter()

  if (!isAuthenticated) {
    return null
  }

  return (
    <CommandGroup heading="Admin">
      <CommandItem
        value="Create from template"
        onSelect={() => {
          router.push(`/admin/${bookId}/create?template=true`)
          onClose()
        }}
      >
        <FileText className="mr-1 h-3 w-3 shrink-0 text-muted-foreground" />
        <span>Create from template {bookId ? `in ${bookId}` : ""}</span>
      </CommandItem>
      <CommandItem
        value="Create new recipe"
        onSelect={() => {
          router.push(`/admin/${bookId}/create`)
          onClose()
        }}
      >
        <Plus className="mr-1 h-3 w-3 shrink-0" />
        <span>Create new recipe {bookId ? `in ${bookId}` : ""}</span>
      </CommandItem>
      <CommandItem
        value="Dashboard"
        onSelect={() => {
          router.push(`/admin/${bookId}`)
          onClose()
        }}
      >
        <LayoutDashboard className="mr-1 h-3 w-3 shrink-0 text-muted-foreground" />
        <span>Admin Dashboard</span>
      </CommandItem>
    </CommandGroup>
  )
} 