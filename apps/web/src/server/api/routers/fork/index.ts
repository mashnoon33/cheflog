import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { verifyUserOwnsBook } from "../admin/utils";
import { TRPCError } from "@trpc/server";
import { createRecipe, getRecipeById } from "../recipes/utils";

export const forkRouter = createTRPCRouter({
    forkRecipe: protectedProcedure.input(z.object({
        recipeId: z.string(),
        forkedFromBookId: z.string(),
        bookId: z.string(),
    })).mutation(async ({ ctx, input }) => {
        const { recipeId, bookId, forkedFromBookId } = input;
        const book = await verifyUserOwnsBook(ctx, bookId);
        if (!book) {
            throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authorized" });
        }
        const recipe = await getRecipeById(ctx, recipeId, forkedFromBookId, false);
        if (!recipe) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Recipe not found" });
        }
        const forkedRecipe = await createRecipe(ctx, {
            bookId,
            markdown: recipe.markdown,
            draft: false,
        });
        await ctx.db.recipeForks.create({
            data: {
                forkedFromId: recipeId,
                forkedToId: forkedRecipe.id,
            },
        });
        return {
            id: forkedRecipe.id,
            bookId,
        }
    }),
});
