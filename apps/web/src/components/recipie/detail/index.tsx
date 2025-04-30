import type { Recipe } from '@repo/parser';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Badge } from '../../ui/badge';
import { Section } from './sections';
import { Button } from "@/components/ui/button";
import { RouterOutputs } from "@/trpc/react";
import { parseRecipe } from "@repo/parser";
import Link from "next/link";

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
  recipe: RouterOutputs["recipe"]["getById"] | RouterOutputs["recipe"]["getByIdWithVersion"];
  recipeMetadata: RouterOutputs["recipe"]["getRecipeMetadata"];
  book: string;
  isLoading?: boolean;
  error?: Error | null;
}

export function RecipeDetail({ recipe, recipeMetadata,  error }: RecipeDetailProps) {
  if (error || !recipe) return <ErrorView />;
  const parsedRecipe = parseRecipe(recipe.markdown);
  return (
    <div className="h-full w-full">
      <RecipeComponent recipe={parsedRecipe} version={recipe.version} recipeMetadata={recipeMetadata} />
    </div>
  );
}

interface RecipeProps {
  recipe: Recipe;
  version: number;
  recipeMetadata: Partial<RouterOutputs["recipe"]["getRecipeMetadata"]>
}

function parseRecipeSource(url: string) {
  const urlObj = new URL(url);
  const hostname = urlObj.hostname;
  // Extract just the domain (e.g., "example.com" from "sub.example.com")
  const parts = hostname.split('.');
  const domain =
    parts.length >= 2
      ? parts.slice(-2).join('.')
      : hostname;
  return { hostname, domain };
}

// SourceBadge component
function SourceBadge({ source }: { source: string }) {
  try {
    const { hostname, domain } = parseRecipeSource(source);
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}`;
    return (
      <Link href={source}>
        <Badge className="mb-2 items-center gap-1">
          <span className="text-gray-300 flex items-center">
            <img
              src={faviconUrl}
              alt={`${hostname} favicon`}
              className="inline-block w-4 h-4 mr-1 align-middle"
              style={{ verticalAlign: "middle" }}
            />
            {domain}
          </span>
        </Badge>
      </Link>
    );
  } catch {
    return (
      <Link href={source}>
        <Badge className="mb-2 items-center gap-1">
          <span className="text-gray-300 flex items-center">source</span>
        </Badge>
      </Link>
    );
  }
}

export function RecipeComponent({ recipe, version, recipeMetadata }: RecipeProps) {
  console.log("find me");
  console.log(recipe);
  console.log("recipeMetadata");
  console.log(recipeMetadata);
  return (
    <div className="flex flex-1 flex-col gap-1 pt-10 md:pt-20 h-[100%] px-4  @container">
      <div className="max-w-xl @lg:max-w-4xl px-5 mx-auto">
        <div className="flex flex-row gap-1">
          <Badge className="mb-2">
            <span className="text-gray-300 ">version {version}</span>
          </Badge>
          {recipeMetadata?.source && <SourceBadge source={recipeMetadata.source} />}
        </div>
        <h1 className="text-4xl dark:text-white font-bold">{recipe.title}</h1>

        {/* Description */}
        <div className="flex-col hidden @lg:flex ">
          {recipe.description.length < 250 ? (
            <div className="text-black/75 dark:text-white/75">{recipe.description}</div>
          ) : (
            <TwoColumnDiv text={recipe.description} />
          )}
        </div>
        <div className="block @lg:hidden mt-6 text-black/75 dark:text-white/75">
          <ReactMarkdown>{recipe.description}</ReactMarkdown>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-10 mt-10 w-full">
          {recipe.sections.map((section, index) => (
            <Section key={index} section={section} />
          ))}
        </div>
        <div className="min-h-[700px]"></div>
      </div>
    </div>
  );
};

function TwoColumnDiv({ text }: { text: string }) {
  const maxLines = 5;
  const lineHeight = 1;
  const maxChars = Math.floor(
    (text.length / 2) * (maxLines / (maxLines * lineHeight))
  );

  const splitIndex = text.lastIndexOf(' ', maxChars);
  const firstColumnText = text.slice(0, splitIndex);
  const secondColumnText = text.slice(splitIndex + 1);

  return (
    <div className="flex flex-row gap-20 text-justify mt-6 text-black/75 dark:text-white/75">
      <div className="w-1/2">
        <ReactMarkdown>{firstColumnText}</ReactMarkdown>
      </div>
      {secondColumnText && (
        <div className="w-1/2">
          <ReactMarkdown>{secondColumnText}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};
