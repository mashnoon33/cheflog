"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  ExternalLink,
  LogOut,
  Sparkles,
  Upload,
} from "lucide-react"
import JSZip, { JSZipObject } from "jszip"
import type { inferRouterOutputs } from "@trpc/server"
import type { AppRouter } from "@/server/api/root"
import { toast } from "sonner"
import { useRef } from "react"

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
import { signOut } from "next-auth/react"
import { api } from "@/trpc/react"
import { useEffect } from "react"

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
    console.log('Importing data')
    const file = event.target.files?.[0]
    if (!file) {
      console.log('No file selected')
      return
    }

    try {
      console.log('Starting import of file:', file.name)
      const zip = new JSZip()
      const content = await zip.loadAsync(file)
      console.log('Successfully loaded zip file')
      
      // Process each folder (book) in the ZIP
      for (const [folderName, folder] of Object.entries(content.files)) {
        const folderObj = folder as JSZipObject
        if (folderObj.dir) {
          console.log('Processing folder:', folderName)
          // Create a slug from the folder name
          const slug = folderName.toLowerCase().replace(/[^a-z0-9]+/g, '')
          console.log('Created slug:', slug)
          
          // Create a new book
          console.log('Creating book with name:', folderName)
          try {
            await new Promise<void>((resolve, reject) => {
              createBook({ 
                name: slug,
                slug,
              }, {
                onSuccess: () => {
                  console.log('Book created successfully:', folderName)
                  resolve()
                },
                onError: (error) => {
                  if (error.message.includes("Unique constraint")) {
                    console.log('Book already exists, continuing with import:', folderName)
                    resolve() // Continue even if book exists
                  } else {
                    console.error('Failed to create book:', error)
                    reject(error)
                  }
                }
              })
            })
            
            // Get the folder and process its files
            const bookFolder = content.folder(folderName)
            if (bookFolder) {
              console.log('Processing files in folder:', folderName)
              const filePromises: Promise<void>[] = []
              bookFolder.forEach((relativePath, file) => {
                if (!file.dir) {
                  console.log('Processing file:', relativePath)
                  const filePromise = file.async('text').then(content => {
                    console.log('Creating recipe from file:', relativePath)
                    return new Promise<void>((resolve, reject) => {
                      createRecipe({
                        bookId: slug,
                        markdown: content,
                      }, {
                        onSuccess: () => {
                          console.log('Recipe created successfully:', relativePath)
                          resolve()
                        },
                        onError: (error) => {
                          console.error('Failed to create recipe:', error)
                          reject(error)
                        }
                      })
                    })
                  })
                  filePromises.push(filePromise)
                }
              })
              await Promise.all(filePromises)
            }
          } catch (error) {
            console.error('Error processing book:', folderName, error)
            toast.error(`Failed to process book: ${folderName}`)
          }
        }
      }
      console.log('Import completed successfully')
      toast.success("Import completed successfully!")
    } catch (error) {
      console.error('Error importing data:', error)
      console.error('Stack trace:', error instanceof Error ? error.stack : '')
      toast.error("Failed to import data")
    }
  }

  useEffect(() => {
    if (exportData) {
      const zip = new JSZip()
      
      exportData.forEach((book) => {
        if (book.id) {
          const bookFolder = zip.folder(book.id)
          if (bookFolder) {
            book.recipes.forEach((recipe) => {
              const fileName = `${recipe.slug || recipe.id}.md`
              bookFolder.file(fileName, recipe.markdown)
            })
          }
        }
      })

      zip.generateAsync({ type: "blob" })
        .then((content: Blob) => {
          const url = window.URL.createObjectURL(content)
          const a = document.createElement("a")
          a.href = url
          a.download = "recipes-export.zip"
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
        })
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
