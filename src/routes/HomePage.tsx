import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { SplitView } from "../components/layout/SplitView";
import { useDataContext } from "../data/DataProvider";
import { Seo } from "../seo/Seo";
import { buildHomeMeta } from "../seo/seoData";
import { FilterStateProvider } from "../state/FilterStateContext";
import { MapBoundsProvider } from "../state/mapBoundsContext";
import { SelectionProvider } from "../state/SelectionContext";
import { useUrlFilterSync } from "../state/useUrlFilterSync";

const HOME_META = buildHomeMeta(typeof window !== "undefined" ? window.location.origin : "");

function HomePageContent() {
  useUrlFilterSync();
  const data = useDataContext();

  if (data.status === "loading") {
    return <LoadingState label="Chargement des restaurants…" />;
  }
  if (data.status === "error") {
    return <ErrorState message={data.message} />;
  }

  return <SplitView allRestaurants={data.restaurants} />;
}

export function HomePage() {
  return (
    <FilterStateProvider>
      <SelectionProvider>
        <MapBoundsProvider>
          <Seo title={HOME_META.title} description={HOME_META.description} />
          <HomePageContent />
        </MapBoundsProvider>
      </SelectionProvider>
    </FilterStateProvider>
  );
}
