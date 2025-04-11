import { parseFrontmatter } from "@/components/editor/monaco/faux-language-server/frontmatter";
import { parseRecipe, Recipe } from "@repo/parser";
import type { PrismaClient } from "@prisma/client";
import { TrpcContext } from "@/trpc/context";


// Common recipe select pattern
export const recipeSelect = {
  id: true,
  markdown: true,
  version: true,
  draft: true,
  public: true,
  slug: true,
  updatedAt: true,
  createdBy: {
    select: {
      id: true,
      name: true,
    },
  },
  stars: {
    select: {
      id: true,
      userId: true,
    },
    take: 10,
  },
  createdAt: true,
  bookId: true,
  ingredients: {
    where: {
      important: true,
    },
    select: {
      ingredient: {
        select: {
          id: true,
          name: true,
        },
      },
      quantity: true,
      unit: true,
      description: true,
    },
  },
  metadata: true,
};

// Utility function to handle ingredient creation and linking
export async function handleRecipeIngredients(
  ctx: TrpcContext,
  recipeId: string,
  parsedRecipe: Recipe,
  metadataId: string | undefined,
) {
  // Extract ingredients from parsed recipe
  const ingredients = parsedRecipe.sections.flatMap((section) =>
    section.ingredients
  );

  // Create or link ingredients
  for (const ing of ingredients) {
    // Find or create the base ingredient
    const ingredient = await ctx.db.ingredient.upsert({
      where: { name: ing.name },
      create: { name: ing.name },
      update: { name: ing.name },
    });

    // Link ingredient to recipe with quantity/unit info
    await ctx.db.recipeIngredient.upsert({
      where: {
        recipeId_ingredientId: {
          recipeId: recipeId,
          ingredientId: ingredient.id,
        },
      },
      create: {
        recipeId: recipeId,
        ingredientId: ingredient.id,
        quantity: ing.quantity || null,
        unit: ing.unit || null,
        description: ing.description || null,
        metadataId: metadataId,
        important: ing.important || false,
      },
      update: {
        quantity: ing.quantity || null,
        unit: ing.unit || null,
        description: ing.description || null,
        metadataId: metadataId,
      },
    });
  }
}

// Utility function to delete all ingredients for a recipe
export async function deleteRecipeIngredients(ctx: TrpcContext, recipeId: string) {
  await ctx.db.recipeIngredient.deleteMany({
    where: { recipeId: recipeId },
  });
}

// Common recipe query function
export async function getRecipes(
  ctx: TrpcContext,
  bookId: string,
  publicOnly: boolean = false,
  draft: boolean = false,
) {
  return await ctx.db.recipe.findMany({
    where: {
      bookId,
      ...(draft ? {  } : { draft: false }),
      ...(publicOnly ? { public: true } : {}),
    },
    select: recipeSelect,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getRecipeByIdWithVersion(
  ctx: TrpcContext,
  id: string,
  version: number,
) {
  return await ctx.db.recipeHistory.findFirst({
    where: {
      recipeId: id,
      version,
    },
    
  });
}

// Common recipe by id query function
export async function getRecipeById(
  ctx: TrpcContext,
  id: string,
  bookId: string,
  publicOnly: boolean = false,
) {
  const whereClause = {
    bookId,
    ...(publicOnly ? { public: true } : {}),
    OR: [
      { id },
      { slug: id },
    ],
  };

  return await ctx.db.recipe.findFirst({
    where: whereClause,
    select: recipeSelect,
  });
}

// Function to create a new recipe
export async function createRecipe(
  ctx: TrpcContext,
  input: {
    markdown: string,
    bookId: string,
    draft?: boolean
  }
) {
  const parsedRecipe = parseRecipe(input.markdown);
  const frontmatter = parseFrontmatter(input.markdown);
  const recipe = await ctx.db.recipe.create({
    data: {
      markdown: input.markdown,
      bookId: input.bookId,
      draft: input.draft,
      slug: frontmatter.parsed.slug || null,
      createdById: ctx.session.user.id,
      metadata: {
        create: {
          name: parsedRecipe.title || "Untitled Recipe",
          summary: parsedRecipe.description || "",
          cuisine: frontmatter.parsed.cuisine || [],
        },
      },
      history: {
        create: {
          markdown: input.markdown,
          version: 1,
        },
      },
    },
    select: {
      ...recipeSelect,
      history: true,
    },
  });

  try {
    await handleRecipeIngredients(
      ctx,
      recipe.id,
      parsedRecipe,
      recipe.metadataId || undefined
    );
  } catch (error) {
    console.error("Error adding ingredients:", error);
  }

  return recipe;
} 