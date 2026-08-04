import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Footer } from "./components/layout/Footer";
import { DataProvider } from "./data/DataProvider";
import { MapsProvider } from "./maps/MapsProvider";
import { FilterStateProvider } from "./state/FilterStateContext";
import { NotFoundPage } from "./routes/NotFoundPage";
import { LandingPage } from "./routes/LandingPage";
import { MapPage } from "./routes/MapPage";
import { RestaurantDetailPage } from "./routes/RestaurantDetailPage";
import { PrerenderReadyMarker } from "./seo/PrerenderReadyMarker";

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <DataProvider>
        <MapsProvider>
          {/* Above the router so the chosen allergens survive navigating from the list into a
              restaurant and back — the same avoidance set filters both views. */}
          <FilterStateProvider>
            <PrerenderReadyMarker />
            {/* h-dvh (not min-h-screen) is deliberate: the home page's list panel scrolls
                INTERNALLY, which only works if the flex chain has a hard viewport-height cap —
                with min-h-*, the column grows to fit the list and the map stretches to match it.
                dvh rather than vh so mobile browser chrome doesn't push content off-screen.
                Routes that are ordinary long documents scroll in their own container. */}
            <div className="flex h-dvh flex-col">
              <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/carte" element={<MapPage />} />
                  <Route path="/restaurant/:slug" element={<RestaurantDetailPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </FilterStateProvider>
        </MapsProvider>
      </DataProvider>
    </BrowserRouter>
  );
}
