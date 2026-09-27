"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { rooms, setupLabels, setupOrder } from "@/lib/rooms";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/**
 * The room tour, as a book you page through.
 *
 * ponytail: this is CSS scroll-snap, not a carousel library. Touch swipe,
 * trackpad, arrow keys, Home/End, the scrollbar and find-in-page all work
 * because the pages are simply laid out in a scroller — nothing is hidden,
 * nothing is transformed, and every word is in the DOM for crawlers. The only
 * JavaScript here reports which page you are on and moves the scroller when
 * you press a button.
 */
export function RoomBook() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const reduced = usePrefersReducedMotion();
  const last = rooms.length - 1;

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const i = Math.round(el.scrollLeft / el.clientWidth);
        setPage(Math.max(0, Math.min(last, i)));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [last]);

  function goTo(i: number) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({
      left: el.clientWidth * Math.max(0, Math.min(last, i)),
      behavior: reduced ? "auto" : "smooth",
    });
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        tabIndex={0}
        role="region"
        aria-label="Event spaces. Swipe sideways, or use the arrow keys, to turn the page."
        className="book scroll-x flex snap-x snap-mandatory overflow-x-auto rounded-sm"
      >
        {rooms.map((room, i) => {
          const figures = setupOrder.filter((s) => room.capacity[s] != null);
          return (
            <article
              key={room.slug}
              aria-label={`Page ${i + 1} of ${rooms.length}. ${room.name}.`}
              className="w-full shrink-0 snap-center snap-always"
            >
              <div className="page grid gap-0 bg-parchment-deep/50 md:grid-cols-2">
                <figure className="relative aspect-[3/2] md:aspect-auto md:min-h-[27rem]">
                  <Image
                    src={room.photo}
                    alt={room.photoAlt}
                    fill
                    sizes="(min-width: 768px) 42vw, 100vw"
                    className="object-cover"
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent pb-3.5 pl-8 pr-5 pt-12 text-[0.8125rem] leading-snug text-parchment">
                    {room.caption}
                  </figcaption>
                </figure>

                <div className="flex flex-col justify-between p-6 sm:p-9 lg:p-11">
                  <div>
                    <p className="eyebrow text-brass-deep">
                      {room.isDivision
                        ? "A division of the Atlantis Ballroom"
                        : "Event space"}
                    </p>
                    <h3 className="display display-md mt-4">{room.name}</h3>

                    <p className="tnum mt-3 text-[0.8125rem] text-ink-soft">
                      {room.sqFt.toLocaleString()} sq ft · {room.dimensions}
                      {room.ceiling ? ` · ${room.ceiling}` : ""}
                    </p>

                    <p className="mt-5 max-w-[46ch] text-[0.9375rem] leading-relaxed text-ink-soft">
                      {room.blurb}
                    </p>
                  </div>

                  <div className="mt-8">
                    <dl className="rule grid grid-cols-2 gap-x-6 border-mist pt-5 sm:grid-cols-3">
                      {figures.map((s) => (
                        <div key={s} className="py-2">
                          <dt className="eyebrow text-ink-soft/80">
                            {setupLabels[s]}
                          </dt>
                          <dd className="display tnum mt-1 text-[1.6rem] leading-none text-brass-deep">
                            {room.capacity[s]}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
                      <a
                        href="#inquire"
                        className="inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-[0.8125rem] font-medium text-parchment transition-colors hover:bg-brass-deep"
                      >
                        Ask about this room
                      </a>
                      <p className="tnum text-[0.6875rem] text-ink-soft/70">
                        {i + 1} / {rooms.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Page controls. Duplicated by swipe, arrow keys and the scrollbar —
          these exist for people who want something to click. */}
      <div className="mt-5 flex items-center justify-between gap-4">
        <ol className="flex flex-wrap items-center gap-1.5" aria-label="Pages">
          {rooms.map((room, i) => (
            <li key={room.slug}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-current={i === page ? "true" : undefined}
                className={`inline-flex min-h-11 items-center rounded-full px-3 text-[0.75rem] font-medium transition-colors ${
                  i === page
                    ? "bg-brass-deep text-parchment"
                    : "text-ink-soft hover:bg-parchment-deep hover:text-ink"
                }`}
              >
                {room.name.replace(" Room", "").replace(" Ballroom", "")}
              </button>
            </li>
          ))}
        </ol>

        <div className="flex shrink-0 gap-2">
          <PageButton
            label="Previous space"
            disabled={page === 0}
            onClick={() => goTo(page - 1)}
            d="M12 3 L6 9 L12 15"
          />
          <PageButton
            label="Next space"
            disabled={page === last}
            onClick={() => goTo(page + 1)}
            d="M6 3 L12 9 L6 15"
          />
        </div>
      </div>
    </div>
  );
}

function PageButton({
  label,
  disabled,
  onClick,
  d,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  d: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-mist text-ink transition-colors hover:border-ink-soft disabled:opacity-35 disabled:hover:border-mist"
    >
      <span className="sr-only">{label}</span>
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        <path d={d} stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    </button>
  );
}
