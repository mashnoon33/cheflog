import { useEffect, useRef } from "react";

/**
 * A hook that automatically scrolls to elements with data-active="true" within a container
 * @param containerRef - A ref to the scrollable container
 * @param options - Optional configuration
 * @param options.behavior - The scroll behavior ("auto" | "smooth")
 * @param options.threshold - How much of the element needs to be visible (0-1)
 */
export function useScrollToActive(
  containerRef: React.RefObject<HTMLElement>,
  options: {
    behavior?: ScrollBehavior;
    threshold?: number;
  } = {}
) {
  const { behavior = "smooth", threshold = 1 } = options;
  const isInitialScroll = useRef(true);

  useEffect(() => {
    const scrollToActive = () => {
      const activeElement = containerRef.current?.querySelector("[data-active='true']");
      if (!activeElement || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const elementRect = activeElement.getBoundingClientRect();
      
      // Check if element is partially or fully outside the visible area
      const isPartiallyAbove = elementRect.top < containerRect.top;
      const isPartiallyBelow = elementRect.bottom > containerRect.bottom;

      // Only scroll if the element is not fully visible
      if (isPartiallyAbove || isPartiallyBelow) {
        // Calculate how much to scroll to center the element
        const elementCenter = elementRect.top + elementRect.height / 2;
        const containerCenter = containerRect.top + containerRect.height / 2;
        const scrollOffset = elementCenter - containerCenter;

        // Only do smooth scrolling on initial load, use instant scrolling for subsequent updates
        const scrollBehavior = isInitialScroll.current ? behavior : "auto";
        containerRef.current.scrollBy({
          top: scrollOffset,
          behavior: scrollBehavior
        });
      }

      isInitialScroll.current = false;
    };

    // Initial scroll
    scrollToActive();

    // Create a ResizeObserver to handle container size changes
    const resizeObserver = new ResizeObserver(() => {
      scrollToActive();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef, behavior, threshold]);
} 