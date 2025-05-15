import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { getBooks, getBookById } from "./utils";
import { createRecipe } from "../recipes/utils";
import { defaultRecipe } from "@/components/editor/monaco/const";

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
        slug: z
          .string()
          .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Must be a dash-separated string with no spaces",
          ),
        name: z.string().min(1, "Name is required"),
        markdown: z.string().optional(),
        public: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const allBooks = await ctx.db.book.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      });

      const book = await ctx.db.book.create({
        data: {
          id: input.slug,
          name: input.name,
          markdown: input.markdown,
          userId: ctx.session.user.id,
          public: input.public,
        },
      });

      if (allBooks.length === 0) {
        await createRecipe(ctx, {
          bookId: book.id,
          markdown: defaultRecipe,
        });
      }

      return book;
    }),
  checkSlug: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const existingBook = await ctx.db.book.findUnique({
        where: { id: input.slug },
      });
      return {
        available: !existingBook,
        slug: input.slug,
      };
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
