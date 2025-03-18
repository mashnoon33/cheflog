import { z } from "zod";
import { Prisma } from "@prisma/client";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { parseRecipe } from "@repo/parser";
import { parseFrontmatter } from "@/components/editor/monaco/faux-language-server/validators";

export const recipeRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ blogId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.recipe.findMany({
        where: { blogId: input.blogId },
        include: {
          ingredients: {
          include: {
            ingredient: true,
          },
        },
        metadata: true,
      },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string(), blogId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.recipe.findUnique({
        where: { id: input.id, blogId: input.blogId },
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
          metadata: true,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        markdown: z.string(),
        blogId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Parse the markdown to extract metadata
      const parsedRecipe = parseRecipe(input.markdown);
 
      // Create the recipe
      const recipe = await ctx.db.recipe.create({
        data: {
          markdown: input.markdown,
          blogId: input.blogId,
          metadata: {
            create: {
              name: parsedRecipe.title || "Untitled Recipe",
              summary: parsedRecipe.description || "",
            },
          },
          // Store the first version in history
          history: {
            create: {
              markdown: input.markdown,
              version: 1,
            },
          },
        },
        include: {
          metadata: true,
          history: true,
        },
      });

      try {
        // Extract ingredients from parsed recipe
        const ingredients = parsedRecipe.sections.flatMap((section) => section.ingredients);

        // Create or link ingredients
        for (const ing of ingredients) {
          // Find or create the base ingredient
          const ingredient = await ctx.db.ingredient.upsert({
            where: { name: ing.name },
            create: {
              name: ing.name,
            },
            update: {
              name: ing.name,
            },
          });

          // Link ingredient to recipe with quantity/unit info
          await ctx.db.recipeIngredient.upsert({
            where: {
              recipeId_ingredientId: {
                recipeId: recipe.id,
                ingredientId: ingredient.id,
              },
            },
            create: {
              recipeId: recipe.id,
              ingredientId: ingredient.id,
              quantity: ing.quantity || null,
              unit: ing.unit || null,
              description: ing.description || null,
              metadataId: recipe.metadata?.id,
            },
            update: {
              quantity: ing.quantity || null,
              unit: ing.unit || null,
              description: ing.description || null,
              metadataId: recipe.metadata?.id,
            },
          });
        }
      } catch (error) {
        console.error("Error adding ingredients:", error);
        // Still return recipe even if ingredients fail
      }
    
      return recipe;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        blogId: z.string(),
        markdown: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const recipe = await ctx.db.recipe.findUnique({
        where: {
          id: input.id,
          blogId: input.blogId,
        },
        include: {
          blog: true,
          history: {
            orderBy: {
              version: 'desc'
            },
            take: 1
          }
        },
      });

      if (!recipe) {
        throw new Error("Recipe not found");
      }

      if (recipe.blog.userId !== ctx.session.user.id) {
        throw new Error("Not authorized");
      }

      // Parse the markdown to extract metadata
      const parsedRecipe = parseRecipe(input.markdown);
      const parsedFrontmatter = parseFrontmatter(input.markdown);

      const latestVersion = recipe.history[0]?.version ?? 0;

      // Update the recipe
      return await ctx.db.recipe.update({
        where: {
          id: input.id,
          blogId: input.blogId,
        },
        data: {
          markdown: input.markdown,
          metadata: {
            update: {
              name: parsedRecipe.title || "Untitled Recipe",
              summary: parsedRecipe.description || "",
            },
          },
          // Store the update in history
          history: {
            create: {
              markdown: input.markdown,
              version: latestVersion + 1,
            },
          },
        },
        include: {
          metadata: true,
          history: true,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string(), blogId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.recipe.delete({
        where: { id: input.id, blogId: input.blogId },
      });
    }),
});
