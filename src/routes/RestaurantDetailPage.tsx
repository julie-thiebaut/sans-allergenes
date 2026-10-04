import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ChevronIcon } from "../components/common/ChevronIcon";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { RestaurantDetailView } from "../components/restaurant-detail/RestaurantDetailView";
import { useDataContext } from "../data/DataProvider";
import { Seo } from "../seo/Seo";
import { buildRestaurantMeta } from "../seo/seoData";
import { useMapPageMemory, wasOpenedFromMapPage } from "../state/MapPageMemoryContext";

export function RestaurantDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const data = useDataContext();

  if (data.status === "loading") {
    return <LoadingState label="Chargement…" />;
  }
  if (data.status === "error") {
    return <ErrorState message={data.message} />;
  }

  const restaurant = data.restaurants.find((r) => r.slug === slug);
  if (!restaurant) {
    return (
      <div className="overflow-y-auto p-6">
        <p>Restaurant introuvable.</p>
        <Link to="/carte" className="text-brand-500 underline">
          Retour à la carte
        </Link>
      </div>
    );
  }

  const meta = buildRestaurantMeta(
    restaurant,
    typeof window !== "undefined" ? window.location.origin : "",
  );

  return (
    // Own scroll container: the app shell is viewport-height capped for the map/list split,
    // so this ordinary long document has to scroll itself rather than the page.
    <div className="mx-auto w-full max-w-3xl overflow-y-auto p-4">
      <Seo meta={meta} />
      <BackToMapPageLink />
      <RestaurantDetailView restaurant={restaurant} />
    </div>
  );
}

/**
 * A real "back" when the restaurant was opened from /carte: stepping back in history returns to
 * that entry (and its filter URL) instead of stacking a new /carte on top of the restaurant, so
 * the browser's own back button doesn't then lead back here. The page itself comes back as it
 * was left through MapPageMemory. Opened any other way (a search engine, a shared link), there
 * is nothing to step back to inside the site, and the plain link to /carte does the job.
 */
function BackToMapPageLink() {
  const location = useLocation();
  const navigate = useNavigate();
  const memory = useMapPageMemory();

  return (
    <Link
      to="/carte"
      onClick={(event) => {
        if (!wasOpenedFromMapPage(location.state)) return;
        // Leave a ctrl/cmd/middle click to the browser: it opens /carte in a new tab.
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
          return;
        event.preventDefault();
        navigate(-1);
      }}
      className="mb-4 inline-flex items-center gap-0.5 text-sm text-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
    >
      <ChevronIcon direction="left" />
      <span className="underline">
        {memory?.mobileView === "list" ? "Retour à la liste" : "Retour à la carte"}
      </span>
    </Link>
  );
}
