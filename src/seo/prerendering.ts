/**
 * True while scripts/prerender.ts captures the page, which it opens with ?__prerender=1. Read once,
 * as the app starts: useUrlFilterSync rewrites the query string when the map page mounts, which
 * drops the flag before most components could look for it.
 */
export const IS_PRERENDERING =
  typeof window !== "undefined" && new URLSearchParams(window.location.search).has("__prerender");
