import { arrondissementFromPostalCode } from "../../utils/arrondissement";
import { formatVerifiedDate } from "../../utils/formatDate";
import { filterMenuAgainstAvoidance } from "../../filtering/allergenLogic";
import { useFilterState } from "../../state/FilterStateContext";
import { useMediaQuery } from "../../utils/useMediaQuery";
import { AllergensToAvoidFilter } from "../filters/AllergensToAvoidFilter";
import { MobileFilterSheet } from "../filters/MobileFilterSheet";
import type { RestaurantWithMenu } from "../../data/types";
import { AllergenAvailabilityBadge } from "../common/AllergenAvailabilityBadge";
import { AllergenWarningIcon } from "../common/AllergenWarningIcon";
import { DemoDataBadge } from "../common/DemoDataBadge";
import { ImageWithPlaceholder } from "../common/ImageWithPlaceholder";
import { PriceLevelIndicator } from "../common/PriceLevelIndicator";
import { AllergenSafetyDisclaimer } from "./AllergenSafetyDisclaimer";
import { MenuSection } from "./MenuSection";

const MENU_FILTER_DESCRIPTION =
  "Les plats déclarant cet allergène comme présent sont masqués. Les plats « traces possibles » " +
  "et ceux sans information restent affichés : leur présence dans la carte ne constitue jamais " +
  "une garantie.";

export function RestaurantDetailView({ restaurant }: { restaurant: RestaurantWithMenu }) {
  const arrondissement = arrondissementFromPostalCode(restaurant.postalCode);
  const { allergensToAvoid } = useFilterState();
  // Rendered in one place or the other, never both: two copies would mean duplicate checkboxes
  // for the same allergen in the accessibility tree.
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const menu =
    restaurant.allergenInformationAvailable && restaurant.menu
      ? filterMenuAgainstAvoidance(restaurant.menu, allergensToAvoid)
      : null;

  return (
    <article>
      <header className="mb-6">
        <ImageWithPlaceholder
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="h-56 w-full rounded-lg object-cover"
        />
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {!restaurant.allergenInformationAvailable && <AllergenWarningIcon />}
          <h1 className="text-2xl font-bold text-neutral-900">{restaurant.name}</h1>
          {restaurant.isDemoData && <DemoDataBadge />}
        </div>
        <p className="mt-1 text-neutral-600">
          {restaurant.address}, {restaurant.postalCode} {restaurant.city}
          {arrondissement ? ` — ${arrondissement}` : ""}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-neutral-700">
          <span>{restaurant.cuisineTypes.join(", ")}</span>
          <PriceLevelIndicator level={restaurant.priceLevel} />
          {restaurant.vegetarianOptions && <span>Options végétariennes</span>}
          {restaurant.veganOptions && <span>Options véganes</span>}
          <AllergenAvailabilityBadge available={restaurant.allergenInformationAvailable} />
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          {restaurant.websiteUrl && (
            <a
              href={restaurant.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-500 underline hover:text-brand-700"
            >
              Site du restaurant
            </a>
          )}
          {restaurant.phone && <span>{restaurant.phone}</span>}
        </div>
      </header>

      <AllergenSafetyDisclaimer />

      <div className="mt-6 space-y-8">
        {restaurant.description && <p className="text-neutral-700">{restaurant.description}</p>}

        {menu ? (
          <>
            {isDesktop ? (
              <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4">
                <AllergensToAvoidFilter description={MENU_FILTER_DESCRIPTION} />
              </div>
            ) : (
              <MobileFilterSheet title="Filtrer la carte">
                <AllergensToAvoidFilter description={MENU_FILTER_DESCRIPTION} />
              </MobileFilterSheet>
            )}

            {menu.excludedDishCount > 0 && (
              <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
                {menu.excludedDishCount}{" "}
                {menu.excludedDishCount > 1 ? "plats masqués" : "plat masqué"} : l&rsquo;allergène
                à éviter y est déclaré présent.
              </p>
            )}

            {menu.categories.length > 0 ? (
              menu.categories.map((category) => (
                <MenuSection key={category.category} category={category} />
              ))
            ) : (
              <p className="rounded-md border border-neutral-300 bg-neutral-50 p-4 text-neutral-700">
                Aucun plat de cette carte ne correspond aux allergènes à éviter sélectionnés.
              </p>
            )}
          </>
        ) : (
          <p className="rounded-md border border-red-300 bg-red-50 p-4 text-red-800">
            Aucune information sur les allergènes n&rsquo;est disponible pour ce restaurant.
            Contactez directement l&rsquo;établissement avant de commander si vous avez une
            allergie.
          </p>
        )}
      </div>

      <footer className="mt-8 border-t border-neutral-200 pt-4 text-sm text-neutral-500">
        {restaurant.source && (
          <p>
            Source :{" "}
            {restaurant.source.url ? (
              <a
                href={restaurant.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {restaurant.source.label}
              </a>
            ) : (
              restaurant.source.label
            )}
          </p>
        )}
        {restaurant.lastVerifiedAt && (
          <p>Dernière vérification : {formatVerifiedDate(restaurant.lastVerifiedAt)}</p>
        )}
      </footer>
    </article>
  );
}
