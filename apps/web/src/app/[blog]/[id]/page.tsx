import { api, staticApi } from "@/trpc/server";
import { RecipeDetail } from "@/components/recipe-detail";

// Generate static params for all recipes
export async function generateStaticParams() {
  const blogs = await staticApi.blog.getAllPublic();
  const params = [];
  
  for (const blog of blogs) {
    const recipes = await staticApi.recipe.getAllPublic({ blogId: blog.id });
    params.push(...recipes.map((recipe: any) => ({
      blog: blog.id,
      id: recipe.id
    })));
  }
  
  return params;
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string; blog: string }>;
}) {
  const resolvedParams = await params;
  const recipe = await api.recipe.getByIdPublic({ 
    id: resolvedParams.id, 
    blogId: resolvedParams.blog 
  });

  return <RecipeDetail recipe={recipe} blog={resolvedParams.blog} />;
}
