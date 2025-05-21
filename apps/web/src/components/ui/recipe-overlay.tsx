"use client";

import { cn } from "@/lib/utils";

type renderContext = "inline" | "default" | "demo";
export function RecipeOverlay({
  children,
  renderContext = "default",
}: {
  children: React.ReactNode;
  renderContext?: renderContext;
}) {
  const renderContextClass = {
    default: "fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 w-80 ",
    inline: "px-4 z-1 mt-10 ",
    demo: "absolute bottom-4 right-4 md:bottom-8 md:right-8 z-50 w-80 ",
  }[renderContext];

  return (



    <div
      className={cn(
        renderContextClass,
        "duration-300 animate-in fade-in-0 slide-in-from-bottom-2",
      )}
    >
      <div className="flex flex-col-reverse sm:flex-col gap-2">{children}</div>
    </div>
  );
}
