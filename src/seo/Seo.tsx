import { useEffect } from "react";
import { LOCALES } from "../i18n/locale";
import { OG_LOCALES, type PageMeta } from "./seoData";

const SITE_NAME = "Sans Allergènes";
const MANAGED_ATTRIBUTE = "data-seo-managed";

function syncMeta(attribute: "name" | "property", key: string, content?: string): void {
  const selector = `meta[${attribute}="${key}"]`;
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!content) {
    element?.remove();
    return;
  }

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
  element.setAttribute(MANAGED_ATTRIBUTE, "true");
}

function syncCanonical(canonical: string): void {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }
  element.setAttribute("href", canonical);
  element.setAttribute(MANAGED_ATTRIBUTE, "true");
}

/**
 * One <link rel="alternate" hreflang> per language, plus x-default on the French page: the site's
 * original language, for visitors whose language has no version of its own.
 */
export function alternateLinks(meta: PageMeta): Array<{ hreflang: string; href: string }> {
  return [
    ...LOCALES.map((locale) => ({ hreflang: locale, href: meta.alternates[locale] })),
    { hreflang: "x-default", href: meta.alternates.fr },
  ];
}

function syncAlternates(meta: PageMeta): void {
  document.head
    .querySelectorAll('link[rel="alternate"][hreflang]')
    .forEach((element) => element.remove());
  for (const { hreflang, href } of alternateLinks(meta)) {
    const element = document.createElement("link");
    element.setAttribute("rel", "alternate");
    element.setAttribute("hreflang", hreflang);
    element.setAttribute("href", href);
    element.setAttribute(MANAGED_ATTRIBUTE, "true");
    document.head.appendChild(element);
  }
}

/**
 * Keeps every share/search tag accurate during client-side navigation. The same values are
 * written into the prerendered HTML by scripts/prerender.ts for crawlers that do not run JS.
 */
export function Seo({ meta }: { meta: PageMeta }) {
  useEffect(() => {
    document.title = meta.title;
    document.documentElement.lang = meta.locale;
    document.querySelector("title")?.setAttribute(MANAGED_ATTRIBUTE, "true");

    syncMeta("name", "description", meta.description);
    syncCanonical(meta.canonical);
    syncAlternates(meta);

    syncMeta("property", "og:title", meta.title);
    syncMeta("property", "og:description", meta.description);
    syncMeta("property", "og:url", meta.canonical);
    syncMeta("property", "og:type", "website");
    syncMeta("property", "og:site_name", SITE_NAME);
    syncMeta("property", "og:locale", OG_LOCALES[meta.locale]);
    syncMeta("property", "og:image", meta.ogImage);
    syncMeta(
      "property",
      "og:image:secure_url",
      meta.ogImage?.startsWith("https://") ? meta.ogImage : undefined,
    );
    syncMeta("property", "og:image:type", meta.ogImageType);
    syncMeta("property", "og:image:width", meta.ogImageWidth?.toString());
    syncMeta("property", "og:image:height", meta.ogImageHeight?.toString());
    syncMeta("property", "og:image:alt", meta.ogImageAlt);

    syncMeta("name", "twitter:card", meta.ogImage ? "summary_large_image" : "summary");
    syncMeta("name", "twitter:title", meta.title);
    syncMeta("name", "twitter:description", meta.description);
    syncMeta("name", "twitter:image", meta.ogImage);
    syncMeta("name", "twitter:image:alt", meta.ogImageAlt);
  }, [meta]);

  return null;
}
