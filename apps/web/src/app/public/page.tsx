import { api } from "@/trpc/server";
import Link from "next/link";
import { format } from "date-fns";

// --- Types ---
type Recipe = {
  id: string;
  version: number;
  updatedAt: Date;
  slug: string | null;
  metadata: { name: string; summary: string } | null;
};
type Cookbook = {
  id: string;
  name: string | null;
  user: { handle: string };
  recipes: Recipe[];
};

// --- Helpers ---
const isValidName = (name: string | null): name is string =>
  !!name && name.length > 0;

const groupByFirstLetter = (books: Cookbook[]) =>
  Array.from(
    books
      .filter(b => isValidName(b.name))
      .reduce((map, b) => {
        const l = b.name![0]?.toUpperCase();
        if (l) {
          map.set(l, [...(map.get(l) || []), b]);
        }
        return map;
      }, new Map<string, Cookbook[]>())
      .entries(),
  ).sort(([a], [b]) => a.localeCompare(b));

// --- Tree UI ---
function TreeRecipe({ recipe, cookbookId }: { recipe: Recipe; cookbookId: string }) {
  return (
    <li className="relative pl-6 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-4 before:h-0.5 before:bg-muted-foreground/30">
      <Link
        href={`/${cookbookId}/${recipe.slug ?? recipe.id}`}
        className="flex items-center gap-2 rounded px-2 py-1 hover:bg-accent transition group"
      >
        <span className="font-mono text-sm group-hover:underline">
          {recipe.metadata?.name ?? "Untitled Recipe"}
        </span>
        <span className="text-xs text-muted-foreground">
          {format(recipe.updatedAt, "MMM d, yyyy")}
        </span>
      </Link>
    </li>
  );
}

function TreeCookbook({ cookbook }: { cookbook: Cookbook }) {
  return (
    <li className="relative pl-4 before:absolute before:left-0 before:top-3 before:w-3 before:h-0.5 before:bg-muted-foreground/50">
      <div className="flex items-center gap-2">
        <Link href={`/${cookbook.id}`}>
          <span className="font-semibold text-base hover:underline">{cookbook.name}</span>
        </Link>
        <span className="text-xs text-muted-foreground">@{cookbook.user.handle}</span>
      </div>
      {cookbook.recipes.length > 0 && (
        <ul className="mt-1 ml-2 border-l border-muted-foreground/10 pl-2">
          {cookbook.recipes.map(recipe => (
            <TreeRecipe key={recipe.id} recipe={recipe} cookbookId={cookbook.id} />
          ))}
        </ul>
      )}
    </li>
  );
}

function TreeSection({ letter, cookbooks }: { letter: string; cookbooks: Cookbook[] }) {
  return (
    <li className="mb-8">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl font-bold font-mono text-primary">{letter}</span>
        <span className="h-0.5 flex-1 bg-muted-foreground/20 rounded" />
      </div>
      <ul>
        {cookbooks.map(cb => (
          <TreeCookbook key={cb.id} cookbook={cb} />
        ))}
      </ul>
    </li>
  );
}

// --- Main Page ---
export default async function PublicCookbookDirectory() {
  const cookbooks = await api.book.getAllPublic();
  const cookbooksWithRecipes = await Promise.all(
    cookbooks.map(async cb => ({
      ...cb,
      recipes: await api.recipe.getByBookId({ bookId: cb.id }),
    })),
  );
  const grouped = groupByFirstLetter(cookbooksWithRecipes);

  return (
    <div className="container mx-auto py-8 font-mono">
      <h1 className="mb-8 text-3xl font-bold">Directory</h1>
      <ul className="pl-0">
        {grouped.map(([letter, cookbooks]) => (
          <TreeSection key={letter} letter={letter} cookbooks={cookbooks} />
        ))}
      </ul>
    </div>
  );
}
