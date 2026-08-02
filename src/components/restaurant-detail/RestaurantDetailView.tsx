import { arrondissementFromPostalCode } from "../../utils/arrondissement";
import { formatVerifiedDate } from "../../utils/formatDate";
import type { RestaurantWithMenu } from "../../data/types";
import { AllergenAvailabilityBadge } from "../common/AllergenAvailabilityBadge";
import { AllergenWarningIcon } from "../common/AllergenWarningIcon";
import { DemoDataBadge } from "../common/DemoDataBadge";
import { ImageWithPlaceholder } from "../common/ImageWithPlaceholder";
import { PriceLevelIndicator } from "../common/PriceLevelIndicator";
import { AllergenSafetyDisclaimer } from "./AllergenSafetyDisclaimer";
import { MenuSection } from "./MenuSection";

export function RestaurantDetailView({ restaurant }: { restaurant: RestaurantWithMenu }) {
  const arrondissement = arrondissementFromPostalCode(restaurant.postalCode);

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

        {restaurant.allergenInformationAvailable && restaurant.menu ? (
          restaurant.menu.categories.map((category) => (
            <MenuSection key={category.category} category={category} />
          ))
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
