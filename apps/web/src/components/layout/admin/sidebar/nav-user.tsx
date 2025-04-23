"use client"

import {
  BadgeCheck,
  ChevronsUpDown,
  CreditCard,
  ExternalLink,
  LogOut,
  Sparkles,
  Upload
} from "lucide-react"
import { useRef } from "react"
import { toast } from "sonner"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { api } from "@/trpc/react"
import { signOut } from "next-auth/react"
import { useEffect } from "react"
import { createZipFromBooks, downloadZip, processZipFile } from "./utils"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const {mutate: initExportData, data: exportData} = api.admin.exportData.useMutation()
  const {mutate:createBook} = api.book.create.useMutation({
    onSuccess: (book) => {
      toast.success("Book created successfully!")
    },
    onError: (error) => {
      if (error.message.includes("Unique constraint")) {
        toast.error("Book already exists")
      } else {
        toast.error(`Failed to create book: ${error.message}`)
      }
    }
  }) 
  const {mutate: createRecipe} = api.recipe.create.useMutation({
    onSuccess: () => {
      toast.success("Recipe created successfully!")
    },
    onError: (error) => {
      toast.error(`Failed to create recipe: ${error.message}`)
    }
  })

  const handleExportData = () => {
    initExportData()
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      console.log('No file selected')
      return
    }

    const result = await processZipFile(
      file,
      (params) => new Promise((resolve, reject) => {
        createBook(params, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error)
        })
      }),
      (params) => new Promise((resolve, reject) => {
        createRecipe(params, {
          onSuccess: () => resolve(),
          onError: (error) => reject(error)
        })
      })
    )

    if (result.success) {
      toast.success("Import completed successfully!")
    } else {
      toast.error(`Failed to import data: ${result.error}`)
    }
  }

  useEffect(() => {
    if (exportData) {
      const zip = createZipFromBooks(exportData)
      downloadZip(zip)
    }
  }, [exportData])

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".zip"
        className="hidden"
        onChange={handleImportData}
      />
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Sparkles />
                  Upgrade to Pro
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportData}>
                  <ExternalLink />
                  Export Data
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleImportClick}>
                  <Upload />
                  Import Data
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  )
}
