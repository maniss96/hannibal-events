# Quality Inn & Suites Hannibal — Events

A single-page marketing site for the event spaces at Quality Inn & Suites
Hannibal (120 Lindsey Drive, Hannibal, MO). Its one job is to turn wedding and
corporate planners into qualified enquiries. It does not take bookings.

Next.js 16 · React 19 · TypeScript · Tailwind v4 · Resend. No UI framework, no
animation library, no carousel library, no database.

---

## Ship it

```bash
npm install
npm run dev            # http://localhost:3000

git init
git add -A
git commit -m "Events site for Quality Inn & Suites Hannibal"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

**Import to Vercel** — vercel.com → *Add New* → *Project* → pick the repo.
Framework is detected as Next.js; every default is correct. Add the three
environment variables below before the first deploy.

**Then point traffic at it.** The site is the closer, not the lead source. Put
the URL in the Google Business Profile, the Eventective listing, the email
signature and every Facebook post.

---

## Environment variables

See `.env.example`. Without them the enquiry form returns a clean error and
shows the phone number rather than crashing.

| Variable | What it is |
|---|---|
| `RESEND_API_KEY` | From resend.com → API Keys. Free tier covers this volume. |
| `INQUIRY_TO_EMAIL` | Where enquiries land. Comma-separate for several people. |
| `INQUIRY_FROM_EMAIL` | Sender on a domain verified in Resend. `onboarding@resend.dev` works for testing. |

After the first deploy, set `url` in `lib/site.ts` to the real domain — it feeds
the canonical tag, the Open Graph card and the schema.org markup.

---

## ⚠️ The capacity figures — read this before changing anything

`lib/rooms.ts` is the single source of truth, and it follows **the property's
own events brochure**. It deliberately contradicts the Choice Hotels listing.

| Room | Sq Ft | Reception | Theatre | Banquet (rounds of 6) | Classroom | Conference | U-Shape |
|---|---|---|---|---|---|---|---|
| Atlantis Ballroom (full) | 4,800 | 480 | 500 | 240 | 260 | — | — |
| Paradise Room *(half)* | 2,400 | 240 | 200 | 120 | 130 | 70 | 50 |
| Aloha Room *(quarter)* | 1,200 | 120 | 100 | 54 | 50 | 30 | 25 |
| Calypso Room *(quarter)* | 1,200 | 120 | 100 | 54 | 50 | 30 | 25 |
| Coral Room | 625 | 60 | 50 | 30 | 30 | 20 | 20 |

**Reception is the one column the brochure does not publish.** The owner gives
the ballroom's standing capacity as 400–500, so every room is computed at a flat
**10 sq ft per standing guest** — putting the ballroom at 480, inside that range
and consistent across the smaller rooms. The page states the density in a
footnote so the arithmetic is checkable. This is also the likeliest origin of
the Choice listing's "533": a reception figure that ended up printed in the
banquet column.

Two things that were wrong on the public web and are now fixed here:

1. **The Choice Hotels listing says the ballroom seats 400 at banquet. It does
   not — that is a standing-reception number in the wrong column.** The brochure says 240, and 240 is the figure that survives
   arithmetic — 4,800 sq ft ÷ 240 = 20 sq ft per guest, which is what a seated
   dinner with a dance floor needs. 400 would be 12 sq ft each. Every room was
   inflated the same way. **Correct the Choice and Eventective listings to
   match this file, not the other way round.**
2. **There are five event spaces, not six, and the square footage does not
   add up the way a listing implies.** Paradise, Aloha and Calypso *are* the
   Atlantis Ballroom, divided. Summing them with the ballroom counts the same
   floor three times. Bookable total is 4,800 + 625 = **5,425 sq ft**. The
   "Pre-Function Room" in the Choice listing is not in the brochure and is not
   on this site.

`totalSqFt` in `lib/rooms.ts` computes this correctly — it sums only rooms
where `isDivision` is false. Do not hardcode a square-footage figure anywhere.

There are **no prices on this site**, by design. Rental and catering are quoted
per event. Where a price would sit there is a request-a-quote CTA.

---

## The room book

The Spaces section is a book you turn: one page per space, real photograph,
real capacities.

It is **CSS scroll-snap, not a carousel library** — see `components/RoomBook.tsx`.
Touch swipe, trackpad, arrow keys, Home/End, the scrollbar and find-in-page all
work because the pages are simply laid out in a scroller. Nothing is hidden,
nothing is transformed, and all five pages are in the DOM for crawlers. The only
JavaScript reports which page you are on and moves the scroller when a button is
clicked. Under `prefers-reduced-motion` the jump is instant rather than smooth.

The page itself still scrolls vertically. That was deliberate: a whole-site book
would cost Cmd+F, deep links to sections, and the scan-don't-read behaviour
planners actually have.

---

## Photography

Every image on the site is a genuine photograph of the property.

The AI-generated wedding and conference renders supplied alongside the real
photos were **deliberately not imported**. The property has real photographs of
all five spaces, so a render would add only risk — and one of them showed a
hall several times larger than the 80 × 60 ft ballroom.

| File | Room | Source |
|---|---|---|
| `space-atlantis.webp` | Atlantis Ballroom, empty | brochure p6 |
| `space-paradise.webp` | Paradise Room, birthday setup | brochure p7 |
| `space-aloha.webp` | Aloha Room, theatre rows | brochure p8 |
| `space-calypso.webp` | Calypso Room, party setup | brochure p8 |
| `space-coral.webp` | Coral Room, boardroom | brochure p9 |
| `setup-classroom.webp` | Classroom setup, black linens | brochure p8 |

Plus the exterior at dusk, lobby, pool, hot tub and guest rooms. All processed
to WebP, warmed slightly to counter the fluorescent cast, cropped 3:2.

---

## Layout

```
app/
  layout.tsx          fonts, metadata, LocalBusiness + EventVenue schema
  page.tsx            section order
  globals.css         tokens, type scale, reveal, book, marquee, mobile rules
  icon.svg            favicon
  api/inquiry/route.ts  validation, honeypot, rate limit, Resend
  fonts/              self-hosted Fraunces + Inter (115 KB, latin, variable)
components/
  RoomBook.tsx        the swipeable room tour
  ...                 one file per section
lib/rooms.ts          capacity data — the single source of truth
lib/site.ts           address, contacts, inclusions, amenities
verify.mjs            build, a11y, content and form checks
verify-responsive.mjs 13 viewports, device profiles, the book
```

### Decisions worth keeping

- **Fonts are self-hosted**, not fetched from Google. One fewer third-party
  connection on the critical path.
- **The scroll reveal is CSS, gated on `html.js`.** The hidden state never
  reaches the server-rendered HTML, so the page reads fine with JavaScript off.
  `prefers-reduced-motion` neutralises it entirely.
- **No invented content.** No testimonials, star ratings, award badges or
  client logos.

---

## Checks

```bash
npm run build && npm run lint
npm run start          # then, in another terminal:
node verify.mjs
node verify-responsive.mjs
```

Both pass. What they cover:

- No horizontal scroll or overflowing element at 320, 360, 375, 390, 393, 430,
  750 (landscape), 768, 820, 1024, 1280, 1440 and 1920 px
- Device profiles with touch and mobile UA: iPhone SE, 14, 14 Pro Max, 14
  landscape, Pixel 7, iPad Mini
- Every touch target ≥ 44px; no form control under 16px, so iOS never zooms
- `prefers-reduced-motion`: zero animations running, no text hidden
- The book: five pages, each exactly one track-width, snap applied, next button
  and arrow keys both turn it, every page's text present in the DOM
- Empty and past-date submissions show inline errors and never POST
- **Regression guard:** the superseded figures (12,045 · 1,820 · 533 ·
  Pre-Function) must not reappear anywhere in the rendered page
- Exactly one `h1`, alt text and intrinsic dimensions on every image
- Contrast: body text ≥ 4.5:1, large display ≥ 3:1, light and dark sections

**Not covered:** only Chromium was available, so Safari and Firefox were handled
in code rather than tested. The iOS quirks are addressed explicitly in
`globals.css` — `svh` with a `vh` fallback, `env(safe-area-inset-*)`, 16px form
controls, `-webkit-text-size-adjust`, date-input sizing, tap-highlight and
overscroll. Open it on a real iPhone once before publicising the link.

---

## Before you publicise it

- [ ] Fix the Choice Hotels and Eventective listings to the brochure figures
- [ ] Set `url` in `lib/site.ts` to the live domain
- [ ] Send a test enquiry and confirm it reaches Nick
- [ ] Check the lat/long in `lib/site.ts` against the real pin
- [ ] **Franchise check:** this page uses "Quality Inn & Suites" as a text
      wordmark and embeds no Choice logo files. Choice agreements generally
      require franchisor approval for property-run websites using the marks —
      confirm with your area director before promoting the link.
