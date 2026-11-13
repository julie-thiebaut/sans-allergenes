import { normalizeSearchText } from "../../filtering/searchText";
import type { MenuCategory } from "../../data/types";
import type { Locale } from "../../i18n/locale";
import { useLocale } from "../../i18n/useLocale";
import { DishRow } from "./DishRow";

/**
 * `quotedIn`: the language the menu is published in. Section and dish names are quoted as the
 * restaurant writes them, so on a page in another language they carry their own `lang`, for screen
 * readers to pronounce them right. The allergen labels inside are the page's own, and say so.
 */
export function MenuSection({ category, quotedIn }: { category: MenuCategory; quotedIn?: Locale }) {
  const locale = useLocale();
  const foreign = quotedIn !== undefined && quotedIn !== locale ? quotedIn : undefined;
  const headingId = `menu-cat-${normalizeSearchText(category.category).replace(/\s+/g, "-")}`;

  return (
    <section aria-labelledby={headingId}>
      <h3 id={headingId} lang={foreign} className="mb-2 text-lg font-semibold text-neutral-900">
        {category.category}
      </h3>
      <ul>
        {category.dishes.map((dish) => (
          <DishRow key={dish.id} dish={dish} quotedIn={foreign} />
        ))}
      </ul>
    </section>
  );
}
