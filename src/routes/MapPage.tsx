import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { Navbar } from "../components/layout/Navbar";
import { SplitView } from "../components/layout/SplitView";
import { useDataContext } from "../data/DataProvider";
import { Seo } from "../seo/Seo";
import { buildMapMeta } from "../seo/seoData";
import { MapActionsProvider } from "../state/mapActionsContext";
import { MapBoundsProvider } from "../state/mapBoundsContext";
import { SelectionProvider } from "../state/SelectionContext";
import { useUrlFilterSync } from "../state/useUrlFilterSync";

const MAP_META = buildMapMeta(typeof window !== "undefined" ? window.location.origin : "");

function MapPageContent() {
  useUrlFilterSync();
  const data = useDataContext();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Navbar />
      {data.status === "loading" && <LoadingState label="Chargement des restaurants…" />}
      {data.status === "error" && <ErrorState message={data.message} />}
      {data.status === "ready" && <SplitView allRestaurants={data.restaurants} />}
    </div>
  );
}

export function MapPage() {
  return (
    <SelectionProvider>
      <MapBoundsProvider>
        <MapActionsProvider>
          <Seo title={MAP_META.title} description={MAP_META.description} />
          <MapPageContent />
        </MapActionsProvider>
      </MapBoundsProvider>
    </SelectionProvider>
  );
}
