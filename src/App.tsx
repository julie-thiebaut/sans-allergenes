import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Footer } from "./components/layout/Footer";
import { DataProvider } from "./data/DataProvider";
import { MapsProvider } from "./maps/MapsProvider";
import { NotFoundPage } from "./routes/NotFoundPage";
import { HomePage } from "./routes/HomePage";
import { RestaurantDetailPage } from "./routes/RestaurantDetailPage";
import { PrerenderReadyMarker } from "./seo/PrerenderReadyMarker";

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <DataProvider>
        <MapsProvider>
          <PrerenderReadyMarker />
          {/* h-dvh (not min-h-screen) is deliberate: the home page's list panel scrolls
              INTERNALLY, which only works if the flex chain has a hard viewport-height cap —
              with min-h-*, the column grows to fit the list and the map stretches to match it.
              dvh rather than vh so mobile browser chrome doesn't push content off-screen.
              Routes that are ordinary long documents scroll inside their own container. */}
          <div className="flex h-dvh flex-col">
            <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/restaurant/:slug" element={<RestaurantDetailPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </MapsProvider>
      </DataProvider>
    </BrowserRouter>
  );
}
