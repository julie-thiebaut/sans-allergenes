import { useContext } from "react";
import { UNSAFE_LocationContext } from "react-router-dom";
import { localeFromPathname, type Locale } from "./locale";
import { MESSAGES, type Messages } from "./messages";

export { MESSAGES };

/**
 * The page's language, from its address. Read through the router's context rather than
 * `useLocation()`, which throws outside a router: some component tests render without one, and
 * get French, the site's language before /en/ existed.
 */
export function useLocale(): Locale {
  // The context is null outside a router, whatever its declared type says.
  const context = useContext(UNSAFE_LocationContext) as { location?: { pathname: string } } | null;
  return context?.location ? localeFromPathname(context.location.pathname) : "fr";
}

export function useMessages(): Messages {
  return MESSAGES[useLocale()];
}

export type { Locale, Messages };
