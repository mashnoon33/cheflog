import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getDashboardData, exportData  } from "./utils";

export const adminRouter = createTRPCRouter({
  getDashboardData: protectedProcedure
    .input(z.object({ bookId: z.string() }))
    .query(async ({ ctx, input }) => {
      return getDashboardData(ctx, input.bookId);
    }),
  exportData: protectedProcedure
    .mutation(async ({ ctx }) => {
      return exportData(ctx);
    }),
}); 