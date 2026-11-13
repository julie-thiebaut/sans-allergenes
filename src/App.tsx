import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AnalyticsConsentProvider } from "./analytics/AnalyticsConsent";
import { Footer } from "./components/layout/Footer";
import { DataProvider } from "./data/DataProvider";
import { MapsProvider } from "./maps/MapsProvider";
import { FilterStateProvider } from "./state/FilterStateContext";
import { MapPageMemoryProvider } from "./state/MapPageMemoryContext";
import { NotFoundPage } from "./routes/NotFoundPage";
import { LandingPage } from "./routes/LandingPage";
import { MapPage } from "./routes/MapPage";
import { RestaurantDetailPage } from "./routes/RestaurantDetailPage";
import { LegalNoticePage } from "./routes/LegalNoticePage";
import { PrivacyPage } from "./routes/PrivacyPage";
import { AllergensOnlineNotePage } from "./routes/AllergensOnlineNotePage";
import { PrerenderReadyMarker } from "./seo/PrerenderReadyMarker";
import { ContentTranslationsProvider } from "./i18n/ContentTranslations";
import { PAGE_PATHS } from "./i18n/locale";
import { AllergensOnlineNotePageEn } from "./routes/en/AllergensOnlineNotePageEn";
import { LegalNoticePageEn } from "./routes/en/LegalNoticePageEn";
import { PrivacyPageEn } from "./routes/en/PrivacyPageEn";

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AnalyticsConsentProvider>
        <DataProvider>
          {/* English pages (under /en/) load the translated restaurant texts through this. */}
          <ContentTranslationsProvider>
            <MapsProvider>
              {/* Above the router so the chosen allergens survive navigating from the list into a
                restaurant and back — the same avoidance set filters both views. */}
              <FilterStateProvider>
                {/* Same reason: list or map, zoom, scroll and selection are how /carte was left,
                  and "Retour" from a restaurant should find them as they were. */}
                <MapPageMemoryProvider>
                  <PrerenderReadyMarker />
                  {/* h-dvh (not min-h-screen) is deliberate: the home page's list panel scrolls
                    INTERNALLY, which only works if the flex chain has a hard viewport-height cap —
                    with min-h-*, the column grows to fit the list and the map stretches to match it.
                    dvh rather than vh so mobile browser chrome doesn't push content off-screen.
                    Routes that are ordinary long documents scroll in their own container. */}
                  <div className="flex h-dvh flex-col">
                    <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
                      <Routes>
                        <Route path={PAGE_PATHS.home.fr} element={<LandingPage />} />
                        <Route path={PAGE_PATHS.map.fr} element={<MapPage />} />
                        <Route path="/restaurant/:slug" element={<RestaurantDetailPage />} />
                        <Route path={PAGE_PATHS.legal.fr} element={<LegalNoticePage />} />
                        <Route path={PAGE_PATHS.privacy.fr} element={<PrivacyPage />} />
                        <Route
                          path={PAGE_PATHS.allergensOnlineNote.fr}
                          element={<AllergensOnlineNotePage />}
                        />
                        {/* The same pages in English: the components read the language from the
                          address, except the long texts, which have an English page of their own. */}
                        <Route path={PAGE_PATHS.home.en} element={<LandingPage />} />
                        <Route path={PAGE_PATHS.map.en} element={<MapPage />} />
                        <Route path="/en/restaurant/:slug" element={<RestaurantDetailPage />} />
                        <Route path={PAGE_PATHS.legal.en} element={<LegalNoticePageEn />} />
                        <Route path={PAGE_PATHS.privacy.en} element={<PrivacyPageEn />} />
                        <Route
                          path={PAGE_PATHS.allergensOnlineNote.en}
                          element={<AllergensOnlineNotePageEn />}
                        />
                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                </MapPageMemoryProvider>
              </FilterStateProvider>
            </MapsProvider>
          </ContentTranslationsProvider>
        </DataProvider>
      </AnalyticsConsentProvider>
    </BrowserRouter>
  );
}
