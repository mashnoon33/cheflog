import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { Prisma } from "@prisma/client";

export const searchRouter = createTRPCRouter({
  searchRecipes: publicProcedure
    .input(
      z.object({
        query: z.string(),
        includePrivate: z.boolean().optional().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      // If the query is empty, return the 10 most recently updated recipes
      if (!input.query.trim()) {
        return await ctx.db.recipeMetadata.findMany({
          select: {
            name: true,
            recipe: {
              select: {
                id: true,
                slug: true,
                createdBy: {
                  select: {
                    id: true,
                    handle: true,
                  },
                },
                book: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
          orderBy: { recipe: { updatedAt: "desc" } },
          take: 10,
        });
      }

      return await ctx.db.recipeMetadata.findMany({
        where: {
          name: {
            contains: input.query,
            mode: "insensitive",
          },
        },
        select: {
          name: true,
          recipe: {
            select: {
              id: true,
              slug: true,
              createdBy: {
                select: {
                  id: true,
                  handle: true,
                },
              },
              book: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });
    }),

  searchBooks: protectedProcedure
    .input(
      z.object({
        query: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;

      // If the query is empty, return the 10 most recently updated books
      if (!input.query.trim()) {
        return await ctx.db.book.findMany({
          where: { userId },
          select: {
            id: true,
            name: true,
            _count: { select: { recipes: true } },
          },
          orderBy: { updatedAt: "desc" },
          take: 10,
        });
      }

      // Use "contains" for partial matching, case-insensitive
      return await ctx.db.book.findMany({
        where: {
          userId,
          id: {
            contains: input.query,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          name: true,
          _count: { select: { recipes: true } },
        },
        orderBy: { updatedAt: "desc" },
        take: 10,
      });
    }),
});
