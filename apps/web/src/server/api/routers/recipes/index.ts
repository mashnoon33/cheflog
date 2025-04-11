import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { getRecipes, getRecipeById, createRecipe, deleteRecipeIngredients, getRecipeByIdWithVersion } from "./utils";
import { recipeVersionsRouter } from "./versions";
import { verifyUserOwnsBook } from "../admin/utils";

export const recipeRouter = createTRPCRouter({
  // Main recipe operations
  getAll: protectedProcedure
    .input(z.object({ bookId: z.string(), draft: z.boolean().optional().default(false) }))
    .query(async ({ ctx, input }) => {
      const book = await verifyUserOwnsBook(ctx, input.bookId);
      if (!book) {
        throw new Error("Not authorized");
      }
      return getRecipes(ctx, input.bookId, undefined, input.draft);
    }),

  getAllPublic: publicProcedure
    .input(z.object({ bookId: z.string() }))
    .query(async ({ ctx, input }) => {
      return getRecipes(ctx, input.bookId, true);
    }),

  getByIdPublic: publicProcedure
    .input(z.object({ id: z.string(), bookId: z.string() }))
    .query(async ({ ctx, input }) => {
      return getRecipeById(ctx, input.id, input.bookId, true);
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string(), bookId: z.string() }))
    .query(async ({ ctx, input }) => {
      return getRecipeById(ctx, input.id, input.bookId);
    }),

  getByIdWithVersion: protectedProcedure
    .input(z.object({ id: z.string(), bookId: z.string(), version: z.number() }))
    .query(async ({ ctx, input }) => {
      return getRecipeByIdWithVersion(ctx, input.id, input.version);
    }),

  create: protectedProcedure
    .input(
      z.object({
        markdown: z.string(),
        bookId: z.string(),
        draft: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return createRecipe(ctx, input);
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        bookId: z.string(),
        markdown: z.string(),
        draft: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const recipe = await getRecipeById(ctx, input.id, input.bookId);
      if (!recipe) {
        throw new Error("Recipe not found");
      }

      return await ctx.db.recipe.update({
        where: { id: recipe.id },
        data: {
          markdown: input.markdown,
          draft: input.draft,
          version: recipe.version + 1,
          history: {
            create: {
              markdown: input.markdown,
              version: recipe.version + 1,
            },
          },
        },
      });
    }),

  star: protectedProcedure
    .input(z.object({ id: z.string(), bookId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.star.create({
        data: {
          userId: ctx.session.user.id,
          recipeId: input.id,
        },
      });
    }),
  countStars: publicProcedure
    .input(z.object({ id: z.string(), bookId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.star.aggregate({
        where: { recipeId: input.id },
        _count: true
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string(), bookId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const recipe = await getRecipeById(ctx, input.id, input.bookId);
      if (!recipe) {
        throw new Error("Recipe not found");
      }

      await deleteRecipeIngredients(ctx, recipe.id);
      return await ctx.db.recipe.delete({
        where: { id: recipe.id },
      });
    }),

  // Version control operations
  versions: recipeVersionsRouter,
}); 