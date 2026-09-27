export type Setup =
  | "reception"
  | "theatre"
  | "banquet"
  | "classroom"
  | "conference"
  | "ushape";

export type Room = {
  slug: string;
  name: string;
  sqFt: number;
  /** Dimensions exactly as the property's own brochure states them. */
  dimensions: string;
  ceiling?: string;
  /** True for the three rooms the Atlantis Ballroom divides into. */
  isDivision: boolean;
  photo: string;
  photoAlt: string;
  /** Short line printed on the photograph. The alt text stays the longer description. */
  caption: string;
  capacity: Partial<Record<Setup, number>>;
  blurb: string;
  bestFor: string[];
};

/**
 * SOURCE OF TRUTH: the property's own events brochure.
 *
 * These figures deliberately do NOT match the Choice Hotels listing, which
 * publishes roughly 60% higher banquet numbers (400 for the ballroom against
 * the brochure's 240). 240 at 60" rounds of six is the figure that survives
 * arithmetic: 4,800 sq ft over 240 guests is 20 sq ft each, which is what a
 * seated dinner with a dance floor actually needs. Correct the Choice and
 * Eventective listings to match this file, not the other way round.
 *
 * RECEPTION figures are the one set the brochure does not publish. The owner
 * gives the ballroom's standing capacity as 400-500, so every room here is
 * computed at a flat 10 sq ft per standing guest, which puts the ballroom at
 * 480 — inside that range, and consistent across the smaller rooms. The page
 * states the density in a footnote so anyone can check the arithmetic. This is
 * also almost certainly where the Choice listing's "533" came from: a reception
 * number that ended up printed in the banquet column.
 *
 * Paradise, Aloha and Calypso ARE the Atlantis Ballroom, divided. Adding
 * their areas to the ballroom's would count the same floor three times, so
 * `totalSqFt` below counts the ballroom once plus the Coral Room.
 */
export const rooms: Room[] = [
  {
    slug: "atlantis",
    name: "Atlantis Ballroom",
    sqFt: 4800,
    dimensions: "80 × 60 ft",
    ceiling: "12 ft ceiling",
    isDivision: false,
    photo: "/images/space-atlantis.webp",
    photoAlt:
      "The Atlantis Ballroom empty, showing the full hardwood floor and coffered ceiling",
    caption: "Empty ballroom in this building. Hardwood floor, coffered ceiling.",
    capacity: { reception: 480, theatre: 500, banquet: 240, classroom: 260 },
    blurb:
      "The whole floor, undivided: 4,800 square feet of hardwood under a twelve-foot ceiling. Five hundred for a general session, two hundred and forty at rounds of six with room left for a dance floor. When you do not need all of it, it splits three ways.",
    bestFor: ["Wedding receptions", "Conferences", "Banquets", "Reunions"],
  },
  {
    slug: "paradise",
    name: "Paradise Room",
    sqFt: 2400,
    dimensions: "60 × 40 ft",
    ceiling: "10 ft ceiling",
    isDivision: true,
    photo: "/images/space-paradise.webp",
    photoAlt:
      "The Paradise Room set for a birthday party with pastel balloons, a sequin backdrop and round tables",
    caption: "A birthday setup in the Paradise Room.",
    capacity: { reception: 240, theatre: 200, banquet: 120, classroom: 130, conference: 70, ushape: 50 },
    blurb:
      "Half the ballroom, and the size most events actually want. A hundred and twenty seated is a full wedding in Hannibal without the room looking empty around the edges — and it takes a training day for a hundred and thirty just as easily.",
    bestFor: ["Rehearsal dinners", "Birthdays", "Training days", "Awards dinners"],
  },
  {
    slug: "aloha",
    name: "Aloha Room",
    sqFt: 1200,
    dimensions: "30 × 40 ft",
    isDivision: true,
    photo: "/images/space-aloha.webp",
    photoAlt:
      "The Aloha Room set theatre style with rows of chairs facing a podium and projection screen",
    caption: "Theatre rows in the Aloha Room, facing the screen.",
    capacity: { reception: 120, theatre: 100, banquet: 54, classroom: 50, conference: 30, ushape: 25 },
    blurb:
      "A hundred in rows, twenty-five around a U. The room for the session that is too big for a boardroom and too small to justify opening the ballroom — and it runs as a breakout while the main event carries on next door.",
    bestFor: ["Seminars", "Breakouts", "Luncheons", "Board meetings"],
  },
  {
    slug: "calypso",
    name: "Calypso Room",
    sqFt: 1200,
    dimensions: "30 × 40 ft",
    isDivision: true,
    photo: "/images/space-calypso.webp",
    photoAlt:
      "The Calypso Room set for a children's party with long banquet tables and a themed backdrop",
    caption: "Party tables in the Calypso Room.",
    capacity: { reception: 120, theatre: 100, banquet: 54, classroom: 50, conference: 30, ushape: 25 },
    blurb:
      "The Aloha Room's twin, on the other side of the divider. Book the pair and you get two parallel tracks on the same floor; book one and you get a private party room that seats fifty-four for dinner.",
    bestFor: ["Children's parties", "Workshops", "Private dinners", "Showers"],
  },
  {
    slug: "coral",
    name: "Coral Room",
    sqFt: 625,
    dimensions: "25 × 25 ft",
    isDivision: false,
    photo: "/images/space-coral.webp",
    photoAlt:
      "The Coral Room set as a boardroom with a single large table, twenty executive chairs and a projection screen",
    caption: "The Coral Room set as a boardroom.",
    capacity: { reception: 60, theatre: 50, banquet: 30, classroom: 30, conference: 20, ushape: 20 },
    blurb:
      "The only room here that closes its own door on twenty people and a screen. Interviews, depositions, board meetings, a memorial luncheon for thirty. It gets used more on a Tuesday than anything else in the building.",
    bestFor: ["Board meetings", "Interviews", "Depositions", "Small trainings"],
  },
];

export const setupLabels: Record<Setup, string> = {
  reception: "Reception",
  theatre: "Theatre",
  banquet: "Banquet",
  classroom: "Classroom",
  conference: "Conference",
  ushape: "U-Shape",
};

export const setupOrder: Setup[] = [
  "reception",
  "theatre",
  "banquet",
  "classroom",
  "conference",
  "ushape",
];

/** The ballroom counted once, plus the separate Coral Room. */
export const totalSqFt =
  rooms.filter((r) => !r.isDivision).reduce((sum, r) => sum + r.sqFt, 0);

/** How the Atlantis Ballroom divides, as proportions of the whole floor. */
export const divisions = rooms.filter((r) => r.isDivision);

export const ballroom = rooms[0];
export const largestBanquet = ballroom.capacity.banquet ?? 0;
export const largestTheatre = ballroom.capacity.theatre ?? 0;
export const largestReception = ballroom.capacity.reception ?? 0;

/** Square feet allowed per standing guest when deriving reception figures. */
export const RECEPTION_SQ_FT_PER_GUEST = 10;
