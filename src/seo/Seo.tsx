import { useEffect } from "react";

/**
 * Client-side title/description updates for SPA navigation between already-prerendered
 * pages (which ship correct meta tags baked in for crawlers — this just keeps the browser
 * tab in sync during in-app navigation, it doesn't replace the build-time prerender step).
 */
export function Seo({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    document.title = title;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
  }, [title, description]);

  return null;
}
