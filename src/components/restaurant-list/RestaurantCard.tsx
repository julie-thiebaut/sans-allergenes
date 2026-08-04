import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  assessMenuAgainstAvoidance,
  countDishesDeclaringAvoided,
} from "../../filtering/allergenLogic";
import type { RestaurantWithMenu } from "../../data/types";
import { useFilterState } from "../../state/FilterStateContext";
import { useSelectionContext } from "../../state/SelectionContext";
import { arrondissementFromPostalCode } from "../../utils/arrondissement";
import { formatVerifiedDate } from "../../utils/formatDate";
import { AllergenAvailabilityBadge } from "../common/AllergenAvailabilityBadge";
import { AllergenWarningIcon } from "../common/AllergenWarningIcon";
import { DemoDataBadge } from "../common/DemoDataBadge";
import { ImageWithPlaceholder } from "../common/ImageWithPlaceholder";
import { PriceLevelIndicator } from "../common/PriceLevelIndicator";

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-brand-100 px-2 py-0.5 font-medium text-brand-800">
      {children}
    </span>
  );
}

export function RestaurantCard({ restaurant }: { restaurant: RestaurantWithMenu }) {
  const { hoveredId, selectedId, setHoveredId, setSelectedId } = useSelectionContext();
  const filters = useFilterState();
  const arrondissement = arrondissementFromPostalCode(restaurant.postalCode);
  const isHighlighted = hoveredId === restaurant.id || selectedId === restaurant.id;
  const isWarning = !restaurant.allergenInformationAvailable;

  // A restaurant is only excluded when EVERY dish declares an avoided allergen, so cards here
  // may still have some offending dishes — the count says how many, rather than leaving the
  // user to discover it after opening the menu.
  const avoidanceAssessment =
    filters.allergensToAvoid.length > 0
      ? assessMenuAgainstAvoidance(restaurant.menu, filters.allergensToAvoid)
      : null;
  const { declaring, total } =
    filters.allergensToAvoid.length > 0
      ? countDishesDeclaringAvoided(restaurant.menu, filters.allergensToAvoid)
      : { declaring: 0, total: 0 };

  return (
    <article
      className={`group relative rounded-lg border p-3 transition-colors ${
        isHighlighted
          ? isWarning
            ? "border-red-400 bg-red-50"
            : "border-brand-500 bg-brand-50"
          : "border-neutral-200 bg-white"
      }`}
      onMouseEnter={() => setHoveredId(restaurant.id)}
      onMouseLeave={() => setHoveredId(null)}
    >
      <div className="flex gap-3">
        {/* Fixed width, height driven by the text column beside it. The image is positioned
            absolutely inside this wrapper so it fills whatever height the row ends up with,
            including the cases where an allergen notice adds a line. min-height keeps it from
            collapsing if a card ever carries very little text. */}
        <div className="relative min-h-[6rem] w-24 shrink-0 overflow-hidden rounded-md">
          <ImageWithPlaceholder
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="flex items-center gap-1 font-semibold text-neutral-900">
              {isWarning && <AllergenWarningIcon />}
              <Link
                to={`/restaurant/${restaurant.slug}`}
                className="after:absolute after:inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                onFocus={() => setHoveredId(restaurant.id)}
                onBlur={() => setHoveredId(null)}
                onClick={() => setSelectedId(restaurant.id)}
              >
                {restaurant.name}
              </Link>
            </h3>
            <PriceLevelIndicator level={restaurant.priceLevel} />
          </div>
          <p className="truncate text-sm text-neutral-600">
            {arrondissement ?? restaurant.city} · {restaurant.address}
          </p>
          <p className="mt-1 text-sm text-neutral-700">{restaurant.cuisineTypes.join(", ")}</p>

          <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
            {restaurant.vegetarianOptions && <Badge>Végétarien</Badge>}
            {restaurant.veganOptions && <Badge>Végane</Badge>}
            {restaurant.isDemoData && <DemoDataBadge />}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
            <AllergenAvailabilityBadge available={restaurant.allergenInformationAvailable} />
            {restaurant.lastVerifiedAt && (
              <span className="text-xs text-neutral-500">
                Vérifié le {formatVerifiedDate(restaurant.lastVerifiedAt)}
              </span>
            )}
          </div>

          {declaring > 0 && (
            <p className="mt-1 text-xs font-medium text-amber-700">
              {declaring} plat{declaring > 1 ? "s" : ""} sur {total} déclare
              {declaring > 1 ? "nt" : ""} l&rsquo;allergène à éviter
            </p>
          )}
          {avoidanceAssessment === "may_contain_avoided" && (
            <p className="mt-1 text-xs font-medium text-amber-700">
              ⚠ Traces possibles de l&rsquo;allergène à éviter. Vérifiez avant de commander.
            </p>
          )}
          {avoidanceAssessment === "incomplete_info_for_avoided" && (
            <p className="mt-1 text-xs font-medium text-neutral-600">
              Information incomplète pour l&rsquo;allergène à éviter
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
