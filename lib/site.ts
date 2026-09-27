export const site = {
  /** Franchise note: text wordmark only. Logo files must come from the
   *  franchisor's approved brand asset library before launch. */
  /** The property's full name as Choice publishes it. Keep this exact string
   *  consistent with the Google Business Profile and every listing — local
   *  search ranks on name/address/phone matching across sources. */
  name: "Quality Inn & Suites Hannibal West",
  street: "120 Lindsey Drive",
  city: "Hannibal",
  state: "MO",
  zip: "63401",
  get address() {
    return `${this.street}, ${this.city}, ${this.state} ${this.zip}`;
  },
  salesPhone: "(573) 221-4001",
  salesPhoneHref: "tel:+15732214001",
  frontDeskPhone: "(573) 221-4000",
  frontDeskPhoneHref: "tel:+15732214000",
  salesEmail: "frontdesk_supervisor@hannibalqualityinn.com",
  contactName: "Nick Patel",
  contactRole: "General Manager",
  choiceListing: "https://www.choicehotels.com/missouri/hannibal/quality-inn-hotels/mo179",
  guestRooms: 94,
  eventSpaces: 5,
  caterer: "Rustic Oak Grill & Pub",
  catererNote: "Hannibal's People's Choice Best Steak House, 2022 and 2023",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Quality+Inn+%26+Suites+120+Lindsey+Drive+Hannibal+MO+63401",
  /** Replace with the live URL after the first Vercel deploy. */
  url: "https://example.vercel.app",
  geo: { lat: 39.7098, lng: -91.3799 },
} as const;

export const included = [
  "Room set to your layout",
  "Podium and microphones",
  "Bluetooth-compatible sound system",
  "Free Wi-Fi up to 1 Gbps",
  "Free on-site parking for every guest",
  "Night-before setup for weekend events",
] as const;

export const onRequest = [
  "Projection screen, flip chart or whiteboard",
  "TV with media player",
  "Stage risers",
  "White linens (colored with 20 days' notice)",
  "Catering by Rustic Oak Grill & Pub",
  "Bar service through local partners",
] as const;

export const onSite = [
  "94 guest rooms and suites",
  "Free full hot breakfast every morning",
  "Large indoor pool and hot tub",
  "Lounge and poolside bar",
  "Fitness center",
  "24-hour business center",
  "Free parking, including truck and trailer",
  "Pet-friendly rooms available",
] as const;

export const nav = [
  { href: "#spaces", label: "Spaces" },
  { href: "#weddings", label: "Weddings" },
  { href: "#meetings", label: "Meetings" },
  { href: "#stay", label: "Stay" },
  { href: "#inquire", label: "Inquire" },
] as const;
