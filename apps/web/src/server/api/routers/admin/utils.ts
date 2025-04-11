import { db } from "@/server/db";
import { TrpcContext } from "@/trpc/context";
import { TRPCError } from '@trpc/server';

export async function verifyUserOwnsBook(ctx: TrpcContext, bookId: string) {
  const userId = ctx.session?.user.id;
  const book = await db.book.findFirst({
    where: { id: bookId, userId },
  });
  return book;
}

export async function getDashboardData(ctx: TrpcContext, bookId: string) {
  const book = await verifyUserOwnsBook(ctx, bookId);
  if (!book) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authorized to access this book'
    });
  }

  const totalRecipes = await db.recipe.count({
    where: { bookId },
  });
  
  // Get recent recipes with their metadata
  const recentRecipes = await db.recipe.findMany({
    where: { bookId, },
    select: {
      id: true,
      markdown: true,
      version: true,
      public: true,
      bookId: true,
      updatedAt: true,
      ingredients: {
        where: {
          important: true
        },
        select: {
          ingredient: {
            select: {
              id: true,
              name: true,
            }
          },
          quantity: true,
          unit: true,
          description: true
        }
      },
      metadata: true
    },
    orderBy: { updatedAt: "desc" },
    take: 6, // Show last 6 recipes
  });

  // Get last updated timestamp
  const lastUpdated = recentRecipes[0]?.updatedAt
    ? new Date(recentRecipes[0].updatedAt).toLocaleDateString()
    : "Never";

  return {
    totalRecipes,
    recentRecipes,
    lastUpdated,
  };
} 


export async function exportData(ctx: TrpcContext) {
  const userId = ctx.session?.user.id;
  const books = await db.book.findMany({
    where: { userId },
    include: {
      recipes: true,
    },
  });

  return books;
}
