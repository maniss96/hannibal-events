import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/lib/site";
import { rooms } from "@/lib/rooms";
import "./globals.css";

/* Self-hosted rather than fetched from Google Fonts: one fewer third-party
   connection on the critical path, and no external dependency at runtime.
   Both are variable, latin subset. Fraunces carries the optical-size axis
   for headlines. Newsreader is the text face. */

const fraunces = localFont({
  src: "./fonts/fraunces-latin.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-fraunces",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const newsreader = localFont({
  src: "./fonts/newsreader-latin.woff2",
  weight: "200 800",
  style: "normal",
  display: "swap",
  variable: "--font-newsreader",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default:
      "Wedding & Event Venue in Hannibal, MO | Quality Inn & Suites Hannibal West",
    template: "%s | Quality Inn & Suites Hannibal West",
  },
  description:
    "Five event spaces in Hannibal, Missouri — a 4,800 sq ft ballroom seating 500 theatre or 240 at dinner, dividing three ways, plus a 20-seat boardroom and 94 guest rooms in the same building. Request a date.",
  keywords: [
    "Hannibal MO wedding venue",
    "Hannibal Missouri event space",
    "Hannibal MO meeting space",
    "banquet hall Hannibal MO",
    "wedding reception venue Hannibal",
    "conference room Hannibal Missouri",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: "The only ballroom in Hannibal with 94 bedrooms above it",
    description:
      "A 4,800 sq ft ballroom seating 240 at dinner, and an elevator between the dance floor and the pillow.",
    images: [
      {
        url: "/images/og.jpg",
        width: 1200,
        height: 630,
        alt: "Quality Inn & Suites Hannibal West at dusk",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The only ballroom in Hannibal with 94 bedrooms above it",
    description:
      "Five event spaces in Hannibal, Missouri. Weddings, conferences, banquets — with guest rooms upstairs.",
    images: ["/images/og.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f6f1e8",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Hotel", "EventVenue", "LocalBusiness"],
      "@id": `${site.url}/#venue`,
      name: site.name,
      url: site.url,
      telephone: site.salesPhone,
      email: site.salesEmail,
      image: `${site.url}/images/og.jpg`,
      description:
        "Event and meeting venue in Hannibal, Missouri with a 4,800 sq ft divisible ballroom, a boardroom and 94 guest rooms on site.",
      address: {
        "@type": "PostalAddress",
        streetAddress: site.street,
        addressLocality: site.city,
        addressRegion: site.state,
        postalCode: site.zip,
        addressCountry: "US",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: site.geo.lat,
        longitude: site.geo.lng,
      },
      numberOfRooms: site.guestRooms,
      maximumAttendeeCapacity: 500,
      amenityFeature: [
        "Free Wi-Fi",
        "Free parking",
        "Free hot breakfast",
        "Indoor pool",
        "Business center",
        "Pet friendly",
      ].map((name) => ({
        "@type": "LocationFeatureSpecification",
        name,
        value: true,
      })),
      containsPlace: rooms.map((r) => ({
        "@type": "MeetingRoom",
        name: r.name,
        maximumAttendeeCapacity: Math.max(...Object.values(r.capacity)),
        floorSize: {
          "@type": "QuantitativeValue",
          value: r.sqFt,
          unitCode: "FTK",
        },
      })),
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${newsreader.variable}`}>
      <head>
        {/* Marks the document as scripted before first paint, which is what
            arms the scroll-reveal CSS. Without JS the class never lands and
            every section renders visible. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-ink focus:px-4 focus:py-3 focus:text-parchment"
        >
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
