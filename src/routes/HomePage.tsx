import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { Navbar } from "../components/layout/Navbar";
import { SplitView } from "../components/layout/SplitView";
import { useDataContext } from "../data/DataProvider";
import { Seo } from "../seo/Seo";
import { buildHomeMeta } from "../seo/seoData";
import { MapActionsProvider } from "../state/mapActionsContext";
import { MapBoundsProvider } from "../state/mapBoundsContext";
import { SelectionProvider } from "../state/SelectionContext";
import { useUrlFilterSync } from "../state/useUrlFilterSync";

const HOME_META = buildHomeMeta(typeof window !== "undefined" ? window.location.origin : "");

function HomePageContent() {
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

export function HomePage() {
  return (
    <SelectionProvider>
      <MapBoundsProvider>
        <MapActionsProvider>
          <Seo title={HOME_META.title} description={HOME_META.description} />
          <HomePageContent />
        </MapActionsProvider>
      </MapBoundsProvider>
    </SelectionProvider>
  );
}
