"use client";

import { useEffect, useRef } from "react";
import type { ElementType, ReactNode } from "react";

/**
 * Scroll-entrance animation, CSS-first.
 *
 * The hidden state lives in a stylesheet rule gated on `html.js`, not in an
 * inline style — so the server-rendered HTML contains no `opacity: 0`, and a
 * visitor whose JavaScript fails, or a crawler that does not run it, still
 * sees every word. `prefers-reduced-motion` neutralises the rule outright.
 *
 * One shared IntersectionObserver serves every instance on the page.
 */

let shared: IntersectionObserver | null = null;

function observerFor(el: Element) {
  if (typeof IntersectionObserver === "undefined") {
    el.classList.add("is-in");
    return null;
  }
  if (!shared) {
    shared = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          shared?.unobserve(entry.target);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );
  }
  return shared;
}

type Props = {
  children: ReactNode;
  /** Stagger index — each step adds 60ms. */
  i?: number;
  className?: string;
  as?: ElementType;
};

export function Reveal({ children, i = 0, className = "", as: Tag = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = observerFor(el);
    io?.observe(el);
    return () => io?.unobserve(el);
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={i ? ({ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
