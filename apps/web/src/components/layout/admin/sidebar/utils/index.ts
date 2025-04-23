import JSZip, { JSZipObject } from "jszip"

interface Book {
  id: string
  recipes: {
    id: string
    slug: string | null
    markdown: string
    createdAt: Date
    updatedAt: Date
    public: boolean
    version: number
    metadataId: string | null
    createdById: string
    bookId: string
    draft: boolean
  }[]
}

interface ImportResult {
  success: boolean
  error?: string
}

export const createZipFromBooks = (books: Book[]): JSZip => {
  const zip = new JSZip()
  
  books.forEach((book) => {
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

  return zip
}

export const downloadZip = async (zip: JSZip, filename: string = "recipes-export.zip"): Promise<void> => {
  const content = await zip.generateAsync({ type: "blob" })
  const url = window.URL.createObjectURL(content)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

export const processZipFile = async (
  file: File,
  createBook: (params: { name: string; slug: string }) => Promise<void>,
  createRecipe: (params: { bookId: string; markdown: string }) => Promise<void>
): Promise<ImportResult> => {
  try {
    const zip = new JSZip()
    const content = await zip.loadAsync(file)
    
    for (const [folderName, folder] of Object.entries(content.files)) {
      const folderObj = folder as JSZipObject
      if (folderObj.dir) {
        const slug = folderName.toLowerCase().replace(/[^a-z0-9]+/g, '')
        
        try {
          await createBook({ 
            name: slug,
            slug,
          })
          
          const bookFolder = content.folder(folderName)
          if (bookFolder) {
            const filePromises: Promise<void>[] = []
            bookFolder.forEach((relativePath, file) => {
              if (!file.dir) {
                const filePromise = file.async('text').then(content => {
                  return createRecipe({
                    bookId: slug,
                    markdown: content,
                  })
                })
                filePromises.push(filePromise)
              }
            })
            await Promise.all(filePromises)
          }
        } catch (error) {
          if (error instanceof Error && error.message.includes("Unique constraint")) {
            console.log('Book already exists, continuing with import:', folderName)
          } else {
            throw error
          }
        }
      }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error importing data:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
} 