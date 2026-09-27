import { Reveal } from "./Reveal";

const occasions = [
  {
    title: "Celebrations of life",
    body:
      "A room for fifty or five hundred, on short notice, with parking and an elevator. Families travelling in can stay in the building. We keep this quiet and we do not rush you out.",
  },
  {
    title: "Class and family reunions",
    body:
      "Hannibal draws people back. The ballroom holds the dinner, the smaller rooms hold the Friday meet-and-greet, and the room block keeps everyone in one place for the weekend.",
  },
  {
    title: "Proms and school formals",
    body:
      "A 4,800 sq ft floor, a stage area, and staff who have run this before. Chaperone-friendly layout with one controlled entrance.",
  },
  {
    title: "Trade shows and vendor fairs",
    body:
      "Ground-level access, 4,800 square feet of open floor with the dividers pulled back, and free parking including truck and trailer for exhibitors.",
  },
  {
    title: "Church and civic groups",
    body:
      "Standing bookings for monthly meetings, banquets, and conferences. Ask about a recurring arrangement if you meet on a schedule.",
  },
  {
    title: "Depositions and hearings",
    body:
      "The Coral Room seats twenty around one table with a door that closes, a screen and Wi-Fi that holds. Bookable by the half-day.",
  },
];

export function Occasions() {
  return (
    <section className="px-gutter py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[84rem]">
        <Reveal>
          <p className="eyebrow text-brass-deep">Everything else</p>
          <h2 className="display display-lg mt-6 max-w-[18ch]">
            Most of what happens in this ballroom is not a wedding.
          </h2>
        </Reveal>

        <ul className="mt-14 grid gap-x-12 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
          {occasions.map((o, i) => (
            <Reveal as="li" key={o.title} i={i % 3} className="rule border-mist py-7">
              <h3 className="display text-[1.2rem] leading-snug">{o.title}</h3>
              <p className="mt-3 text-[0.875rem] leading-relaxed text-ink-soft">
                {o.body}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
