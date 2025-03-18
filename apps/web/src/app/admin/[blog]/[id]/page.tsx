"use client";

import { useParams } from "next/navigation";
import { api } from "@/trpc/react";
import { RecipeDetail } from "@/components/recipe-detail";

export default function AdminRecipeDetailPage() {
  const params = useParams();
  const { data: recipe } = api.recipe.getById.useQuery({ 
    id: params.id as string,
    blogId: params.blog as string
  });

  if (!recipe) {
    return null;
  }

  return <RecipeDetail recipe={recipe} blog={params.blog as string} />;
}