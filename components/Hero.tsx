"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { site } from "@/lib/site";

const frames = [
  { src: "/images/hero-exterior.webp", alt: "The hotel entrance and porte-cochère at dusk" },
  {
    src: "/images/space-atlantis.webp",
    alt: "The Atlantis Ballroom empty, showing the full hardwood floor and coffered ceiling",
  },
  { src: "/images/hero-lobby.webp", alt: "The lobby and front desk" },
];

const proof = [
  { figure: "4,800", unit: "sq ft", label: "Atlantis Ballroom" },
  { figure: "240", unit: "seated", label: "At rounds of six, with a dance floor" },
  { figure: "94", unit: "rooms", label: "Upstairs, in the same building" },
];

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % frames.length), 6000);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <section
      id="top"
      className="on-dark relative isolate h-screen-dynamic flex flex-col justify-end overflow-hidden bg-ink"
    >
      {frames.map((frame, i) => (
        <div
          key={frame.src}
          aria-hidden={i !== index}
          className="absolute inset-0 -z-10 overflow-hidden transition-opacity duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          <Image
            src={frame.src}
            alt={i === index ? frame.alt : ""}
            fill
            priority={i === 0}
            loading={i === 0 ? undefined : "lazy"}
            sizes="100vw"
            className={`object-cover ${!reduced && i === index ? "kenburns" : ""}`}
          />
        </div>
      ))}

      <div aria-hidden className="hero-scrim absolute inset-0 -z-10" />
      <div aria-hidden className="hero-scrim-top absolute inset-0 -z-10" />
      <div aria-hidden className="hero-scrim-side absolute inset-0 -z-10 hidden lg:block" />

      <div className="mx-auto w-full max-w-[84rem] px-gutter pb-[calc(3.5rem+var(--safe-b))] pt-28 sm:pt-32 lg:pb-20">
        <p className="eyebrow text-brass-bright">
          Atlantis Ballroom · Hannibal, Missouri
        </p>

        <h1 className="display display-xl mt-6 max-w-[17ch] text-parchment">
          The only ballroom in Hannibal with ninety&#8209;four bedrooms above it.
        </h1>

        <p className="lede mt-7 max-w-[54ch] text-parchment/85">
          Five event spaces under one roof, and an elevator between the dance
          floor and the pillow. No shuttle schedule. No one leaving at nine
          because they still have to drive to Quincy.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <a
            href="#inquire"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-brass-bright px-7 text-sm font-medium text-ink transition-colors hover:bg-parchment"
          >
            Check Your Date
          </a>
          <a
            href="#spaces"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-parchment/35 px-7 text-sm font-medium text-parchment transition-colors hover:border-parchment hover:bg-parchment/10"
          >
            See the Spaces
          </a>
        </div>

        <dl className="rule-dark mt-10 grid grid-cols-2 gap-x-6 gap-y-6 pt-8 sm:mt-12 sm:grid-cols-3 sm:gap-x-10">
          {proof.map((p) => (
            <div key={p.label}>
              <dt className="sr-only">{p.label}</dt>
              <dd>
                <span className="display tnum text-[1.75rem] leading-none text-parchment sm:text-[2.1rem]">
                  {p.figure}
                </span>
                <span className="eyebrow ml-2 text-brass-bright">{p.unit}</span>
                <span className="mt-2 block text-[0.8125rem] text-parchment/65">
                  {p.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="sr-only">
        Located at {site.address}. Call {site.salesPhone} to check availability.
      </p>
    </section>
  );
}
