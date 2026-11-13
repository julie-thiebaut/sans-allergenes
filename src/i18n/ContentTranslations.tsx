import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  ContentTranslationFileSchema,
  localizeText,
  type ContentTranslationFile,
  type LocalizedText,
} from "./contentTranslation";
import type { Locale } from "./locale";
import { useLocale } from "./useLocale";

export type { ContentTranslationFile, LocalizedText };

/** Loads public/data/translations/en.json; see contentTranslation.ts for why it is keyed by text. */
type TranslationState =
  | { status: "loading" }
  | { status: "ready"; table: ContentTranslationFile }
  | { status: "unavailable" };

const ContentTranslationsContext = createContext<TranslationState>({ status: "unavailable" });

export function translationsUrl(locale: Exclude<Locale, "fr">): string {
  return `${import.meta.env.BASE_URL}data/translations/${locale}.json`;
}

/** Loads the English table the first time an English page is opened, and keeps it after. */
export function ContentTranslationsProvider({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const [state, setState] = useState<TranslationState>(() =>
    locale === "en" ? { status: "loading" } : { status: "unavailable" },
  );
  const needed = locale === "en";
  const loaded = state.status === "ready";

  useEffect(() => {
    if (!needed || loaded) return;
    let cancelled = false;
    setState({ status: "loading" });
    void (async () => {
      try {
        const response = await fetch(translationsUrl("en"));
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const table = ContentTranslationFileSchema.parse(await response.json());
        if (!cancelled) setState({ status: "ready", table });
      } catch (error) {
        // Without the table, the texts stay in French: nothing is hidden, nothing is invented.
        console.error("Échec du chargement des traductions", error);
        if (!cancelled) setState({ status: "unavailable" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [needed, loaded]);

  return (
    <ContentTranslationsContext.Provider value={state}>
      {children}
    </ContentTranslationsContext.Provider>
  );
}

export function useContentTranslationsStatus(): TranslationState["status"] {
  return useContext(ContentTranslationsContext).status;
}

/** `localize(restaurant.description)`: the text in the page's language when a translation exists. */
export function useLocalizeText(): (french: string) => LocalizedText {
  const locale = useLocale();
  const state = useContext(ContentTranslationsContext);
  const table = state.status === "ready" ? state.table : undefined;
  return (french) => localizeText(french, locale, table);
}

/** The loaded table, for code that builds texts outside a component's render (search metadata). */
export function useContentTranslationTable(): ContentTranslationFile | undefined {
  const state = useContext(ContentTranslationsContext);
  return state.status === "ready" ? state.table : undefined;
}
