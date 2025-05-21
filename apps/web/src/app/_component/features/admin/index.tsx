"use client";
import { NavMain } from "@/components/layout/admin/sidebar/nav-main";
import { NavRecipies } from "@/components/layout/admin/sidebar/nav-projects";
import { Card } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ArrowUpRight, Home } from "lucide-react";
import { recipes } from "./recipes";
import { parseRecipe } from "@repo/parser";
import { useState } from "react";
import { RecipeComponent } from "@/components/recipie/detail";
import { Fab } from "@/app/admin/[book]/[id]/_components/fab";
import { v4 as uuidv4 } from 'uuid';

// Define only the required fields for the Fab and NavRecipies components
const parsedRecipes = recipes.map((recipe) => {
    const parsed = parseRecipe(recipe);
    const id = uuidv4();
    const bookId = "demo-book";
    const createdAt = new Date();
    const updatedAt = new Date();
    const draft = Math.random() < 0.5;
    const version = Math.floor(Math.random() * 10) + 1;
    const slug = parsed.title?.toLowerCase().replace(/\s+/g, "-") || id;
    return {
        id,
        bookId,
        draft,
        public: true,
        version,
        slug,
        createdAt,
        updatedAt,
        latestVersion: version + Math.floor(Math.random() * 10),
        forksFrom: [],
        name: parsed.title,
        parsed,
        metadata: {
            id,
            name: parsed.title,
            summary: parsed.description,
            createdAt,
            updatedAt,
            recipeId: id,
        },
        url: `/admin/${bookId}/${id}`,
    };
});

export function Admin() {
    const [selectedRecipeId, setSelectedRecipeId] = useState<string>(parsedRecipes[0]?.id || "")
    const navItems = [
        {
            title: "Home",
            url: "/?",
            icon: Home
        },
        {
            title: "Public Site",
            url: "/?",
            icon: ArrowUpRight
        },
       
    ]

    return (
        <Card className="w-full h-[200px] md:h-[600px]   flex overflow-hidden relative">
            <div className="flex md:hidden text-center text-sm text-neutral-500 p-4 h-full  items-center justify-center">
               <span className="text-center mx-auto w-full">Best viewed on large screens</span>
            </div>
            <SidebarProvider open={true} onOpenChange={() => { }} className="hidden md:flex h-[600px] min-h-[600px] max-h-[600px]">
                <div className="w-64 border-r pt-4 bg-neutral-50">
                    <NavMain items={navItems} activeBookId="demo-book" />
                    
                    <NavRecipies recipes={parsedRecipes} selectedRecipeId={selectedRecipeId} onRecipeClick={setSelectedRecipeId} />
                </div>
                <div className="flex flex-col flex-1 p-6 h-full overflow-y-scroll  mb-[300px]">
                   {(() => {
                       const selectedRecipe = parsedRecipes.find(recipe => recipe.id === selectedRecipeId);
                       if (!selectedRecipe) return null;
                       return (
                         <>
                         <RecipeComponent
                           recipe={selectedRecipe.parsed}
                           recipeMetadata={selectedRecipe.metadata}
                         />
                         <Fab recipe={selectedRecipe} renderContext="demo" />
                         </>
                       );
                   })()}
                </div>
            </SidebarProvider>
        </Card>
    );
}