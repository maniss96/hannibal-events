import Image from "next/image";
import { Reveal } from "./Reveal";
import { ballroom, rooms } from "@/lib/rooms";
import { site } from "@/lib/site";

const paradise = rooms.find((r) => r.slug === "paradise")!;

const facts = [
  {
    head: "Ceremony and reception, same address",
    body:
      "Hold the ceremony in the Paradise Room and the reception in the ballroom, or turn the room over during cocktail hour. Either way nobody drives between two venues in wedding clothes.",
  },
  {
    head: "The ballroom divides to fit the guest list",
    body: `A ${paradise.capacity.banquet}-guest wedding does not need ${ballroom.sqFt.toLocaleString()} square feet, and a half-empty room photographs badly. Take the Paradise Room instead and the space fits the wedding rather than the other way round.`,
  },
  {
    head: "Bring your caterer, or use ours",
    body: `${site.caterer} is our preferred caterer — ${site.catererNote}. Prefer your own licensed caterer, or a barbecue trailer, or your aunt's recipe done properly? Outside vendors are welcome. Most hotels will not allow that.`,
  },
  {
    head: "A room block people actually use",
    body:
      "Ninety-four rooms, including king whirlpool rooms for the wedding night. Guests book into the same building, so the after-party keeps going and nobody is counting drinks against a drive home.",
  },
];

export function Weddings() {
  return (
    <section
      id="weddings"
      className="rule border-mist px-gutter py-20 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[84rem]">
        <div className="grid gap-12 sm:gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow text-brass-deep">Weddings</p>
              <h2 className="display display-lg mt-6 max-w-[16ch]">
                Two hundred and forty at dinner, and a bed upstairs for every
                one of them.
              </h2>
              <p className="lede mt-6 text-ink-soft">
                The Atlantis Ballroom seats {ballroom.capacity.banquet} at rounds
                of six with room for a dance floor, and {ballroom.capacity.theatre}{" "}
                for a ceremony. It is the largest hotel ballroom in Hannibal, and
                the only one where the reception, the room block and the
                morning-after breakfast are the same building.
              </p>
              <a
                href="#inquire"
                className="mt-9 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brass-deep px-6 text-[0.8125rem] font-medium text-parchment transition-colors hover:bg-ink sm:w-auto"
              >
                Check your date
              </a>
            </Reveal>

            <Reveal i={1} className="mt-12 overflow-hidden rounded-sm">
              <Image
                src="/images/space-paradise.webp"
                alt="The Paradise Room dressed for a party with round tables, a balloon arch and a sequin backdrop"
                width={1152}
                height={768}
                sizes="(min-width: 1024px) 34vw, 100vw"
                className="h-full w-full object-cover"
              />
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <dl>
              {facts.map((f, i) => (
                <Reveal
                  key={f.head}
                  i={i}
                  className="rule border-mist py-8 first:border-t-0 first:pt-0"
                >
                  <dt className="display display-md">{f.head}</dt>
                  <dd className="mt-3 max-w-[54ch] text-[0.9375rem] leading-relaxed text-ink-soft">
                    {f.body}
                  </dd>
                </Reveal>
              ))}
            </dl>

            <Reveal i={4} className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <figure className="overflow-hidden rounded-sm">
                <Image
                  src="/images/space-atlantis.webp"
                  alt="The Atlantis Ballroom empty, showing the full hardwood floor"
                  width={1152}
                  height={768}
                  sizes="(min-width: 640px) 28vw, 92vw"
                  className="aspect-[3/2] h-full w-full object-cover"
                />
                <figcaption className="mt-2 text-[0.75rem] text-ink-soft">
                  The ballroom before setup — {ballroom.dimensions},{" "}
                  {ballroom.ceiling}
                </figcaption>
              </figure>
              <figure className="overflow-hidden rounded-sm">
                <Image
                  src="/images/space-calypso.webp"
                  alt="The Calypso Room set with long banquet tables and a themed backdrop"
                  width={1152}
                  height={768}
                  sizes="(min-width: 640px) 28vw, 92vw"
                  className="aspect-[3/2] h-full w-full object-cover"
                />
                <figcaption className="mt-2 text-[0.75rem] text-ink-soft">
                  A quarter of the ballroom, set for a private party
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
