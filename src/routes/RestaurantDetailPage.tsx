import { Link, useParams } from "react-router-dom";
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
      <div className="p-6">
        <p>Restaurant introuvable.</p>
        <Link to="/" className="text-brand-600 underline">
          Retour à la liste
        </Link>
      </div>
    );
  }

  const meta = buildRestaurantMeta(
    restaurant,
    typeof window !== "undefined" ? window.location.origin : "",
  );

  return (
    <div className="mx-auto max-w-3xl p-4">
      <Seo title={meta.title} description={meta.description} />
      <Link to="/" className="mb-4 inline-block text-sm text-brand-600 underline">
        ← Retour à la liste
      </Link>
      <RestaurantDetailView restaurant={restaurant} />
    </div>
  );
}
