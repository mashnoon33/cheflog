"use client";

import Link from "next/link";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { useParams, usePathname } from "next/navigation";
import { MdPlusOne } from "react-icons/md";
import { RecipeCard } from "@/components/recipe-card";

interface CardSkeletonProps {
  numItems?: number;
  numRows?: number;
}

const CardSkeleton = ({ numItems = 3 }: CardSkeletonProps) => (
  <div className="space-y-2">
    {Array.from({ length: numItems }).map((_, i) => (
      <div key={i} className="form-check justify-center border-neutral-300/30 dark:border-neutral-600 border-b my-[.5]">
        <div className="flex text-sm">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mr-3"></div>
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
          <div className="flex grow justify-end pr-6">
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const BaseCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex flex-col prose w-full aspect-w-1 aspect-h-1 min-h-full rounded-lg overflow-hidden sm:aspect-w-2 sm:aspect-h-3 shadow-sm p-4 bg-neutral-50 border-gray-200 dark:border-neutral-300/10 dark:bg-primary border border-blood/10 ${className}`}>
    {children}
  </div>
);

const LoadingRecipeCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, index) => (
      <BaseCard key={index}>
        <div className="pb-2">
          <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mb-2"></div>
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
        </div>
        <CardSkeleton />
        <div className="w-full h-3 grow flex"></div>
      </BaseCard>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="text-center py-16">
    <h2 className="text-xl font-medium mb-4">No recipes found</h2>
    <p className="text-gray-500 mb-8">Get started by creating your first recipe!</p>
    <Button asChild>
      <Link href="/create">
        <MdPlusOne className="h-4 w-4 mr-2" />
        Create Recipe
      </Link>
    </Button>
  </div>
);

const CreateRecipeButton = () => (
  <Button asChild>
    <Link href="/create">
      <MdPlusOne className="h-4 w-4 mr-2" />
      Create Recipe
    </Link>
  </Button>
);

export default function RecipesPage() {
  const { blog } = useParams<{ blog: string }>();
  const { data: recipes, isLoading } = api.recipe.getAll.useQuery({ blogId: blog });
  const currentRoute = usePathname();

  return (
    <div className="mx-auto px-4 my-20 md:px-8">
      <div className="max-w-2xl sm:px-2 lg:max-w-7xl lg:px-8 py-16 sm:py-24">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Recipes</h1>
          <CreateRecipeButton />
        </div>

        {isLoading ? (
          <LoadingRecipeCards />
        ) : recipes && recipes.length > 0 ? (
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:gap-x-8">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} currentRoute={currentRoute} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}