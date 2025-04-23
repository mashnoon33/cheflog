import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const scraperRouter = createTRPCRouter({
  scrapeRecipe: protectedProcedure
    .input(
      z.object({
        url: z.string().url(),
      })
    )
    .mutation(async ({ input }) => {
      const response = await fetch("https://parser.cheflog.app/scrape-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error("Failed to scrape recipe");
      }

      return response.json();
    }),
    getWebsiteMetadata: protectedProcedure
        .input(z.object({
          domain: z.string().min(1, "Domain is required"),
        }))
        .query(async ({ input }) => {
          // Remove protocol and path if present, just in case
          const domain = input.domain.replace(/^https?:\/\//, '').split('/')[0];
          // Use a public favicon service (Google's or DuckDuckGo's)
          const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}`;
          return {
            domain,
            favicon: faviconUrl,
        };
      }),
});
