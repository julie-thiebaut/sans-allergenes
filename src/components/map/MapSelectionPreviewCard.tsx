import { Link } from "react-router-dom";
import type { RestaurantWithMenu } from "../../data/types";
import { arrondissementFromPostalCode } from "../../utils/arrondissement";
import { DemoDataBadge } from "../common/DemoDataBadge";
import { ImageWithPlaceholder } from "../common/ImageWithPlaceholder";
import { PriceLevelIndicator } from "../common/PriceLevelIndicator";

/**
 * Shown as an overlay on the map when a marker is selected — on mobile there's no list
 * visible alongside the map to scroll to, so tapping a marker needs its own preview
 * rather than relying on the (invisible) list highlight the desktop layout uses.
 */
export function MapSelectionPreviewCard({
  restaurant,
  onDismiss,
}: {
  restaurant: RestaurantWithMenu;
  onDismiss: () => void;
}) {
  const arrondissement = arrondissementFromPostalCode(restaurant.postalCode);

  return (
    <div className="absolute inset-x-3 bottom-3 z-10 flex gap-3 rounded-lg border border-neutral-200 bg-white p-3 shadow-lg">
      <ImageWithPlaceholder
        src={restaurant.imageUrl}
        alt={restaurant.name}
        className="h-16 w-16 shrink-0 rounded-md object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate font-semibold text-neutral-900">{restaurant.name}</h3>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Fermer l'aperçu"
            className="shrink-0 rounded p-1 text-neutral-500 hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600"
          >
            ✕
          </button>
        </div>
        <p className="truncate text-sm text-neutral-600">
          {arrondissement ?? restaurant.city} · {restaurant.cuisineTypes.join(", ")}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500">
          <PriceLevelIndicator level={restaurant.priceLevel} />
          <span>
            {restaurant.allergenInformationAvailable
              ? "Infos allergènes disponibles"
              : "Infos allergènes non disponibles"}
          </span>
          {restaurant.isDemoData && <DemoDataBadge />}
        </div>
        <Link
          to={`/restaurant/${restaurant.slug}`}
          className="mt-2 inline-block text-sm font-medium text-brand-600 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600"
        >
          Voir la fiche →
        </Link>
      </div>
    </div>
  );
}
