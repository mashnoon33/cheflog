import { api } from "@/trpc/server";
import { RecipeDetail } from "@/components/recipe-detail";

export default async function RecipeDetailPage({
  params,
}: {
  params: { id: string; blog: string };
}) {
  const recipe = await api.recipe.getById({ 
    id: params.id, 
    blogId: params.blog 
  });

  return <RecipeDetail recipe={recipe} blog={params.blog} />;
}
