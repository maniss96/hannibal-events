import { chromium, devices } from "playwright";
import fs from "node:fs";

const OUT = "/tmp/shots";
fs.mkdirSync(OUT, { recursive: true });
const URL = "http://127.0.0.1:3000/";

/** Raw widths plus real device profiles (touch, DPR and mobile UA included). */
const cases = [
  { name: "320-small-android", viewport: { width: 320, height: 640 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { name: "360-android", viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 },
  { name: "375-iphone-se", ...devices["iPhone SE"] },
  { name: "390-iphone-14", ...devices["iPhone 14"] },
  { name: "393-pixel-7", ...devices["Pixel 7"] },
  { name: "430-iphone-14-pro-max", ...devices["iPhone 14 Pro Max"] },
  { name: "landscape-iphone-14", ...devices["iPhone 14 landscape"] },
  { name: "768-ipad-mini", ...devices["iPad Mini"] },
  { name: "820-tablet", viewport: { width: 820, height: 1180 }, hasTouch: true },
  { name: "1024-laptop", viewport: { width: 1024, height: 768 } },
  { name: "1280-desktop", viewport: { width: 1280, height: 900 } },
  { name: "1440-desktop", viewport: { width: 1440, height: 900 } },
  { name: "1920-wide", viewport: { width: 1920, height: 1080 } },
];

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
  args: ["--no-sandbox"],
});

const problems = [];

async function fullScroll(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.6;
    let y = 0;
    let guard = 0;
    while (y < document.documentElement.scrollHeight && guard++ < 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 100));
      y += step;
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((r) => setTimeout(r, 600));
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(700);
}

for (const { name, ...profile } of cases) {
  const ctx = await browser.newContext(profile);
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

  await page.goto(URL, { waitUntil: "networkidle", timeout: 60000 });
  await fullScroll(page);

  const report = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;

    // 1. Anything sticking out past the viewport, ignoring elements that are
    //    inside a deliberately scrollable panel.
    const overflowing = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0) continue;
      if (r.right > vw + 1 || r.left < -1) {
        let p = el.parentElement;
        let inScroller = false;
        while (p) {
          const s = getComputedStyle(p);
          if (["auto","scroll","hidden","clip"].includes(s.overflowX)) { inScroller = true; break; }
          p = p.parentElement;
        }
        if (!inScroller) {
          overflowing.push(`${el.tagName}.${(el.className || "").toString().slice(0, 50)} right=${Math.round(r.right)}`);
        }
      }
    }

    // 2. Touch targets under 44x44 (WCAG 2.5.5 / Apple HIG).
    const small = [];
    for (const el of document.querySelectorAll('a[href], button, input:not([type="hidden"]), select, textarea, [role="button"]')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (el.closest("[hidden]")) continue;
      if (el.classList.contains("sr-only")) continue;
      if (r.height < 44 || r.width < 24) {
        small.push(`${el.tagName}"${(el.textContent || "").trim().slice(0, 24)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
      }
    }

    // 3. Form controls under 16px would zoom the viewport on iOS.
    const zoomers = [];
    for (const el of document.querySelectorAll("input, select, textarea")) {
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs < 16 && window.innerWidth < 768) zoomers.push(`${el.name || el.type}:${fs}px`);
    }

    // 4. Reveal blocks that never became visible.
    const stranded = [...document.querySelectorAll(".reveal")].filter((el) => !el.classList.contains("is-in")).length;

    // 5. Text smaller than 12px is unreadable on a phone.
    const tiny = [];
    if (window.innerWidth < 500) {
      for (const el of document.querySelectorAll("p, li, span, td, th, a, figcaption, label")) {
        if (!el.textContent?.trim() || el.children.length) continue;
        const fs = parseFloat(getComputedStyle(el).fontSize);
        if (fs < 11) tiny.push(`${fs}px "${el.textContent.trim().slice(0, 28)}"`);
      }
    }

    return {
      vw,
      scrollW: document.documentElement.scrollWidth,
      overflowing: overflowing.slice(0, 6),
      overflowCount: overflowing.length,
      small: [...new Set(small)].slice(0, 6),
      smallCount: small.length,
      zoomers: [...new Set(zoomers)],
      stranded,
      tiny: [...new Set(tiny)].slice(0, 4),
    };
  });

  if (report.scrollW > report.vw + 1)
    problems.push(`[${name}] page scrolls horizontally (${report.scrollW} > ${report.vw})`);
  if (report.overflowCount)
    problems.push(`[${name}] ${report.overflowCount} elements overflow the viewport: ${report.overflowing.join(" | ")}`);
  if (report.smallCount)
    problems.push(`[${name}] ${report.smallCount} touch targets under 44px tall: ${report.small.join(" | ")}`);
  if (report.zoomers.length)
    problems.push(`[${name}] iOS will zoom on focus — controls under 16px: ${report.zoomers.join(", ")}`);
  if (report.stranded)
    problems.push(`[${name}] ${report.stranded} reveal blocks never became visible`);
  if (report.tiny.length)
    problems.push(`[${name}] text under 11px: ${report.tiny.join(" | ")}`);
  if (errors.length) problems.push(`[${name}] console errors: ${errors.join(" ;; ")}`);

  if (report.smallCount) console.log("    small targets:", report.small.join(" | "));
  if (report.overflowCount) console.log("    overflowing:", report.overflowing.join(" | "));
  console.log(
    `${name.padEnd(24)} vw=${String(report.vw).padStart(4)} overflow=${String(report.overflowCount).padStart(2)} smallTargets=${String(report.smallCount).padStart(2)} zoomers=${report.zoomers.length} stranded=${report.stranded} err=${errors.length}`,
  );

  await page.screenshot({ path: `${OUT}/r-${name}.png` });
  if (["375-iphone-se", "390-iphone-14", "768-ipad-mini"].includes(name)) {
    await page.screenshot({ path: `${OUT}/rfull-${name}.png`, fullPage: true });
  }
  await ctx.close();
}

// ---- Mobile nav behaviour on a real touch profile -----------------------
{
  const ctx = await browser.newContext(devices["iPhone 14"]);
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });

  await page.getByRole("button", { name: /open menu/i }).first().tap();
  await page.waitForTimeout(400);
  const menuVisible = await page.locator("#mobile-menu").isVisible();
  const menuBox = await page.locator("#mobile-menu").boundingBox();
  const vh = page.viewportSize().height;
  if (!menuVisible) problems.push("[iphone-14] mobile menu did not open");
  if (menuBox && menuBox.y + menuBox.height > vh + 1 && menuBox.height > vh)
    problems.push("[iphone-14] mobile menu is taller than the screen with no scroll");

  await page.locator("#mobile-menu").getByRole("link", { name: "Spaces", exact: true }).tap();
  await page.waitForTimeout(700);
  const closed = !(await page.locator("#mobile-menu").isVisible());
  if (!closed) problems.push("[iphone-14] mobile menu stayed open after tapping a link");

  // The book must be turnable by touch.
  await page.locator("#spaces").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "Coral", exact: true }).tap();
  await page.waitForTimeout(900);
  const onPage = await page.locator(".book").evaluate((el) =>
    Math.round(el.scrollLeft / el.clientWidth),
  );
  if (onPage !== 4) problems.push(`[iphone-14] tapping Coral landed on page ${onPage}, expected 4`);

  console.log(`iphone-14 nav     menuOpened=${menuVisible} closedOnTap=${closed} bookJump=page${onPage}`);
  await page.screenshot({ path: `${OUT}/r-iphone-menu.png` });
  await ctx.close();
}

// ---- The room book ------------------------------------------------------
{
  for (const profile of [devices["iPhone 14"], { viewport: { width: 1280, height: 900 } }]) {
    const label = profile.viewport.width < 500 ? "phone" : "desktop";
    const ctx = await browser.newContext(profile);
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: "networkidle" });
    await page.locator("#spaces").scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    const book = page.locator(".book");
    const pages = await book.locator("article").count();
    if (pages !== 5) problems.push(`[book/${label}] expected 5 pages, found ${pages}`);

    // Every page must be exactly one viewport of the scroller wide.
    const geom = await book.evaluate((el) => ({
      clientW: el.clientWidth,
      scrollW: el.scrollWidth,
      pageW: el.firstElementChild?.getBoundingClientRect().width ?? 0,
      snap: getComputedStyle(el).scrollSnapType,
    }));
    if (Math.abs(geom.pageW - geom.clientW) > 2)
      problems.push(`[book/${label}] page width ${Math.round(geom.pageW)} != track width ${geom.clientW}`);
    if (!geom.snap.includes("x")) problems.push(`[book/${label}] scroll-snap not applied`);

    // Next button turns the page.
    await page.getByRole("button", { name: /next space/i }).click();
    await page.waitForTimeout(700);
    const after = await book.evaluate((el) => el.scrollLeft);
    if (after < geom.clientW * 0.8)
      problems.push(`[book/${label}] next button did not turn the page (scrollLeft ${Math.round(after)})`);

    // Keyboard must work on the scroller itself.
    await book.focus();
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(600);
    const afterKey = await book.evaluate((el) => el.scrollLeft);
    if (afterKey <= after)
      problems.push(`[book/${label}] arrow key did not advance the book`);

    // Every page's text must be in the DOM whether or not it is on screen.
    const names = await book.locator("article h3").allTextContents();
    const expected = ["Atlantis Ballroom", "Paradise Room", "Aloha Room", "Calypso Room", "Coral Room"];
    const absent = expected.filter((n) => !names.includes(n));
    if (absent.length) problems.push(`[book/${label}] pages missing from the DOM: ${absent.join(", ")}`);

    console.log(`book/${label.padEnd(8)} pages=${pages} pageW=${Math.round(geom.pageW)}/${geom.clientW} nextBtn=${after > 0} arrowKey=${afterKey > after}`);
    await page.screenshot({ path: `${OUT}/book-${label}.png` });
    await ctx.close();
  }
}

// ---- Lightbox on a phone ------------------------------------------------
{
  const ctx = await browser.newContext(devices["iPhone 14"]);
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.locator("#stay").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.locator("#stay ul button").first().tap();
  await page.waitForTimeout(500);
  const dialog = page.getByRole("dialog");
  const shown = await dialog.isVisible();
  const closeBox = await dialog.getByRole("button", { name: /close/i }).boundingBox();
  if (!shown) problems.push("[iphone-14] lightbox did not open");
  if (closeBox && (closeBox.width < 44 || closeBox.height < 44))
    problems.push(`[iphone-14] lightbox close button is ${Math.round(closeBox.width)}x${Math.round(closeBox.height)}`);
  const imgBox = await dialog.locator("img").boundingBox();
  const vp = page.viewportSize();
  if (imgBox && (imgBox.width > vp.width + 1 || imgBox.height > vp.height + 1))
    problems.push("[iphone-14] lightbox image overflows the screen");
  await page.screenshot({ path: `${OUT}/r-iphone-lightbox.png` });
  console.log(`iphone-14 lightbox opened=${shown} close=${closeBox ? Math.round(closeBox.width) + "x" + Math.round(closeBox.height) : "n/a"}`);
  await ctx.close();
}

await browser.close();

console.log("\n================ RESPONSIVE RESULT ================");
if (!problems.length) console.log("All responsive checks passed.");
else problems.forEach((p) => console.log("FAIL  " + p));
process.exit(problems.length ? 1 : 0);
