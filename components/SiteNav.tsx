"use client";

import { useEffect, useState } from "react";
import { nav, site } from "@/lib/site";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled || open
          ? "bg-parchment/95 backdrop-blur-sm shadow-[0_1px_0_0_var(--color-mist)]"
          : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-20 max-w-[84rem] items-center justify-between px-gutter"
      >
        <a
          href="#top"
          className={`flex min-h-11 flex-col justify-center leading-none transition-colors ${
            scrolled || open ? "text-ink" : "text-parchment"
          }`}
        >
          <span className="display text-[1.3rem] sm:text-[1.45rem]">
            Quality Inn <span className="text-brass">&amp;</span> Suites
          </span>
          <span
            className={`eyebrow mt-1.5 text-[0.62rem] ${
              scrolled || open ? "text-ink-soft" : "text-parchment/80"
            }`}
          >
            Events · Hannibal, Missouri
          </span>
        </a>

        <div className="hidden items-center gap-9 lg:flex">
          <ul className="flex items-center gap-7">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`inline-flex min-h-11 items-center text-[0.875rem] font-medium transition-colors ${
                    scrolled
                      ? "text-ink-soft hover:text-brass-deep"
                      : "text-parchment/90 hover:text-parchment"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={site.salesPhoneHref}
            className={`tnum inline-flex min-h-11 items-center text-[0.875rem] font-medium transition-colors ${
              scrolled
                ? "text-ink hover:text-brass-deep"
                : "text-parchment hover:text-parchment/80"
            }`}
          >
            {site.salesPhone}
          </a>
          <a
            href="#inquire"
            className="inline-flex min-h-11 items-center rounded-full bg-brass-deep px-5 text-[0.8125rem] font-medium tracking-wide text-parchment transition-colors hover:bg-ink"
          >
            Request a Date
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className={`lg:hidden -mr-2 flex h-11 w-11 items-center justify-center transition-colors ${
            scrolled || open ? "text-ink" : "text-parchment"
          }`}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg width="22" height="14" viewBox="0 0 22 14" aria-hidden="true">
            <path
              d={open ? "M2 2 L20 12 M20 2 L2 12" : "M0 1 H22 M0 7 H22 M0 13 H16"}
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </button>
      </nav>

      <div
        id="mobile-menu"
        hidden={!open}
        className="rule max-h-[calc(100svh-5rem)] overflow-y-auto overscroll-contain border-mist bg-parchment px-gutter pb-[calc(2rem+var(--safe-b))] pt-2 lg:hidden"
      >
        <ul className="flex flex-col">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="display display-md block min-h-14 border-b border-mist py-4 text-ink"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-7 flex flex-col gap-3">
          <a
            href="#inquire"
            onClick={() => setOpen(false)}
            className="flex min-h-12 items-center justify-center rounded-full bg-brass-deep px-6 text-center text-sm font-medium text-parchment"
          >
            Request a Date
          </a>
          <a
            href={site.salesPhoneHref}
            className="tnum flex min-h-12 items-center justify-center rounded-full border border-mist px-6 text-center text-sm font-medium text-ink"
          >
            Call {site.salesPhone}
          </a>
        </div>
      </div>
    </header>
  );
}
