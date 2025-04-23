import { TrpcContext } from "@/trpc/context";
import { Prisma } from "@prisma/client";
export const bookSelect = {
  id: true,
  name: true,
  user: {
    select: {
      handle: true,
    },
  },
  recipes: {
    select: {
      id: true,
      markdown: true,
      version: true,
      public: true,
      draft: true,
      slug: true,
      updatedAt: true,
      createdAt: true,
    },
  },
} satisfies Prisma.BookSelect;

export async function getBooks(ctx: TrpcContext, publicOnly: boolean = false) {
  return await ctx.db.book.findMany({
    where: publicOnly ? { public: true } : { userId: ctx.session.user.id },
    select: bookSelect,
  });
}

export async function getBookById(ctx: TrpcContext, id: string, publicOnly: boolean = false) {
  return await ctx.db.book.findUnique({
    where: { id, ...(publicOnly ? { public: true } : { userId: ctx.session.user.id }) },
    select: bookSelect,
  });
} 