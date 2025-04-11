"use client";

import { RecipeCard } from "@/components/recipie/card";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { FileText, FolderOpen } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminBookPage() {
  const params = useParams();
  const { data, isLoading, error } = api.admin.getDashboardData.useQuery({
    bookId: params.book as string,
  });
  const router = useRouter();

  useEffect(() => {
    if (error?.data?.code === "UNAUTHORIZED") {
      router.push(`/admin`);
    }
  }, [error, router]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <section className="container px-4 py-16 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800">
      <div className=" ">

        <div className="">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data?.recentRecipes?.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} currentRoute={`/admin/${params.book}`} />
            ))}

            <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800/50">
              <div className="rounded-full bg-neutral-100 p-3 dark:bg-slate-800">
                <FileText className="h-6 w-6 text-slate-500" />
              </div>
              <h3 className="mt-4 font-mono text-sm font-medium">Create New Recipe</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                Document your favorite dishes with ingredients, instructions, and notes
              </p>
              <Button variant="outline" size="sm" className="mt-4 font-mono">
                Add Recipe
              </Button>
            </div>

            <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-800/50">
              <div className="rounded-full bg-neutral-100 p-3 dark:bg-slate-800">
                <FolderOpen className="h-6 w-6 text-slate-500" />
              </div>
              <h3 className="mt-4 font-mono text-sm font-medium">Create New Collection</h3>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                Organize recipes into collections like "Desserts" or "Quick Meals"
              </p>
              <Button variant="outline" size="sm" className="mt-4 font-mono">
                Add Collection
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
