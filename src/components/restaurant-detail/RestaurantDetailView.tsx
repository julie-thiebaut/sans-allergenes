import { trackEvent } from "../../analytics/googleAnalytics";
import { useLocalizeText } from "../../i18n/ContentTranslations";
import { useLocale, useMessages } from "../../i18n/useLocale";
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

export function RestaurantDetailView({ restaurant }: { restaurant: RestaurantWithMenu }) {
  const { allergensToAvoid, excludeTraces } = useFilterState();
  const locale = useLocale();
  const t = useMessages();
  const localize = useLocalizeText();
  // Source labels name French documents and stay in French: marked so on other pages.
  const quotedLang = locale === "fr" ? undefined : "fr";
  const description = restaurant.description ? localize(restaurant.description) : null;
  const coverageNotice = restaurant.allergenCoverageNotice
    ? localize(restaurant.allergenCoverageNotice)
    : null;
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
        description={t.filters.menuDescription(excludeTraces, allergensToAvoid.length > 1)}
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
          <span>{cuisineLine(restaurant, locale)}</span>
          <PriceLevelIndicator level={restaurant.priceLevel} />
          {!restaurant.allergenInformationAvailable && <AllergenAvailabilityBadge />}
          {restaurant.websiteUrl && (
            <a
              href={restaurant.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-500 underline hover:text-brand-700"
              onClick={() => trackEvent("visit_restaurant_site")}
            >
              {t.restaurant.website}
            </a>
          )}
          {/* A link so a phone can dial it, and so the call can be counted; it reads as before. */}
          {restaurant.phone && (
            <a
              href={`tel:${restaurant.phone.replace(/[^\d+]/g, "")}`}
              className="hover:underline"
              onClick={() => trackEvent("call_restaurant")}
            >
              {restaurant.phone}
            </a>
          )}
        </div>
      </header>

      <div className={`${isDesktop ? "mt-6" : "mt-4"} space-y-8`}>
        {description && (
          <p className="text-neutral-700" lang={description.lang === locale ? undefined : "fr"}>
            {description.text}
          </p>
        )}

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
                <MobileFilterSheet title={t.mapPage.filterByAllergens}>
                  {menuFilter}
                </MobileFilterSheet>
              </div>
            )}

            <div className={`${isDesktop ? "mt-8" : "mt-4"} space-y-8`}>
              {/* English pages quote the menu as published, in French: say so once, above it. */}
              {t.restaurant.menuLanguageNote && menu.categories.length > 0 && (
                <p className="text-sm text-neutral-600">{t.restaurant.menuLanguageNote}</p>
              )}
              {(menu.excludedDishCount > 0 || menu.excludedDrinkCount > 0) && (
                <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
                  {t.restaurant.hidden(menu.excludedDishCount, menu.excludedDrinkCount)}
                  {locale === "fr" ? " : " : ": "}
                  {t.restaurant.hiddenReason(allergensToAvoid.length > 1, excludeTraces)}
                </p>
              )}

              {menu.categories.length > 0 ? (
                menu.categories.map((category) => (
                  <MenuSection key={category.category} category={category} quotedIn="fr" />
                ))
              ) : (
                <p className="rounded-md border border-neutral-300 bg-neutral-50 p-4 text-neutral-700">
                  {t.restaurant.noDishLeft}
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
            {t.restaurant.publishedElsewhere}{" "}
            {restaurant.source?.url ? (
              <>
                {t.restaurant.consult}{" "}
                <a
                  href={restaurant.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                  onClick={() => trackEvent("view_allergen_source")}
                >
                  {t.restaurant.publishedSource}
                </a>{" "}
                {t.restaurant.orAskInRoom}
              </>
            ) : (
              <>{t.restaurant.askInRoom}</>
            )}
          </p>
        ) : (
          <>
            <p className="rounded-md border border-red-300 bg-red-50 p-4 text-red-800">
              {t.restaurant.noInformation}
            </p>
            {/* Ici et non en fin de fiche : sans carte, demander au restaurant de publier ses
                allergènes est ce que la page a de plus utile à proposer. */}
            <ContactRestaurantCallout restaurant={restaurant} />
          </>
        )}

        {/* En rouge et APRÈS la carte : ce n'est pas de la présentation, c'est une mise en garde
            sur ce que la déclaration de l'établissement NE couvre PAS. Les plats non couverts ne
            figurent pas dans la carte ci-dessus, faute de quoi ils passeraient pour déclarés sans
            allergène. Placé en tête, il retardait ce que le lecteur vient chercher, les plats ;
            en fin de carte, il répond à la question qui vient alors, « et le reste ? ». */}
        {coverageNotice && (
          <p
            role="alert"
            lang={coverageNotice.lang === locale ? undefined : "fr"}
            // Même gabarit que le disclaimer qui le suit (role="note") : même taille de texte,
            // même padding, même rayon. Seule la couleur distingue l'avertissement.
            className="rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-800"
          >
            {coverageNotice.text}
          </p>
        )}

        {/* Après la carte, comme le bandeau rouge : en tête, il repoussait les plats sous la
            ligne de flottaison sur mobile. Il suit ce bandeau, propre à l'enseigne, et précède
            l'invitation à contacter le restaurant, qu'il annonce. Sans allergènes, ni l'un ni
            l'autre : il n'y a rien d'indicatif à nuancer, l'avertissement rouge dit déjà tout
            (Julie, 7 octobre 2026). */}
        {restaurant.allergenInformationAvailable && (
          <>
            <AllergenSafetyDisclaimer />
            <ContactRestaurantCallout restaurant={restaurant} />
          </>
        )}
      </div>

      <footer className="mt-8 border-t border-neutral-200 pt-4 text-sm text-neutral-500">
        {restaurant.source && (
          <p>
            {t.restaurant.source}{" "}
            {restaurant.source.url ? (
              <a
                href={restaurant.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                onClick={() => trackEvent("view_allergen_source")}
              >
                <span lang={quotedLang}>{restaurant.source.label}</span>
              </a>
            ) : (
              <span lang={quotedLang}>{restaurant.source.label}</span>
            )}
          </p>
        )}
        {/* `source` dit d'où viennent les allergènes affichés ; les autres documents publiés par
            l'enseigne sont proposés en plus, car ils peuvent être plus complets ou plus récents. */}
        {restaurant.additionalSources?.map((other) => (
          <p key={other.url ?? other.label}>
            {t.restaurant.alsoPublished}{" "}
            {other.url ? (
              <a
                href={other.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                onClick={() => trackEvent("view_allergen_source")}
              >
                <span lang={quotedLang}>{other.label}</span>
              </a>
            ) : (
              <span lang={quotedLang}>{other.label}</span>
            )}
          </p>
        ))}
        {restaurant.lastVerifiedAt && (
          <p>{t.restaurant.lastVerified(formatVerifiedDate(restaurant.lastVerifiedAt, locale))}</p>
        )}
        <ReportProblemLink restaurant={restaurant} />
      </footer>
    </article>
  );
}
