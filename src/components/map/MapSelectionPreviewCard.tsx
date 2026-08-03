import { Link } from "react-router-dom";
import type { RestaurantWithMenu } from "../../data/types";
import { arrondissementFromPostalCode } from "../../utils/arrondissement";
import { AllergenAvailabilityBadge } from "../common/AllergenAvailabilityBadge";
import { AllergenWarningIcon } from "../common/AllergenWarningIcon";
import { ChevronIcon } from "../common/ChevronIcon";
import { DemoDataBadge } from "../common/DemoDataBadge";
import { ImageWithPlaceholder } from "../common/ImageWithPlaceholder";
import { PriceLevelIndicator } from "../common/PriceLevelIndicator";

/**
 * Shown as an overlay when a marker is selected — on mobile there's no list visible
 * alongside the map to scroll to, so tapping a marker needs its own preview rather than
 * relying on the (invisible) list highlight the desktop layout uses.
 *
 * Positioned `fixed` to the viewport rather than `absolute` within the map: the map now
 * fills the full available height, so a card anchored to the map's own bottom edge could
 * land right at (or past) the visible screen edge on real phones — mobile browser chrome
 * (address bar, etc.) makes the actual visible viewport shorter than the layout height in
 * a way `absolute` positioning doesn't account for. `fixed` always keeps it fully on-screen.
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
    <div
      className={`fixed inset-x-3 bottom-3 z-10 flex gap-3 rounded-lg border p-3 shadow-lg ${
        restaurant.allergenInformationAvailable
          ? "border-neutral-200 bg-white"
          : "border-red-400 bg-red-50"
      }`}
    >
      <ImageWithPlaceholder
        src={restaurant.imageUrl}
        alt={restaurant.name}
        className="h-16 w-16 shrink-0 rounded-md object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1">
            {!restaurant.allergenInformationAvailable && <AllergenWarningIcon />}
            <h3 className="truncate font-semibold text-neutral-900">{restaurant.name}</h3>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Fermer l'aperçu"
            className="shrink-0 rounded p-1 text-neutral-500 hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
          >
            ✕
          </button>
        </div>
        <p className="truncate text-sm text-neutral-600">
          {arrondissement ?? restaurant.city} · {restaurant.cuisineTypes.join(", ")}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
          <PriceLevelIndicator level={restaurant.priceLevel} />
          <AllergenAvailabilityBadge available={restaurant.allergenInformationAvailable} />
          {restaurant.isDemoData && <DemoDataBadge />}
        </div>
        <Link
          to={`/restaurant/${restaurant.slug}`}
          className="mt-2 inline-flex items-center gap-0.5 text-sm font-medium text-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
        >
          {/* Underline on the text only, so it isn't dragged through the chevron. */}
          <span className="underline">Voir la fiche</span>
          <ChevronIcon />
        </Link>
      </div>
    </div>
  );
}
