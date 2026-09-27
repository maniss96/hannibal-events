import { nav, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="on-dark bg-ink px-gutter py-16 text-parchment pb-safe">
      <div className="mx-auto max-w-[84rem]">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="display text-[1.5rem] leading-none">
              Quality Inn <span className="text-brass">&amp;</span> Suites
            </p>
            <p className="eyebrow mt-3 text-parchment/55">
              Events · Hannibal, Missouri
            </p>
            <address className="mt-7 not-italic text-[0.9375rem] leading-relaxed text-parchment/75">
              {site.street}
              <br />
              {site.city}, {site.state} {site.zip}
            </address>
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex min-h-11 items-center text-[0.875rem] text-brass underline decoration-brass/40 underline-offset-4 transition-colors hover:text-parchment"
            >
              Directions on Google Maps
            </a>
          </div>

          <div className="lg:col-span-3">
            <h2 className="eyebrow text-parchment/55">Contact</h2>
            <ul className="mt-3 space-y-1 text-[0.9375rem]">
              <li>
                <a
                  href={site.salesPhoneHref}
                  className="tnum inline-flex min-h-11 items-center text-parchment/85 transition-colors hover:text-brass"
                >
                  {site.salesPhone}
                </a>
                <span className="mt-0.5 block text-[0.75rem] text-parchment/62">
                  Events &amp; meetings
                </span>
              </li>
              <li>
                <a
                  href={site.frontDeskPhoneHref}
                  className="tnum inline-flex min-h-11 items-center text-parchment/85 transition-colors hover:text-brass"
                >
                  {site.frontDeskPhone}
                </a>
                <span className="mt-0.5 block text-[0.75rem] text-parchment/62">
                  Front desk &amp; guest rooms
                </span>
              </li>
              <li className="pt-1">
                <a
                  href="#inquire"
                  className="inline-flex min-h-11 items-center text-parchment/85 transition-colors hover:text-brass"
                >
                  Send an enquiry
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 lg:col-start-10">
            <h2 className="eyebrow text-parchment/55">On this page</h2>
            <ul className="mt-3 space-y-1 text-[0.9375rem]">
              {nav.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    className="inline-flex min-h-11 items-center text-parchment/85 transition-colors hover:text-brass"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rule-dark mt-14 flex flex-col gap-3 pt-8 text-[0.75rem] text-parchment/62 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
          <p>
            Guest room reservations are handled by the hotel&apos;s central
            booking, not this page.
          </p>
        </div>
      </div>
    </footer>
  );
}
