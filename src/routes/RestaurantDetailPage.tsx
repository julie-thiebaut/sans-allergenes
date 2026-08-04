import { Link, useParams } from "react-router-dom";
import { ChevronIcon } from "../components/common/ChevronIcon";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { RestaurantDetailView } from "../components/restaurant-detail/RestaurantDetailView";
import { useDataContext } from "../data/DataProvider";
import { Seo } from "../seo/Seo";
import { buildRestaurantMeta } from "../seo/seoData";

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
      <Seo title={meta.title} description={meta.description} />
      <Link
        to="/carte"
        className="mb-4 inline-flex items-center gap-0.5 text-sm text-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
      >
        <ChevronIcon direction="left" />
        <span className="underline">Retour à la carte</span>
      </Link>
      <RestaurantDetailView restaurant={restaurant} />
    </div>
  );
}
