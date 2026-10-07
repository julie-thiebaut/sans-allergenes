import { cuisineLine } from "../../utils/cuisineLine";
import { formatVerifiedDate } from "../../utils/formatDate";
import { fullAddress } from "../../utils/fullAddress";
import { filterMenuAgainstAvoidance } from "../../filtering/allergenLogic";
import { useFilterState } from "../../state/FilterStateContext";
import { useMediaQuery } from "../../utils/useMediaQuery";
import { AllergensToAvoidFilter } from "../filters/AllergensToAvoidFilter";
import { ExcludeTracesFilter } from "../filters/ExcludeTracesFilter";
import { MobileFilterSheet } from "../filters/MobileFilterSheet";
import type { RestaurantWithMenu } from "../../data/types";
import { AllergenAvailabilityBadge } from "../common/AllergenAvailabilityBadge";
import { AllergenWarningIcon } from "../common/AllergenWarningIcon";
import { DemoDataBadge } from "../common/DemoDataBadge";
import { ImageWithPlaceholder } from "../common/ImageWithPlaceholder";
import { PriceLevelIndicator } from "../common/PriceLevelIndicator";
import { AllergenSafetyDisclaimer } from "./AllergenSafetyDisclaimer";
import { MenuSection } from "./MenuSection";
import { ContactRestaurantCallout, ReportProblemLink } from "./RestaurantContact";

function menuFilterDescription(excludeTraces: boolean, several = false): string {
  const allergen = several ? "l’un de ces allergènes" : "cet allergène";
  return excludeTraces
    ? `Les plats déclarant ${allergen}, présent ou en traces, sont masqués. Ceux sans ` +
        "information restent affichés : leur présence dans la carte ne constitue jamais une " +
        "garantie."
    : `Les plats déclarant ${allergen} comme présent sont masqués. Les plats « traces ` +
        "possibles » et ceux sans information restent affichés : leur présence dans la carte ne " +
        "constitue jamais une garantie.";
}

// « 3 plats et 2 boissons masqués », « 1 boisson masquée » : les boissons sont comptées à part.
function describeHidden(dishCount: number, drinkCount: number): string {
  const dishes = `${dishCount} plat${dishCount > 1 ? "s" : ""}`;
  const drinks = `${drinkCount} boisson${drinkCount > 1 ? "s" : ""}`;
  if (drinkCount === 0) return `${dishes} masqué${dishCount > 1 ? "s" : ""}`;
  if (dishCount === 0) return `${drinks} masquée${drinkCount > 1 ? "s" : ""}`;
  return `${dishes} et ${drinks} masqués`;
}

export function RestaurantDetailView({ restaurant }: { restaurant: RestaurantWithMenu }) {
  const { allergensToAvoid, excludeTraces } = useFilterState();
  // Rendered in one place or the other, never both: two copies would mean duplicate checkboxes
  // for the same allergen in the accessibility tree.
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const menu =
    restaurant.allergenInformationAvailable && restaurant.menu
      ? filterMenuAgainstAvoidance(restaurant.menu, allergensToAvoid, { excludeTraces })
      : null;
  const menuFilter = (
    <div className="space-y-3">
      <AllergensToAvoidFilter
        description={menuFilterDescription(excludeTraces, allergensToAvoid.length > 1)}
      />
      <ExcludeTracesFilter />
    </div>
  );

  return (
    <article>
      {/* Sur mobile, 1 rem entre l'en-tête et la description, comme autour du bouton de filtre
          plus bas : les deux marges se confondent, elles changent donc ensemble. */}
      <header className={isDesktop ? "mb-6" : "mb-4"}>
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
        <p className="mt-1 text-neutral-600">{fullAddress(restaurant)}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-neutral-700">
          <span>{cuisineLine(restaurant)}</span>
          <PriceLevelIndicator level={restaurant.priceLevel} />
          {!restaurant.allergenInformationAvailable && <AllergenAvailabilityBadge />}
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

      <div className={`${isDesktop ? "mt-6" : "mt-4"} space-y-8`}>
        {restaurant.description && <p className="text-neutral-700">{restaurant.description}</p>}

        {menu ? (
          // Sur mobile, le bouton de filtre n'a qu'1 rem au-dessus et au-dessous, au lieu des 2 rem
          // qui séparent les blocs de la fiche : c'est une ligne presque vide, qui repoussait les
          // plats vers le bas de l'écran. D'où ce bloc commun au filtre et à la carte, et le `!`
          // qui l'emporte sur le `space-y-8` du parent.
          <div className={isDesktop ? undefined : "!mt-4"}>
            {isDesktop ? (
              <div className="rounded-md border border-neutral-200 bg-neutral-50 p-4">
                {menuFilter}
              </div>
            ) : (
              <div className="flex justify-end">
                <MobileFilterSheet title="Filtrer par allergènes">{menuFilter}</MobileFilterSheet>
              </div>
            )}

            <div className={`${isDesktop ? "mt-8" : "mt-4"} space-y-8`}>
              {(menu.excludedDishCount > 0 || menu.excludedDrinkCount > 0) && (
                <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
                  {describeHidden(menu.excludedDishCount, menu.excludedDrinkCount)} :{" "}
                  {allergensToAvoid.length > 1 ? "un des allergènes" : "l’allergène"} à éviter y est
                  déclaré{excludeTraces ? ", présent ou en traces." : " présent."}
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
            </div>
          </div>
        ) : restaurant.allergenInformationAvailable ? (
          // The restaurant does publish its allergens, we simply don't republish them dish by
          // dish (typically because the source is a scanned grid that cannot be transcribed
          // without risking a mistake). Saying "no information" here would be false, and would
          // push someone away from a source that actually exists.
          <p className="rounded-md border border-amber-300 bg-amber-50 p-4 text-amber-900">
            Ce restaurant publie ses informations allergènes, mais elles ne sont pas reprises plat
            par plat sur ce site.{" "}
            {restaurant.source?.url ? (
              <>
                Consultez{" "}
                <a
                  href={restaurant.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  la source publiée par l&rsquo;enseigne
                </a>{" "}
                ou demandez le document en salle avant de commander.
              </>
            ) : (
              <>Demandez le document en salle avant de commander.</>
            )}
          </p>
        ) : (
          <p className="rounded-md border border-red-300 bg-red-50 p-4 text-red-800">
            Aucune information sur les allergènes n&rsquo;est disponible pour ce restaurant.
            Contactez directement l&rsquo;établissement avant de commander si vous avez une
            allergie.
          </p>
        )}

        {/* En rouge et APRÈS la carte : ce n'est pas de la présentation, c'est une mise en garde
            sur ce que la déclaration de l'établissement NE couvre PAS. Les plats non couverts ne
            figurent pas dans la carte ci-dessus, faute de quoi ils passeraient pour déclarés sans
            allergène. Placé en tête, il retardait ce que le lecteur vient chercher, les plats ;
            en fin de carte, il répond à la question qui vient alors, « et le reste ? ». */}
        {restaurant.allergenCoverageNotice && (
          <p
            role="alert"
            // Même gabarit que le disclaimer qui le suit (role="note") : même taille de texte,
            // même padding, même rayon. Seule la couleur distingue l'avertissement.
            className="rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-800"
          >
            {restaurant.allergenCoverageNotice}
          </p>
        )}

        {/* Après la carte, comme le bandeau rouge : en tête, il repoussait les plats sous la
            ligne de flottaison sur mobile. Il suit ce bandeau, propre à l'enseigne, et précède
            l'invitation à contacter le restaurant, qu'il annonce. */}
        <AllergenSafetyDisclaimer />

        <ContactRestaurantCallout restaurant={restaurant} />
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
        {/* `source` dit d'où viennent les allergènes affichés ; les autres documents publiés par
            l'enseigne sont proposés en plus, car ils peuvent être plus complets ou plus récents. */}
        {restaurant.additionalSources?.map((other) => (
          <p key={other.url ?? other.label}>
            Également publié :{" "}
            {other.url ? (
              <a href={other.url} target="_blank" rel="noopener noreferrer" className="underline">
                {other.label}
              </a>
            ) : (
              other.label
            )}
          </p>
        ))}
        {restaurant.lastVerifiedAt && (
          <p>Dernière vérification : {formatVerifiedDate(restaurant.lastVerifiedAt)}</p>
        )}
        <ReportProblemLink restaurant={restaurant} />
      </footer>
    </article>
  );
}
