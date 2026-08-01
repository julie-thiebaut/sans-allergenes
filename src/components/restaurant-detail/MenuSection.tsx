import { normalizeSearchText } from "../../filtering/searchText";
import type { MenuCategory } from "../../data/types";
import { DishRow } from "./DishRow";

export function MenuSection({ category }: { category: MenuCategory }) {
  const headingId = `menu-cat-${normalizeSearchText(category.category).replace(/\s+/g, "-")}`;

  return (
    <section aria-labelledby={headingId}>
      <h3 id={headingId} className="mb-2 text-lg font-semibold text-neutral-900">
        {category.category}
      </h3>
      <ul>
        {category.dishes.map((dish) => (
          <DishRow key={dish.id} dish={dish} />
        ))}
      </ul>
    </section>
  );
}
