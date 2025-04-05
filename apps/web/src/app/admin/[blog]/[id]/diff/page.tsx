"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { DiffEditor } from "@monaco-editor/react"

import { api } from "@/trpc/react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DiffPage() {
  const params = useParams()
  const [leftVersion, setLeftVersion] = useState<number>(0)
  const [rightVersion, setRightVersion] = useState<number>(0)

  const { data: recipe, isLoading: recipeLoading } = api.recipe.getById.useQuery({
    id: params.id as string,
    blogId: params.blog as string
  })

  const { data: leftRecipe, isLoading: leftLoading } = api.recipe.getByIdWithVersion.useQuery({
    id: params.id as string,
    version: leftVersion
  }, {
    enabled: leftVersion !== 0
  })

  const { data: rightRecipe, isLoading: rightLoading } = api.recipe.getByIdWithVersion.useQuery({
    id: params.id as string,
    version: rightVersion
  }, {
    enabled: rightVersion !== 0
  })
  
  // Auto-select the two latest versions when recipe data is loaded
  useEffect(() => {
    if (recipe && recipe.version > 1) {
      setRightVersion(recipe.version);
      setLeftVersion(recipe.version - 1);
    }
  }, [recipe]);

  if (recipeLoading || leftLoading || rightLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }
  if (!recipe) {
    return <div>Recipe not found</div>
  }

  const versionOptions = Array.from({length: recipe.version}, (_, i) => (i + 1).toString())

  return (
    <div className="h-screen flex flex-col gap-4 " >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Compare version</span>
          <Select
            value={leftVersion.toString()}
            onValueChange={(value) => setLeftVersion(parseInt(value))}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {versionOptions.map((version) => (
                <SelectItem key={version} value={version}>
                   {version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">with version</span>
          <Select
            value={rightVersion.toString()}
            onValueChange={(value) => setRightVersion(parseInt(value))}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {versionOptions.map((version) => (
                <SelectItem key={version} value={version}>
                   {version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {leftRecipe && rightRecipe ? (
        <DiffEditor
          original={leftRecipe.markdown}
          modified={rightRecipe.markdown}
          language="markdown"
          options={{
            readOnly: true,
            renderSideBySide: true,
          }}
        />
      ) : (
        <div>Select versions to compare</div>
      )}
    </div>
  )
}
