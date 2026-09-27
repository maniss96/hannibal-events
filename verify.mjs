import { chromium } from "playwright";
import fs from "node:fs";

const OUT = "/tmp/shots";
fs.mkdirSync(OUT, { recursive: true });

const widths = [
  { name: "375", w: 375, h: 812 },
  { name: "768", w: 768, h: 1024 },
  { name: "1280", w: 1280, h: 900 },
  { name: "1920", w: 1920, h: 1080 },
];

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
  args: ["--no-sandbox"],
});

const problems = [];

for (const { name, w, h } of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();

  const errors = [];
  const bytes = { js: 0, img: 0, font: 0, css: 0 };
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
  page.on("response", async (r) => {
    const t = r.request().resourceType();
    const len = Number(r.headers()["content-length"] || 0);
    if (t === "script") bytes.js += len;
    else if (t === "image") bytes.img += len;
    else if (t === "font") bytes.font += len;
    else if (t === "stylesheet") bytes.css += len;
  });

  await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(600);

  // Drive every reveal into view so nothing screenshots at opacity 0.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.6;
    let y = 0;
    let guard = 0;
    // scrollHeight grows as lazy images load, so re-read it every step
    while (y < document.documentElement.scrollHeight && guard++ < 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 110));
      y += step;
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((r) => setTimeout(r, 500));
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(900);

  const overflow = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
    offenders: [...document.querySelectorAll("*")]
      .filter((el) => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
      .slice(0, 5)
      .map((el) => `${el.tagName}.${(el.className || "").toString().slice(0, 60)}`),
  }));

  if (overflow.scrollW > overflow.clientW + 1) {
    problems.push(`[${name}px] horizontal overflow: ${overflow.scrollW} > ${overflow.clientW} :: ${overflow.offenders.join(" | ")}`);
  }
  if (errors.length) problems.push(`[${name}px] console errors: ${errors.join(" ;; ")}`);

  const stranded = await page.evaluate(
    () => [...document.querySelectorAll(".reveal")].filter((el) => !el.classList.contains("is-in")).length,
  );
  if (stranded) problems.push(`[${name}px] ${stranded} reveal blocks never became visible after a full scroll`);

  await page.screenshot({ path: `${OUT}/full-${name}.png`, fullPage: true });
  await page.screenshot({ path: `${OUT}/hero-${name}.png` });

  console.log(
    `${name}px  overflow=${overflow.scrollW > overflow.clientW + 1 ? "YES" : "no"}  errors=${errors.length}  js=${(bytes.js / 1024).toFixed(0)}KB img=${(bytes.img / 1024).toFixed(0)}KB font=${(bytes.font / 1024).toFixed(0)}KB css=${(bytes.css / 1024).toFixed(0)}KB`,
  );

  await ctx.close();
}

// ---- Reduced motion ----------------------------------------------------
{
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  const anim = await page.evaluate(() => {
    const running = [];
    for (const el of document.querySelectorAll("*")) {
      for (const a of el.getAnimations?.() ?? []) {
        if (a.playState === "running") running.push(el.tagName + "." + (el.className || "").toString().slice(0, 40));
      }
    }
    // Any element still sitting at opacity 0 would mean hidden content.
    const invisible = [...document.querySelectorAll("main *")].filter((el) => {
      const s = getComputedStyle(el);
      return s.opacity === "0" && el.textContent.trim().length > 20;
    }).length;
    return { running: running.slice(0, 6), runningCount: running.length, invisible };
  });

  if (anim.runningCount > 0) problems.push(`[reduced-motion] ${anim.runningCount} animations still running: ${anim.running.join(", ")}`);
  if (anim.invisible > 0) problems.push(`[reduced-motion] ${anim.invisible} text elements stuck at opacity 0`);
  console.log(`reduced-motion  running=${anim.runningCount}  hiddenText=${anim.invisible}`);

  await page.screenshot({ path: `${OUT}/reduced-motion.png`, fullPage: true });
  await ctx.close();
}

// ---- Keyboard + form validation ----------------------------------------
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });

  // Tab through and confirm focus rings resolve to something visible.
  const focusables = await page.evaluate(() =>
    document.querySelectorAll('a[href], button, input, select, textarea, [tabindex="0"]').length,
  );

  // Submit empty -> must show inline errors and must NOT post.
  let posted = false;
  page.on("request", (r) => r.url().includes("/api/inquiry") && (posted = true));
  await page.locator("#inquire").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: /send enquiry/i }).click();
  await page.waitForTimeout(400);
  const errorCount = await page.locator('[id$="-error"]').count();
  const invalid = await page.locator("[aria-invalid='true']").count();

  if (posted) problems.push("[form] empty submit POSTed to /api/inquiry");
  if (errorCount < 5) problems.push(`[form] expected inline errors on all required fields, got ${errorCount}`);

  // Past date specifically.
  await page.fill('input[name="name"]', "Test Planner");
  await page.fill('input[name="email"]', "test@example.com");
  await page.fill('input[name="phone"]', "5735551234");
  await page.selectOption('select[name="eventType"]', "Wedding reception");
  await page.fill('input[name="date"]', "2020-01-01");
  await page.fill('input[name="guests"]', "150");
  await page.getByRole("button", { name: /send enquiry/i }).click();
  await page.waitForTimeout(400);
  const dateErr = await page.locator("#date-error").textContent().catch(() => null);
  if (!dateErr) problems.push("[form] past date accepted without an error");
  if (posted) problems.push("[form] past date POSTed to /api/inquiry");

  console.log(`form  focusables=${focusables} inlineErrors=${errorCount} ariaInvalid=${invalid} posted=${posted} dateErr=${JSON.stringify(dateErr)}`);

  // The room book turns to the page you pick.
  await page.locator("#spaces").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: "Coral", exact: true }).click();
  await page.waitForTimeout(800);
  const onPage = await page.locator(".book").evaluate((el) =>
    Math.round(el.scrollLeft / el.clientWidth),
  );
  if (onPage !== 4) problems.push(`[book] jumping to Coral landed on page ${onPage}, expected 4`);
  console.log(`book    jumpToCoral=page${onPage}`);

  await ctx.close();
}

// ---- Content guards ----------------------------------------------------
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
  const text = await page.locator("body").innerText();

  const priceHits = text.match(/\$\s?\d|\bper person\b|\bUSD\b|\bdeposit of\b/gi) ?? [];
  if (priceHits.length) problems.push(`[content] price-like strings found: ${priceHits.join(", ")}`);

  const loremHits = text.match(/lorem ipsum|TODO|FIXME|placeholder text/gi) ?? [];
  if (loremHits.length) problems.push(`[content] filler found: ${loremHits.join(", ")}`);

  // Every published capacity figure must be present and correct.
  // Brochure figures — the source of truth. See lib/rooms.ts.
  const required = ["4,800", "480", "500", "240", "260", "2,400", "200", "120", "130", "1,200", "100", "54", "625", "30", "5,425", "94"];
  const missing = required.filter((n) => !text.includes(n));
  if (missing.length) problems.push(`[content] missing figures: ${missing.join(", ")}`);

  // Regression guard: the superseded Choice Hotels figures must never return.
  const banned = ["12,045", "1,820", "533", "Pre-Function", "Rusty Oak"];
  const returned = banned.filter((n) => text.includes(n));
  if (returned.length) problems.push(`[content] superseded figures are back on the page: ${returned.join(", ")}`);

  const h1s = await page.locator("h1").count();
  if (h1s !== 1) problems.push(`[a11y] expected exactly 1 h1, found ${h1s}`);

  const imgsNoAlt = await page.evaluate(
    () => [...document.querySelectorAll("img")].filter((i) => i.alt === null || i.getAttribute("alt") === null).length,
  );
  if (imgsNoAlt) problems.push(`[a11y] ${imgsNoAlt} images without an alt attribute`);

  const imgsNoDims = await page.evaluate(
    () => [...document.querySelectorAll("img")].filter((i) => !i.width || !i.height).length,
  );
  if (imgsNoDims) problems.push(`[perf] ${imgsNoDims} images without intrinsic dimensions`);

  console.log(`content  h1=${h1s} imgsNoAlt=${imgsNoAlt} imgsNoDims=${imgsNoDims} priceHits=${priceHits.length}`);
  await ctx.close();
}

await browser.close();

console.log("\n================ RESULT ================");
if (problems.length === 0) console.log("All checks passed.");
else problems.forEach((p) => console.log("FAIL  " + p));
process.exit(problems.length ? 1 : 0);
