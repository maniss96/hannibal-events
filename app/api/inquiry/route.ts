import { NextResponse } from "next/server";
import { Resend } from "resend";
import { site } from "@/lib/site";

export const runtime = "nodejs";

/** Simple per-IP limiter. Resets when the serverless instance recycles, which
 *  is fine for this volume — it exists to blunt a script, not to be a quota. */
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const clean = (v: unknown, max = 2000) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many enquiries from this connection." },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  // Honeypot: a real person never fills this in. Accept silently so a bot
  // does not learn it was caught.
  if (clean(body.company)) {
    return NextResponse.json({ ok: true });
  }

  const f = {
    name: clean(body.name, 120),
    email: clean(body.email, 200),
    phone: clean(body.phone, 60),
    eventType: clean(body.eventType, 80),
    date: clean(body.date, 20),
    altDate: clean(body.altDate, 20),
    guests: clean(body.guests, 10),
    needRooms: clean(body.needRooms, 20),
    source: clean(body.source, 80),
    message: clean(body.message, 4000),
  };

  const guests = Number(f.guests);
  const missing =
    !f.name ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email) ||
    f.phone.replace(/\D/g, "").length < 10 ||
    !f.eventType ||
    !f.date ||
    !Number.isFinite(guests) ||
    guests < 1 ||
    guests > 600;

  if (missing) {
    return NextResponse.json(
      { error: "Some required details were missing or invalid." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO_EMAIL;
  const from = process.env.INQUIRY_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.error(
      "[inquiry] Missing env: RESEND_API_KEY / INQUIRY_TO_EMAIL / INQUIRY_FROM_EMAIL",
    );
    return NextResponse.json(
      { error: "Our enquiry system is not reachable right now." },
      { status: 503 },
    );
  }

  const rows: [string, string][] = [
    ["Name", f.name],
    ["Email", f.email],
    ["Phone", f.phone],
    ["Event type", f.eventType],
    ["Preferred date", f.date],
    ["Alternate date", f.altDate || "—"],
    ["Estimated guests", f.guests],
    ["Needs guest rooms", f.needRooms || "—"],
    ["Heard about us via", f.source || "—"],
    ["Message", f.message || "—"],
  ];

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;color:#14120f;max-width:640px">
      <p style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#6f5322;margin:0 0 8px">
        New event enquiry
      </p>
      <h1 style="font-size:22px;margin:0 0 20px">
        ${escape(f.eventType)} · ${escape(f.guests)} guests · ${escape(f.date)}
      </h1>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        ${rows
          .map(
            ([k, v]) => `<tr>
              <td style="padding:8px 14px 8px 0;border-bottom:1px solid #ded6c8;color:#3c352c;white-space:nowrap;vertical-align:top">${k}</td>
              <td style="padding:8px 0;border-bottom:1px solid #ded6c8;white-space:pre-wrap">${escape(v)}</td>
            </tr>`,
          )
          .join("")}
      </table>
      <p style="font-size:12px;color:#3c352c;margin-top:20px">
        Sent from the events page · ${site.address}
      </p>
    </div>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: to.split(",").map((s) => s.trim()),
      replyTo: f.email,
      subject: `Event enquiry — ${f.eventType}, ${f.guests} guests, ${f.date}`,
      html,
      text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
    });

    if (error) {
      console.error("[inquiry] Resend error:", error);
      return NextResponse.json(
        { error: "We could not deliver your enquiry." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[inquiry] Unexpected error:", err);
    return NextResponse.json(
      { error: "We could not deliver your enquiry." },
      { status: 500 },
    );
  }
}
