import Image from "next/image";
import { Reveal } from "./Reveal";

const points = [
  {
    n: "01",
    head: "Nobody drives home",
    body:
      "Hannibal's other venues send your guests onto Highway 61 at midnight. Here, the people who stayed to the end take an elevator. That single fact changes who is still on the dance floor for the last song.",
  },
  {
    n: "02",
    head: "Out-of-town family stops being a logistics problem",
    body:
      "Block rooms in the same building as the reception and the airport-pickup spreadsheet disappears. Grandparents come down for an hour and go back up when they are tired.",
  },
  {
    n: "03",
    head: "The morning after is already handled",
    body:
      "Free hot breakfast is included for everyone staying, and the coffee is on 24/7. Your farewell brunch is a table in the dining room, not a second venue and a second deposit.",
  },
];

export function Difference() {
  return (
    <section
      id="difference"
      className="relative overflow-hidden bg-river px-gutter py-20 text-parchment sm:py-24 lg:py-32"
    >
      <div className="on-dark mx-auto grid max-w-[84rem] gap-12 sm:gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="eyebrow text-brass-bright">Why here</p>
            <h2 className="display display-lg mt-6 text-parchment">
              The last hour is the one people remember.
            </h2>
            <p className="lede mt-6 text-parchment/80">
              Every other event venue in town — the Rialto, the Armory, the estates
              out past the highway — hands you a beautiful room and a parking lot.
              We are the only address in Hannibal where the room and the beds are
              the same building.
            </p>
          </Reveal>

          <Reveal i={1} className="mt-10 overflow-hidden rounded-sm">
            <Image
              src="/images/detail-tub.webp"
              alt="Folded towels at the edge of a jacuzzi tub in one of the suites"
              width={691}
              height={431}
              sizes="(min-width: 1024px) 34vw, 100vw"
              className="h-full w-full object-cover"
            />
          </Reveal>
        </div>

        <ol className="lg:col-span-6 lg:col-start-7">
          {points.map((p, i) => (
            <Reveal as="li" key={p.n} i={i} className="rule-dark py-8 first:pt-0">
              <div className="flex gap-6 sm:gap-9">
                <span className="display tnum shrink-0 text-[1.05rem] text-brass-bright">
                  {p.n}
                </span>
                <div>
                  <h3 className="display display-md text-parchment">{p.head}</h3>
                  <p className="mt-3 max-w-[52ch] text-[0.9375rem] leading-relaxed text-parchment/75">
                    {p.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
