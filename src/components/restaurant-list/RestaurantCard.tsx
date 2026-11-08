import { Link } from "react-router-dom";
import { countDishesDeclaringAvoided } from "../../filtering/allergenLogic";
import type { AllergenId, Menu, RestaurantWithMenu } from "../../data/types";
import { useFilterState } from "../../state/FilterStateContext";
import { OPENED_FROM_MAP_PAGE } from "../../state/MapPageMemoryContext";
import { useSelectionContext } from "../../state/SelectionContext";
import { cuisineLabels } from "../../utils/cuisineLine";
import { formatVerifiedDate } from "../../utils/formatDate";
import { fullAddress } from "../../utils/fullAddress";
import { AllergenAvailabilityBadge } from "../common/AllergenAvailabilityBadge";
import { AllergenWarningIcon } from "../common/AllergenWarningIcon";
import { DemoDataBadge } from "../common/DemoDataBadge";
import { ImageWithPlaceholder } from "../common/ImageWithPlaceholder";
import { PriceLevelIndicator } from "../common/PriceLevelIndicator";

const DISH = { one: "plat", many: "plats", none: "Aucun plat" };
const DRINK = { one: "boisson", many: "boissons", none: "Aucune boisson" };

interface AvoidanceLine {
  text: string;
  tone: "warning" | "neutral";
}

/**
 * Ce que la carte déclare pour l'allergène à éviter, compté plat par plat, boissons mises à part
 * (une carte faite seulement de boissons se juge sur elles, comme dans le filtre) : « 10 plats sur
 * 99 ne déclarent pas l'allergène à éviter », c'est-à-dire ne le déclarent pas PRÉSENT. Les traces
 * n'y sont pas nommées : la fiche du restaurant les montre plat par plat, et le visiteur peut les
 * exclure (`excludeTraces`), elles comptent alors comme une déclaration. « Ne déclare pas », jamais
 * « sans » : un plat qui ne déclare rien ne promet rien. Avec plusieurs allergènes à éviter, un plat
 * compte dès qu'il en déclare un : « 10 plats sur 99 ne déclarent aucun des allergènes à éviter ».
 */
function describeAvoidance(
  menu: Menu | undefined,
  avoid: AllergenId[],
  excludeTraces: boolean,
): AvoidanceLine[] {
  if (avoid.length === 0) return [];
  const several = avoid.length > 1;
  const incomplete: AvoidanceLine = {
    text: `Information incomplète pour ${several ? "les allergènes" : "l’allergène"} à éviter`,
    tone: "neutral",
  };
  if (!menu) return [incomplete];

  const { dishes, drinks } = countDishesDeclaringAvoided(menu, avoid, { excludeTraces });
  const [count, noun] = dishes.total > 0 ? [dishes, DISH] : [drinks, DRINK];
  const clear = count.total - count.declaring;

  const lines: AvoidanceLine[] = [];
  if (count.declaring > 0 && clear > 0) {
    const verb = clear > 1 ? "ne déclarent" : "ne déclare";
    lines.push({
      text: `${clear} ${clear > 1 ? noun.many : noun.one} sur ${count.total} ${verb} ${several ? "aucun des allergènes" : "pas l’allergène"} à éviter`,
      tone: "warning",
    });
  } else if (count.declaring + count.unknown === 0) {
    lines.push({
      text: `${noun.none} ne déclare ${several ? "les allergènes" : "l’allergène"} à éviter`,
      tone: "neutral",
    });
  }
  if (count.unknown > 0) lines.push(incomplete);
  return lines;
}

export function RestaurantCard({ restaurant }: { restaurant: RestaurantWithMenu }) {
  const { hoveredId, selectedId, setHoveredId, setSelectedId } = useSelectionContext();
  const filters = useFilterState();
  const isHighlighted = hoveredId === restaurant.id || selectedId === restaurant.id;
  const isWarning = !restaurant.allergenInformationAvailable;

  // A restaurant is only excluded when EVERY dish declares an avoided allergen, so cards here
  // may still have some offending dishes — the count says how many are left, rather than
  // leaving the user to discover it after opening the menu.
  const avoidanceLines = describeAvoidance(
    restaurant.menu,
    filters.allergensToAvoid,
    filters.excludeTraces,
  );

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
                to={`/restaurant/${restaurant.slug}/`}
                state={OPENED_FROM_MAP_PAGE}
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
          {/* Une seule ligne, coupée par des points de suspension : sur un téléphone, une adresse
              sur trois la dépasse, et la fiche la donne en entier. */}
          <p className="truncate text-sm text-neutral-600">{fullAddress(restaurant)}</p>
          <p className="mt-1 text-sm text-neutral-700">{cuisineLabels(restaurant.cuisineTypes)}</p>

          {restaurant.isDemoData && (
            <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
              <DemoDataBadge />
            </div>
          )}

          {/* Seule l'absence d'information est signalée : c'est un avertissement. Quand
              l'information existe, la carte n'en dit rien de plus que sa date. Sans allergènes,
              pas de date dans la liste : « Vérifié le » s'y lirait comme un gage ; la fiche la
              donne (Julie, 7 octobre 2026). À 0,25 rem comme les lignes au-dessus. */}
          {isWarning ? (
            <p className="mt-1 text-xs">
              <AllergenAvailabilityBadge />
            </p>
          ) : (
            restaurant.lastVerifiedAt && (
              <p className="mt-1 text-xs text-neutral-500">
                Vérifié le {formatVerifiedDate(restaurant.lastVerifiedAt)}
              </p>
            )
          )}

          {avoidanceLines.map((line) => (
            <p
              key={line.text}
              className={`mt-1 text-xs font-medium ${
                line.tone === "warning" ? "text-amber-700" : "text-neutral-600"
              }`}
            >
              {line.text}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}
