"use client";

import { FakeChart } from "@/components/fake/chart";
import { RecipeComponent } from "@/components/recipie/detail";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { KeyValuePair, TwoItems } from "@/components/ui/kv";
import { api } from "@/trpc/react";
import { parseRecipe } from "@repo/parser";
import { format } from "date-fns";
import { Utensils } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
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
  // const parsedFrontmatter = parseFrontmatter(recipe.markdown);


  return (
    <div className="h-full w-full pb-[400px]">
      <RecipeComponent recipe={parsedRecipe} version={recipe.version} recipeMetadata={recipeMetadata} />
      <FloatingActionButton className=" text-neutral-300">
   
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-1 items-center text-sm">
            <div className={`h-2 w-2 rounded-full ${recipe.draft ? "bg-yellow-500" : "bg-green-500"}`} />
            <span className={`font-medium ${recipe.draft ? "text-yellow-500" : "text-green-500"}`}> {recipe.draft ? "Draft" : "Published"}</span>
          </div>
          <div className="text-xs text-neutral-400">
            version {recipe.version}
          </div>
        </div>
        {!recipe.draft && <FakeChart />}
        <div className="flex mt-2 flex-col gap-2  text-sm">
          <KeyValuePair label="Slug" value={recipe.slug} />
          <TwoItems>
            <KeyValuePair label="Created" value={format(recipe.createdAt, "MMM d, yyyy")} />
            <KeyValuePair label="Updated" value={format(recipe.updatedAt, "MMM d, yyyy")} />

          </TwoItems>
        </div>
        {
          recipe.forksFrom.length > 0 && (
            <Link className="flex flex-row mt-4" href={`/${recipe.forksFrom[0]?.forkedFrom.bookId}/${recipe.forksFrom[0]?.forkedFrom.id}`}>
              <div className="flex flex-row gap-1 items-center text-xs">
                <Utensils className="w-3 h-3" />
                Forked from
                <span className="text-xs text-white"> @{recipe.forksFrom[0]?.forkedFrom.createdBy.handle}/{recipe.forksFrom[0]?.forkedFrom.bookId} </span>
              </div>
            </Link>
          )
        }
      </FloatingActionButton>
    </div>
  );
}

