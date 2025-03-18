"use client";

import { RecipeComponent } from "@/components/recipie";
import { parseRecipe } from "@repo/parser";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";

const BackButton = ({ blog }: { blog: string }) => {
  return (
    <div className="flex items-center gap-2 mb-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/${blog}`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Recipes
        </Link>
      </Button>
    </div>
  );
};

const ActionButtons = ({ blog, recipeId }: { blog: string; recipeId: string }) => {
  return (
    <div className="flex items-center justify-end gap-2 mb-6">
      <Button variant="outline" size="sm" asChild>
        <Link href={`/admin/${blog}/${recipeId}/edit`}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Recipe
        </Link>
      </Button>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="container mx-auto py-6">
    <div className="space-y-4">
      <div className="h-12 w-3/4 bg-gray-200 animate-pulse rounded"></div>
      <div className="h-6 w-1/2 bg-gray-200 animate-pulse rounded"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="space-y-4">
          <div className="h-8 w-1/3 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-32 w-full bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="space-y-4">
          <div className="h-8 w-1/3 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-48 w-full bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

const ErrorView = () => (
  <div className="container mx-auto py-6 text-center">
    <h2 className="text-2xl font-bold mb-4">Recipe Not Found</h2>
    <p className="mb-6 text-gray-600">
      The recipe you're looking for doesn't exist or has been removed.
    </p>
    <Button asChild>
      <Link href="/recipes">Browse Recipes</Link>
    </Button>
  </div>
);

interface RecipeDetailProps {
  recipe: {
    id: string;
    markdown: string;
    metadata?: any;
  } | null;
  blog: string;
  isLoading?: boolean;
  error?: Error | null;
}

export function RecipeDetail({ recipe, blog, isLoading, error }: RecipeDetailProps) {
  if (isLoading) return <LoadingSkeleton />;
  if (error || !recipe) return <ErrorView />;

  const parsedRecipe = parseRecipe(recipe.markdown);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center">
        <BackButton blog={blog} />
        <ActionButtons blog={blog} recipeId={recipe.id} />
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <RecipeComponent recipe={parsedRecipe} />
        {recipe.metadata && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium mb-2">Recipe Details</h3>
            <p className="text-sm text-gray-500">metadata here later</p>
          </div>
        )}
      </div>
    </div>
  );
} 