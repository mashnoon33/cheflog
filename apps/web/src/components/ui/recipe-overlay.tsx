"use client";

import { cn } from "@/lib/utils";

export function RecipeOverlay({
  children,
  renderInline = false,
}: {
  children: React.ReactNode;
  renderInline?: boolean;
}) {
  return (
    <div
      className={cn(
        !renderInline ? "fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 w-80 " : "px-4 z-1 mt-10 ",
        "duration-300 animate-in fade-in-0 slide-in-from-bottom-2",
      )}
    >
      <div className="flex flex-col-reverse sm:flex-col gap-2">{children}</div>
    </div>
  );
}
