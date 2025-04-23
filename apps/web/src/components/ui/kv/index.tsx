"use client";

import { cn } from "@/lib/utils";

export function KeyValuePair({ label, value, className }: { label: string, value: string | null | undefined, className?: string }) {
  return (
    <div className={cn("flex flex-col", className)}>
      <span className="text-xs text-neutral-400">{label}</span>
      <span className="text-neutral-300">{value ?? "Undefined"}</span>
    </div>
  );
}

export function TwoItems({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 gap-1 text-sm", className)}>
      {children}
    </div>
  );
} 