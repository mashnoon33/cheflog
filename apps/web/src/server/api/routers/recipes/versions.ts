import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getRecipeById } from "./utils";

export const recipeVersionsRouter = createTRPCRouter({
  listVersions: protectedProcedure
    .input(z.object({ id: z.string(), bookId: z.string() }))
    .query(async ({ ctx, input }) => {
      const recipe = await getRecipeById(ctx, input.id, input.bookId);
      if (!recipe) {
        throw new Error("Recipe not found");
      }

      return await ctx.db.recipeHistory.findMany({
        where: { recipeId: recipe.id },
        orderBy: { version: "desc" },
      });
    }),

  getVersion: protectedProcedure
    .input(z.object({ id: z.string(), bookId: z.string(), version: z.number() }))
    .query(async ({ ctx, input }) => {
      const recipe = await getRecipeById(ctx, input.id, input.bookId);
      if (!recipe) {
        throw new Error("Recipe not found");
      }

      return await ctx.db.recipeHistory.findFirst({
        where: {
          recipeId: recipe.id,
          version: input.version,
        },
      });
    }),

  restoreVersion: protectedProcedure
    .input(z.object({ id: z.string(), bookId: z.string(), version: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const recipe = await getRecipeById(ctx, input.id, input.bookId);
      if (!recipe) {
        throw new Error("Recipe not found");
      }

      const version = await ctx.db.recipeHistory.findFirst({
        where: {
          recipeId: recipe.id,
          version: input.version,
        },
      });

      if (!version) {
        throw new Error("Version not found");
      }

      return await ctx.db.recipe.update({
        where: { id: recipe.id },
        data: {
          markdown: version.markdown,
          version: version.version,
        },
      });
    }),
}); 