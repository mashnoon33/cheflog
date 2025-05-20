"use client"
import RecipeEditor, { RecipeEditorRef } from "@/components/editor/monaco"
import { FrontmatterType, parseFrontmatter } from "@/components/editor/monaco/faux-language-server/frontmatter"
import { RecipeComponent } from "@/components/recipie/detail"
import { Card } from "@/components/ui/card"
import { parseRecipe } from "@repo/parser"
import { useRef, useState } from "react"
import { actualRecipe } from "./const"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function Hero() {
  const [recipe, setRecipe] = useState(actualRecipe);
  const [view, setView] = useState<'recipe' | 'editor'>('recipe');
  const editorRef = useRef<RecipeEditorRef>(null);
  const parsedRecipe = parseRecipe(recipe);
  const frontMatter = parseFrontmatter(recipe);
  const frontMatterToRecipeMetadata = (frontMatter: FrontmatterType) => {
    return {
      source: frontMatter.source,
    };
  };

  return (
    <div className="flex flex-col gap-2 w-full ">
      <Card className=" overflow-y-auto">
        <div className="relative">
          <div className="flex justify-end m-4 absolute top-0 right-0 z-20">
            <Tabs defaultValue={view}>
              <TabsList>
                <TabsTrigger onClick={() => setView('recipe')} value="recipe">Recipe</TabsTrigger>
                <TabsTrigger onClick={() => setView('editor')} value="editor">Source</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="h-[750px] overflow-y-auto">
            <div style={{ display: view === 'recipe' ? 'block' : 'none' }}>
              <RecipeComponent
                recipe={parsedRecipe}
                recipeMetadata={frontMatterToRecipeMetadata(frontMatter.parsed)}
                renderContext="demo"
              />
            </div>
            <div style={{ display: view === 'editor' ? 'block' : 'none' }}>
              <RecipeEditor
                ref={editorRef}
                initialValue={recipe}
                onChange={(value: string | undefined) => setRecipe(value ?? '')}
                renderContext="demo"
              />
            </div>
          </div>
        </div>
      </Card>
      <span className="text-sm px-5 max-w-2xl text-blue-800/70">
        Cheflog recipes are both machine-readable and human-friendly. Toggle between clean source syntax and an elegant, interactive view—no lock-in, no magic.
      </span>
    </div>
  )
}
