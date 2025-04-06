import { api } from "@/trpc/server";
import { RecipeDetail } from "@/components/recipe-detail";

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string; blog: string }>;
}) {
  const resolvedParams = await params;
  const recipe = await api.recipe.getById({ 
    id: resolvedParams.id, 
    blogId: resolvedParams.blog 
  });

  return <RecipeDetail recipe={recipe} blog={resolvedParams.blog} />;
}
