import { RecipeCard } from "@/components/recipie/card";
import { api, staticApi } from "@/trpc/server";

export async function generateStaticParams() {
  const books = await staticApi.book.getAllPublic();
  return books.map(book => ({
    book: book.id
  }));
}




export default async function RecipesPage({
  params,
}: {
  params: Promise<{ book: string }>;
}) {
  const resolvedParams = await params;
  const recipes = await api.recipe.getAllPublic({ bookId: resolvedParams.book });
  const book = await api.book.getByIdPublic({ id: resolvedParams.book });
  const currentRoute = `/${resolvedParams.book}`;
  return (
    <div className="mx-auto px-4 my-20 md:px-8">
      <div className="max-w-2xl sm:px-2 lg:max-w-7xl lg:px-8 py-16 sm:py-24">
        <div className="flex flex-col mb-10">

        {/* <h1 className="text-4xl font-bold text-neutral-600 dark:text-white/90">{book?.name}</h1> */}
        {/* <div className="prose line-clamp-3 max-w-4xl dark:prose-invert prose-neutral-500 dark:text-white/90"><ReactMarkdown>{book?.markdown}</ReactMarkdown></div> */}
        </div>
        {recipes && recipes.length > 0 ? (
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:gap-x-8">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} currentRoute={currentRoute} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-xs  text-neutral-600 dark:text-white/90">No recipes found</h2>
          </div>
        )}
      </div>
    </div>
  );
}