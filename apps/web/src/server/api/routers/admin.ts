import { z } from "zod";
import { db } from "@/server/db";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const adminRouter = createTRPCRouter({
  getDashboardData: protectedProcedure
    .input(z.object({ blogId: z.string() }))
    .query(async ({ input }) => {
      // Get total recipes count
      const totalRecipes = await db.recipe.count({
        where: { blogId: input.blogId },
      });

      // Get recent recipes with their metadata
      const recentRecipes = await db.recipe.findMany({
        where: { blogId: input.blogId },
        include: { metadata: true, ingredients: {
            include: {
                ingredient: true,
            }
        } },
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
    }),
}); 