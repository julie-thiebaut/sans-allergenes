import { chromium, type Browser } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Renders the bitmap icons from public/favicon.svg, which is the single source of truth for
 * the mark. Run it after changing the SVG (`npm run favicons`) so the .ico and the Apple
 * touch icon cannot drift away from it, as they silently would if they were hand-exported.
 *
 * Playwright is reused as the rasteriser because the build already depends on it for
 * prerendering; adding a dedicated image library for two files is not worth the install.
 */

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = path.join(ROOT, "public");

/** iOS applies its own rounded mask, so a squared-off tile avoids doubly rounded corners. */
const APPLE_TOUCH_SIZE = 180;
const ICO_SIZE = 32;

async function rasterise(browser: Browser, markup: string, size: number): Promise<Buffer> {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(
    `<body style="margin:0"><div style="width:${size}px;height:${size}px">${markup}</div></body>`,
  );
  const png = await page.screenshot({ omitBackground: true });
  await page.close();
  return png;
}

/**
 * Wraps a single PNG in an .ico container. Every browser still asking for /favicon.ico reads
 * PNG-encoded entries, so there is no need to emit a raw bitmap.
 */
function wrapPngInIco(png: Buffer, size: number): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(1, 4); // image count

  const entry = Buffer.alloc(16);
  entry.writeUInt8(size, 0); // width  (0 would mean 256)
  entry.writeUInt8(size, 1); // height
  entry.writeUInt8(0, 2); // palette size, 0 = no palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // colour planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(header.length + entry.length, 12); // offset to the image data

  return Buffer.concat([header, entry, png]);
}

async function main(): Promise<void> {
  const svg = await readFile(path.join(PUBLIC_DIR, "favicon.svg"), "utf8");

  const squared = svg.replace('rx="7"', 'rx="0"');
  if (squared === svg) {
    throw new Error('favicon.svg no longer has rx="7"; the Apple tile would keep its corners');
  }

  const browser = await chromium.launch();
  try {
    const icoPng = await rasterise(browser, svg, ICO_SIZE);
    await writeFile(path.join(PUBLIC_DIR, "favicon.ico"), wrapPngInIco(icoPng, ICO_SIZE));
    console.log(`✅ favicon.ico (${ICO_SIZE}×${ICO_SIZE})`);

    const applePng = await rasterise(browser, squared, APPLE_TOUCH_SIZE);
    await writeFile(path.join(PUBLIC_DIR, "apple-touch-icon.png"), applePng);
    console.log(`✅ apple-touch-icon.png (${APPLE_TOUCH_SIZE}×${APPLE_TOUCH_SIZE})`);
  } finally {
    await browser.close();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
