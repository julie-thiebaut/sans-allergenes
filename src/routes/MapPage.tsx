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
import { useLocale, useMessages } from "../i18n/useLocale";

const ORIGIN = typeof window !== "undefined" ? window.location.origin : "";
const MAP_META = { fr: buildMapMeta(ORIGIN, "fr"), en: buildMapMeta(ORIGIN, "en") };

function MapPageContent() {
  useUrlFilterSync();
  const data = useDataContext();
  const t = useMessages();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Navbar />
      {/* Le seul titre de la page : la carte n'en affiche aucun, mais moteurs de recherche et
          lecteurs d'écran en attendent un. */}
      <h1 className="sr-only">{t.mapPage.heading}</h1>
      {data.status === "loading" && <LoadingState label={t.mapPage.loadingRestaurants} />}
      {data.status === "error" && <ErrorState message={data.message} />}
      {data.status === "ready" && <SplitView allRestaurants={data.restaurants} />}
    </div>
  );
}

export function MapPage() {
  const locale = useLocale();
  return (
    <SelectionProvider>
      <MapBoundsProvider>
        <MapActionsProvider>
          <Seo meta={MAP_META[locale]} />
          <MapPageContent />
        </MapActionsProvider>
      </MapBoundsProvider>
    </SelectionProvider>
  );
}
