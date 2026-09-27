import Image from "next/image";
import { Reveal } from "./Reveal";
import { included, onRequest, site } from "@/lib/site";
import { ballroom } from "@/lib/rooms";

export function Meetings() {
  return (
    <section
      id="meetings"
      className="on-dark bg-ink px-gutter py-20 text-parchment sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[84rem]">
        <div className="grid gap-12 sm:gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="eyebrow text-brass">Meetings &amp; corporate</p>
              <h2 className="display display-lg mt-6 max-w-[18ch] text-parchment">
                An 8 a.m. start that nobody has to drive to.
              </h2>
              <p className="lede mt-6 max-w-[54ch] text-parchment/80">
                Regional teams, board retreats, training days, depositions,
                association meetings. {ballroom.capacity.theatre} theatre-style in
                the full ballroom, or split it and run a main session with two
                breakouts on the same floor — while the people who came from out
                of town sleep forty feet away.
              </p>
            </Reveal>

            <Reveal i={1} className="mt-12 grid gap-10 sm:grid-cols-2">
              <div>
                <h3 className="eyebrow text-brass">Included in every room</h3>
                <ul className="rule-dark mt-4 pt-4">
                  {included.map((x) => (
                    <li
                      key={x}
                      className="rule-dark py-2.5 text-[0.875rem] text-parchment/78 first:border-t-0 first:pt-0"
                    >
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="eyebrow text-brass">On request</h3>
                <ul className="rule-dark mt-4 pt-4">
                  {onRequest.map((x) => (
                    <li
                      key={x}
                      className="rule-dark py-2.5 text-[0.875rem] text-parchment/78 first:border-t-0 first:pt-0"
                    >
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal i={2}>
              <p className="mt-10 max-w-[54ch] text-[0.8125rem] leading-relaxed text-parchment/55">
                Room rental and catering are quoted per event — the figure
                depends on the room, the day, the hours and what you need in it.
                Send {site.contactName} your date and headcount and you will get
                a room, a layout and a real number back, not a range.
              </p>
              <a
                href="#inquire"
                className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brass px-6 text-[0.8125rem] font-medium text-ink transition-colors hover:bg-parchment sm:w-auto"
              >
                Request a quote
              </a>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal i={1} className="overflow-hidden rounded-sm">
              <Image
                src="/images/setup-classroom.webp"
                alt="A meeting room set classroom style with black-linened tables, water bottles and a projection screen"
                width={1200}
                height={800}
                sizes="(min-width: 1024px) 34vw, 100vw"
                className="h-full w-full object-cover"
              />
            </Reveal>
            <Reveal i={2} className="mt-4 overflow-hidden rounded-sm">
              <Image
                src="/images/space-coral.webp"
                alt="The Coral Room set as a boardroom for twenty with a projection screen"
                width={1468}
                height={979}
                sizes="(min-width: 1024px) 34vw, 100vw"
                className="h-full w-full object-cover"
              />
            </Reveal>
            <Reveal i={3}>
              <p className="mt-4 text-[0.75rem] leading-relaxed text-parchment/62">
                Classroom in the Aloha Room, boardroom in the Coral Room. Hot
                breakfast is included for everyone staying — for a two-day
                meeting that is one fewer line on your budget and one fewer
                thing to organise.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
