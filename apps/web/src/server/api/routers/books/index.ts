import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { getBooks, getBookById } from "./utils";

export const bookRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return getBooks(ctx);
  }),

  getAllPublic: publicProcedure.query(async ({ ctx }) => {
    return getBooks(ctx, true);
  }),

  create: protectedProcedure
    .input(
      z.object({
        slug: z.string().regex(
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          "Must be a dash-separated string with no spaces",
        ),
        name: z.string().min(1, "Name is required"),
        markdown: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.book.create({
        data: {
          id: input.slug,
          name: input.name,
          markdown: input.markdown,
          userId: ctx.session.user.id,
        },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return getBookById(ctx, input.id);
    }),

  getByIdPublic: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return getBookById(ctx, input.id, true);
    }),
}); 