import { BrowserRouter, Route, Routes } from "react-router-dom";
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
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/restaurant/:slug" element={<RestaurantDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MapsProvider>
      </DataProvider>
    </BrowserRouter>
  );
}
