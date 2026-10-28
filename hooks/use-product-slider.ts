"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SCROLL_THRESHOLD = 2;

export function useProductSlider(itemCount: number) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollLeft = Math.round(el.scrollLeft);
    const maxScrollLeft = el.scrollWidth - el.clientWidth;

    setCanScrollLeft(scrollLeft > SCROLL_THRESHOLD);
    setCanScrollRight(scrollLeft < maxScrollLeft - SCROLL_THRESHOLD);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || itemCount === 0) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    const scheduleUpdate = () => {
      requestAnimationFrame(updateScrollState);
    };

    scheduleUpdate();

    el.addEventListener("scroll", updateScrollState, { passive: true });
    el.addEventListener("scrollend", updateScrollState, { passive: true });

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      el.removeEventListener("scrollend", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [itemCount, updateScrollState]);

  const scrollProducts = useCallback(
    (direction: number) => {
      const el = scrollRef.current;
      if (!el) return;

      el.scrollBy({
        left: direction * el.clientWidth,
        behavior: "smooth",
      });

      // Fallback for browsers without scrollend support.
      window.setTimeout(updateScrollState, 350);
    },
    [updateScrollState],
  );

  return {
    scrollRef,
    canScrollLeft,
    canScrollRight,
    scrollProducts,
  };
}
