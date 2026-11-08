import { chromium } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Renders public/og-image.png, the picture shown when a link to the site is shared. Run it after
 * changing the wording or the illustration (`npm run share-image`).
 *
 * The same image is shown for a restaurant's page, so its wording stays factual: the hero's
 * "sans allergènes" line would read here as a safety claim about that restaurant.
 *
 * Playwright is the rasteriser for the same reason as in generate-favicons.ts.
 */

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WIDTH = 1200;
const HEIGHT = 630;

async function main(): Promise<void> {
  const illustration = await readFile(path.join(ROOT, "src", "assets", "cafe-still.svg"));
  const illustrationUrl = `data:image/svg+xml;base64,${illustration.toString("base64")}`;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });
  await page.setContent(`
    <body style="margin:0;width:${WIDTH}px;height:${HEIGHT}px;box-sizing:border-box;padding:64px;
      display:flex;align-items:center;gap:40px;background:linear-gradient(#fef8e7,#fff);
      border-bottom:16px solid #f1b104;color:#171717;
      font-family:ui-sans-serif,system-ui,'Segoe UI',Roboto,sans-serif">
      <div style="flex:1.15">
        <div style="font-size:38px;font-weight:700">
          <span style="background:#f1b104;padding:0 10px">sans</span>Allergènes
        </div>
        <div style="margin-top:44px;font-size:62px;font-weight:700;line-height:1.1">
          Les allergènes des restaurants,<br />plat par plat
        </div>
        <div style="margin-top:28px;font-size:30px;line-height:1.3;color:#404040">
          Les déclarations des restaurants, réunies sur une carte.
        </div>
      </div>
      <img src="${illustrationUrl}" alt="" style="flex:1;min-width:0;height:auto" />
    </body>`);
  await page.waitForLoadState("networkidle");
  const png = await page.screenshot();
  await browser.close();

  await writeFile(path.join(ROOT, "public", "og-image.png"), png);
  console.log(`✅ og-image.png (${WIDTH}×${HEIGHT}, ${Math.round(png.length / 1024)} Ko) généré.`);
}

main().catch((error: unknown) => {
  console.error("❌ Échec de la génération de l'image de partage :", error);
  process.exit(1);
});
