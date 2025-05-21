import { api, staticApi } from "@/trpc/server";
import { Fab } from "./_components/fab";
import { RecipeDetail } from "@/components/recipie/detail";
// Generate static params for all recipes
export async function generateStaticParams() {
  const books = await staticApi.book.getAllPublic();
  const params = [];

  for (const book of books) {
    const recipes = await staticApi.recipe.getAllPublic({ bookId: book.id });
    params.push(
      ...recipes.map((recipe: any) => ({
        book: book.id,
        id: recipe.id,
      })),
    );
  }

  return params;
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string; book: string }>;
}) {
  const resolvedParams = await params;
  const recipe = await api.recipe.getByIdPublic({
    id: resolvedParams.id,
    bookId: resolvedParams.book,
  });

  const metadata = await api.recipe.getRecipeMetadataPublic({
    idOrSlug: resolvedParams.id,
    bookId: resolvedParams.book,
  });

  if (!recipe || !metadata) {
    return <div>Recipe not found</div>;
  }

  return (
    <div className="flex h-full w-full flex-col ">
      <Fab recipe={recipe} />
      <RecipeDetail
        recipe={recipe}
        book={resolvedParams.book}
        recipeMetadata={metadata}
      />
    </div>
  );
}
