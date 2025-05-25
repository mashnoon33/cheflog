"use client";

import { RecipeComponent } from "@/components/recipie/detail";
import { api } from "@/trpc/react";
import { parseRecipe } from "@repo/parser";
import { useParams } from "next/navigation";
import { Fab } from "./_components/fab";
export default function AdminRecipeDetailPage() {
  const params = useParams();
  const { data: recipe } = api.recipe.getById.useQuery({
    id: params.id as string,
    bookId: params.book as string
  });
  const { data: recipeMetadata } = api.recipe.getRecipeMetadata.useQuery({
    id: params.id as string,
    bookId: params.book as string
  });

  if (!recipe || !recipeMetadata) {
    return null;
  }

  const parsedRecipe = parseRecipe(recipe.markdown);

  return (
    <div className="h-full w-full pb-[400px]">
      <RecipeComponent recipe={parsedRecipe} recipeMetadata={recipeMetadata} />
      <Fab recipe={recipe} />
    </div>
  );
}

