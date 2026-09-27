import {
  RECEPTION_SQ_FT_PER_GUEST,
  rooms,
  divisions,
  ballroom,
  setupLabels,
  setupOrder,
  totalSqFt,
  type Setup,
} from "@/lib/rooms";
import { RoomBook } from "./RoomBook";
import { Reveal } from "./Reveal";
import { site } from "@/lib/site";

export function Spaces() {
  return (
    <section id="spaces" className="px-gutter py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[84rem]">
        <Reveal>
          <p className="eyebrow text-brass-deep">Five spaces</p>
          <h2 className="display display-lg mt-6 max-w-[20ch]">
            Twenty people around a table, or five hundred facing a stage.
          </h2>
          <p className="lede mt-6 max-w-[62ch] text-ink-soft">
            The Atlantis Ballroom is {ballroom.sqFt.toLocaleString()} square feet
            on one level, and it divides three ways. Add the Coral Room and the
            property books {totalSqFt.toLocaleString()} square feet of event
            space in total. Turn the pages.
          </p>
        </Reveal>

        <Reveal i={1} className="mt-12">
          <RoomBook />
        </Reveal>

        {/* How the ballroom divides — proportional, mirroring the brochure. */}
        <Reveal className="mt-20">
          <h3 className="eyebrow text-ink-soft">How the Atlantis Ballroom divides</h3>
          <div className="mt-5 flex gap-1.5" aria-hidden>
            {divisions.map((d) => (
              <div
                key={d.slug}
                style={{ flexGrow: d.sqFt }}
                className="rounded-sm bg-river px-4 py-5 text-parchment sm:px-5 sm:py-6"
              >
                <p className="display text-[0.95rem] leading-none sm:text-[1.1rem]">
                  {d.name.replace(" Room", "")}
                </p>
                <p className="tnum mt-2 text-[0.6875rem] text-parchment/70 sm:text-[0.75rem]">
                  {d.sqFt.toLocaleString()} sq ft
                </p>
              </div>
            ))}
          </div>
          <p className="sr-only">
            The Atlantis Ballroom divides into the Paradise Room at 2,400 square
            feet, the Aloha Room at 1,200 square feet, and the Calypso Room at
            1,200 square feet.
          </p>
          <p className="mt-4 max-w-[68ch] text-[0.75rem] leading-relaxed text-ink-soft/70">
            Widths shown in proportion to floor area. This is a size comparison,
            not a dimensioned floor plan — ask our events team for plans before
            you commit to a layout.
          </p>
        </Reveal>

        {/* Full capacity table */}
        <Reveal className="mt-16">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="eyebrow text-ink-soft">Capacity at a glance</h3>
            <p className="text-[0.6875rem] text-ink-soft/70 sm:hidden" aria-hidden>
              Swipe the table sideways →
            </p>
          </div>
          <div className="scroll-x mt-5 overflow-x-auto">
            <table className="w-full min-w-[42rem] border-collapse text-left">
              <caption className="sr-only">
                Maximum capacity of each event space by seating arrangement
              </caption>
              <thead>
                <tr className="rule border-mist">
                  <th
                    scope="col"
                    className="eyebrow whitespace-nowrap py-4 pr-6 font-medium text-ink-soft"
                  >
                    Room
                  </th>
                  <th
                    scope="col"
                    className="eyebrow whitespace-nowrap py-4 pr-6 text-right font-medium text-ink-soft"
                  >
                    Sq Ft
                  </th>
                  {setupOrder.map((s) => (
                    <th
                      key={s}
                      scope="col"
                      className="eyebrow whitespace-nowrap py-4 pr-6 text-right font-medium text-ink-soft"
                    >
                      {setupLabels[s]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rooms.map((r) => (
                  <tr key={r.slug} className="rule border-mist">
                    <th
                      scope="row"
                      className="whitespace-nowrap py-4 pr-6 text-[0.9375rem] font-medium"
                    >
                      {r.name}
                      {r.isDivision && (
                        <span className="ml-2 text-[0.6875rem] font-normal text-ink-soft/70">
                          division
                        </span>
                      )}
                    </th>
                    <td className="tnum whitespace-nowrap py-4 pr-6 text-right text-[0.9375rem] text-ink-soft">
                      {r.sqFt.toLocaleString()}
                    </td>
                    {setupOrder.map((s) => (
                      <td
                        key={s}
                        className="tnum whitespace-nowrap py-4 pr-6 text-right text-[0.9375rem] text-ink-soft"
                      >
                        {r.capacity[s as Setup] ?? (
                          <span aria-label="not available">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 max-w-[72ch] text-[0.75rem] leading-relaxed text-ink-soft/70">
            Banquet figures assume 60″ rounds seating six; reception figures
            allow {RECEPTION_SQ_FT_PER_GUEST} sq ft per standing guest.
            Capacities are maximums — a stage, a head table, a band or a dance
            floor all take seats out of the room. Paradise, Aloha and Calypso are the Atlantis
            Ballroom divided, so they cannot all be booked at once alongside the
            full ballroom. Confirm final numbers with {site.contactName} before
            you send invitations.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
