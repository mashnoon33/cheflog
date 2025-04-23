"use client"

import { cn } from "@/lib/utils";

export function RecipeOverlay({ children, className }: { children: React.ReactNode, className?: string }) {

    return (
        <div className={cn(
            "fixed bottom-8 right-8 w-80 backdrop-blur rounded-lg shadow-lg z-50  ",
            "animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
        )}>
            <div className="flex flex-col gap-2">
                {children}
            </div>
        </div>
    );
} 