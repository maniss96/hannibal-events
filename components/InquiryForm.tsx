"use client";

import { useMemo, useState } from "react";
import { Reveal } from "./Reveal";
import { site } from "@/lib/site";

const eventTypes = [
  "Wedding reception",
  "Wedding ceremony & reception",
  "Rehearsal dinner",
  "Corporate meeting or training",
  "Conference",
  "Banquet or awards dinner",
  "Celebration of life",
  "Reunion",
  "Prom or school formal",
  "Trade show or vendor fair",
  "Other",
];

const sources = [
  "Google search",
  "Google Maps",
  "A friend or family member",
  "A past event here",
  "Facebook or Instagram",
  "A vendor or caterer",
  "Other",
];

type Errors = Partial<Record<string, string>>;
type Status = "idle" | "sending" | "sent" | "error";

const inputBase =
  "w-full rounded-sm border bg-parchment px-4 py-3 text-[0.9375rem] text-ink placeholder:text-ink-soft/80 transition-colors";

export function InquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  function validate(fd: FormData): Errors {
    const e: Errors = {};
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const eventType = String(fd.get("eventType") ?? "");
    const date = String(fd.get("date") ?? "");
    const guests = String(fd.get("guests") ?? "").trim();

    if (name.length < 2) e.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      e.email = "That email address does not look right.";
    if (phone.replace(/\D/g, "").length < 10)
      e.phone = "Please give a phone number we can reach you on.";
    if (!eventType) e.eventType = "Pick the closest match.";

    if (!date) {
      e.date = "A date — even an approximate one — lets us check availability.";
    } else if (date < today) {
      e.date = "That date has already passed.";
    }

    const n = Number(guests);
    if (!guests) e.guests = "An estimate is fine.";
    else if (!Number.isFinite(n) || n < 1 || n > 600)
      e.guests = "Enter a number between 1 and 600.";

    return e;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);

    const e = validate(fd);
    setErrors(e);
    if (Object.keys(e).length) {
      const first = form.querySelector<HTMLElement>(`[name="${Object.keys(e)[0]}"]`);
      first?.focus();
      return;
    }

    setStatus("sending");
    setServerError(null);

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(fd.entries())),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong on our end.");
      }
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setServerError(
        err instanceof Error ? err.message : "Something went wrong on our end.",
      );
    }
  }

  if (status === "sent") {
    return (
      <section
        id="inquire"
        className="on-dark bg-river px-gutter py-24 text-parchment sm:py-28 lg:py-36"
      >
        <div className="mx-auto max-w-[44rem] text-center">
          <p className="eyebrow text-brass-bright">Received</p>
          <h2 className="display display-lg mt-6 text-parchment">
            We have it. You will hear from us within one business day.
          </h2>
          <p className="lede mt-6 text-parchment/80">
            If your date is close or you would rather just talk it through, call
            the events line and ask for whoever is handling bookings.
          </p>
          <a
            href={site.salesPhoneHref}
            className="tnum mt-9 inline-flex min-h-12 items-center justify-center rounded-full bg-brass-bright px-7 text-sm font-medium text-ink transition-colors hover:bg-parchment"
          >
            {site.salesPhone}
          </a>
        </div>
      </section>
    );
  }

  return (
    <section
      id="inquire"
      className="on-dark bg-river px-gutter py-20 text-parchment sm:py-24 lg:py-32"
    >
      <div className="mx-auto grid max-w-[84rem] gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="eyebrow text-brass-bright">Check your date</p>
            <h2 className="display display-lg mt-6 max-w-[15ch] text-parchment">
              Tell us the date and the headcount.
            </h2>
            <p className="lede mt-6 max-w-[46ch] text-parchment/80">
              Those two things are all we need to tell you which room fits and
              whether it is open. Everything else — catering, linens, staging,
              a room block — follows from there.
            </p>
            <p className="mt-8 text-[0.875rem] leading-relaxed text-parchment/70">
              Rental and catering are quoted per event, so there is no price list
              to send you. What you will get back is a real figure for your date,
              your room, and your hours.
            </p>
            <a
              href={site.salesPhoneHref}
              className="tnum mt-6 inline-flex min-h-11 items-center gap-3 text-[0.9375rem] text-parchment transition-colors hover:text-brass-bright"
            >
              <span className="eyebrow text-brass-bright">Or call</span>
              {site.salesPhone}
            </a>
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal i={1}>
            <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
              {/* Honeypot — visually and programmatically hidden from people. */}
              <div aria-hidden className="hidden">
                <label htmlFor="company">Company (leave blank)</label>
                <input id="company" name="company" tabIndex={-1} autoComplete="off" />
              </div>

              <Field
                label="Your name"
                name="name"
                required
                error={errors.name}
                autoComplete="name"
                className="sm:col-span-2"
              />
              <Field
                label="Email"
                name="email"
                type="email"
                required
                error={errors.email}
                autoComplete="email"
              />
              <Field
                label="Phone"
                name="phone"
                type="tel"
                required
                error={errors.phone}
                autoComplete="tel"
              />

              <SelectField
                label="Type of event"
                name="eventType"
                required
                error={errors.eventType}
                options={eventTypes}
                placeholder="Choose one"
                className="sm:col-span-2"
              />

              <Field
                label="Preferred date"
                name="date"
                type="date"
                required
                min={today}
                error={errors.date}
              />
              <Field
                label="Alternate date"
                name="altDate"
                type="date"
                min={today}
                error={errors.altDate}
              />

              <Field
                label="Estimated guests"
                name="guests"
                type="number"
                required
                min={1}
                max={600}
                inputMode="numeric"
                error={errors.guests}
              />

              <SelectField
                label="Will you need guest rooms?"
                name="needRooms"
                options={["Yes", "No", "Not sure yet"]}
                placeholder="Choose one"
              />

              <SelectField
                label="How did you hear about us?"
                name="source"
                options={sources}
                placeholder="Choose one"
                className="sm:col-span-2"
              />

              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="eyebrow mb-2 block text-parchment/70"
                >
                  Anything else
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Ceremony on site? A caterer in mind? A budget you are working to?"
                  className={`${inputBase} resize-y border-parchment/20 focus:border-brass-bright`}
                />
              </div>

              {status === "error" && serverError && (
                <p
                  role="alert"
                  className="sm:col-span-2 rounded-sm border border-brass-bright/50 bg-brass-bright/10 px-4 py-3 text-[0.875rem] text-parchment"
                >
                  {serverError} Please call{" "}
                  <a href={site.salesPhoneHref} className="tnum underline">
                    {site.salesPhone}
                  </a>{" "}
                  and we will take the details over the phone.
                </p>
              )}

              <div className="sm:col-span-2 mt-2 flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-brass-bright px-8 text-sm font-medium text-ink transition-colors hover:bg-parchment disabled:opacity-60 sm:w-auto"
                >
                  {status === "sending" ? "Sending…" : "Send enquiry"}
                </button>
                <p className="text-[0.75rem] text-parchment/62">
                  We reply within one business day. No mailing list.
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  error,
  required,
  className = "",
  ...rest
}: {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label htmlFor={name} className="eyebrow mb-2 block text-parchment/70">
        {label}
        {required && <span className="ml-1 text-brass-bright">*</span>}
      </label>
      <input
        id={name}
        name={name}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`${inputBase} ${
          error ? "border-brass-bright" : "border-parchment/20 focus:border-brass-bright"
        }`}
        {...rest}
      />
      {error && (
        <p id={`${name}-error`} className="mt-2 text-[0.8125rem] text-brass-bright">
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  placeholder,
  error,
  required,
  className = "",
}: {
  label: string;
  name: string;
  options: readonly string[];
  placeholder: string;
  error?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="eyebrow mb-2 block text-parchment/70">
        {label}
        {required && <span className="ml-1 text-brass-bright">*</span>}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue=""
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`${inputBase} select-chevron appearance-none ${
          error ? "border-brass-bright" : "border-parchment/20 focus:border-brass-bright"
        }`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${name}-error`} className="mt-2 text-[0.8125rem] text-brass-bright">
          {error}
        </p>
      )}
    </div>
  );
}
