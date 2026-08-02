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
          <div className="flex min-h-screen flex-col">
            <main className="flex min-h-0 flex-1 flex-col">
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
