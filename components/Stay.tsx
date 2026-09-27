"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Reveal } from "./Reveal";
import { site } from "@/lib/site";

const shots = [
  {
    src: "/images/room-doublequeen.webp",
    alt: "A guest room with two queen beds",
    caption: "Two queens — the standard room for a guest block",
    w: 1500,
    h: 1000,
  },
  {
    src: "/images/room-jacuzzi-suite.webp",
    alt: "A suite with a jacuzzi tub and a king bed",
    caption: "Jacuzzi suite — the usual wedding-night room",
    w: 1024,
    h: 682,
  },
  {
    src: "/images/room-suite-wetbar.webp",
    alt: "A suite with a wet bar, seating area and desk",
    caption: "Wet-bar suite — where the after-party tends to end up",
    w: 1500,
    h: 1000,
  },
  {
    src: "/images/amenity-pool.webp",
    alt: "The large indoor pool with loungers and poolside seating",
    caption: "Indoor pool — the reason the kids are fine all weekend",
    w: 1152,
    h: 768,
  },
  {
    src: "/images/room-doublequeen-alt.webp",
    alt: "A guest room with two queen beds and a work desk",
    caption: "Ninety-four rooms across three floors",
    w: 1500,
    h: 1000,
  },
  {
    src: "/images/amenity-hottub.webp",
    alt: "The indoor hot tub",
    caption: "Hot tub, off the pool deck",
    w: 1400,
    h: 933,
  },
];

export function Stay() {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const active = open === null ? null : shots[open];

  return (
    <section
      id="stay"
      className="rule border-mist px-gutter py-20 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[84rem]">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-brass-deep">The rooms upstairs</p>
            <h2 className="display display-lg mt-6 max-w-[16ch]">
              The part your guests will thank you for.
            </h2>
          </div>
          <p className="max-w-[40ch] text-[0.9375rem] leading-relaxed text-ink-soft">
            Ninety-four rooms across three floors, including suites with jacuzzi
            tubs. Ask about a block when you enquire — it is the same
            conversation, not a second one.
          </p>
        </Reveal>

        <ul className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {shots.map((s, i) => (
            <Reveal as="li" key={s.src} i={i % 3}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="group block w-full text-left"
              >
                <span className="block overflow-hidden rounded-sm bg-parchment-deep">
                  <Image
                    src={s.src}
                    alt={s.alt}
                    width={s.w}
                    height={s.h}
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
                    className="aspect-[3/2] h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                  />
                </span>
                <span className="mt-3 block text-[0.8125rem] text-ink-soft">
                  {s.caption}
                </span>
              </button>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-10">
          <p className="max-w-[62ch] text-[0.75rem] leading-relaxed text-ink-soft/70">
            Guest rooms are booked through the hotel&apos;s central reservations,
            not this page. For an event room block, call{" "}
            <a
              href={site.salesPhoneHref}
              className="tnum inline-flex min-h-11 items-center underline decoration-mist underline-offset-4 hover:text-brass-deep"
            >
              {site.salesPhone}
            </a>{" "}
            or use the form below and say how many rooms you expect to need.
          </p>
        </Reveal>
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/92 p-4 pb-[max(1rem,var(--safe-b))]"
        >
          <button
            type="button"
            onClick={() => setOpen(null)}
            autoFocus
            className="absolute right-[max(1.25rem,var(--safe-r))] top-[max(1.25rem,env(safe-area-inset-top,0px))] z-10 flex h-12 w-12 items-center justify-center rounded-full bg-ink/60 text-parchment transition-colors hover:bg-parchment/15"
          >
            <span className="sr-only">Close</span>
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path
                d="M2 2 L16 16 M16 2 L2 16"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
          <figure
            onClick={(e) => e.stopPropagation()}
            className="max-h-full w-full max-w-5xl"
          >
            <Image
              src={active.src}
              alt={active.alt}
              width={active.w}
              height={active.h}
              sizes="(min-width: 1024px) 64rem, 92vw"
              className="h-auto max-h-[72svh] w-full rounded-sm object-contain"
            />
            <figcaption className="mt-4 text-center text-[0.8125rem] text-parchment/70">
              {active.caption}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
