"use client"
import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";
import { useScrollToActive } from "@/hooks/use-scroll-to-active";

export function FloatingActionButton({ children, className }: { children: React.ReactNode, className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);
  useScrollToActive(containerRef);

  // Save scroll position before re-render
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const saveScrollPosition = () => {
      scrollPositionRef.current = container.scrollTop;
    };

    // Save position before potential re-render
    saveScrollPosition();

    // Restore position after re-render
    return () => {
      if (container) {
        container.scrollTop = scrollPositionRef.current;
      }
    };
  });

  return (
    <div className={cn(
      "fixed bottom-8 bg-neutral-900 right-8 w-80 backdrop-blur rounded-lg shadow-lg z-50",
      className
    )}>
      <div 
        ref={containerRef}
        className="max-h-[340px] overflow-y-auto p-4 [&::-webkit-scrollbar]:bg-neutral-700/50 [&::-webkit-scrollbar-thumb]:bg-neutral-700/80 [&::-webkit-scrollbar-thumb]:hover:bg-neutral-700/90"
      >
        {children}
      </div>
    </div>
  )
}

export function ActionContainer({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn(
      "bg-neutral-900 right-8 w-80 backdrop-blur rounded-lg shadow-lg z-50",
      className
    )}>
      <div className="max-h-[400px] overflow-y-auto p-4 [&::-webkit-scrollbar]:bg-neutral-700/50 [&::-webkit-scrollbar-thumb]:bg-neutral-700/80 [&::-webkit-scrollbar-thumb]:hover:bg-neutral-700/90">
        {children}
      </div>
    </div>
  )
}