"use client";

import { useRef } from "react";
import { useEffect } from "react";

export function AutoScrollRow({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame: number;
    let pos = 0;
    let running = true;

    function step() {
      if (!running || !el) return;
      pos += 0.5; // px per frame
      if (el.scrollWidth - el.clientWidth > 0) {
        if (pos > el.scrollWidth - el.clientWidth) pos = 0;
        el.scrollLeft = pos;
      }
      frame = requestAnimationFrame(step);
    }
    frame = requestAnimationFrame(step);
    return () => {
      running = false;
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="flex gap-4 min-w-max"
      style={{
        scrollBehavior: "auto",
        overflowX: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {children}
    </div>
  );
}
