import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-purple-900">
        Chilioil
      </h1>
      <p className="text-xl mb-8 max-w-2xl text-purple-700">
        Organize and discover your favorite recipes in one place
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/recipes">
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
            Browse Recipes
          </Button>
        </Link>
        <Link href="/create">
          <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-100">
            Add a Recipe
          </Button>
        </Link>
      </div>
    </div>
  );
} 