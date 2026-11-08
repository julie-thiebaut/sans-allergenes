import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RestaurantList } from "../../src/components/restaurant-list/RestaurantList";
import type { RestaurantWithMenu } from "../../src/data/types";
import { FilterStateProvider } from "../../src/state/FilterStateContext";
import { SelectionProvider, useSelectionActions } from "../../src/state/SelectionContext";
import { fullAddress } from "../../src/utils/fullAddress";
import { allFixtureRestaurants, restaurantWithFullInfo } from "../fixtures/restaurants.fixture";

// Called once each time a card renders, which makes the renders countable.
vi.mock("../../src/utils/fullAddress", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../src/utils/fullAddress")>();
  return { ...actual, fullAddress: vi.fn(actual.fullAddress) };
});

const prerendering = vi.hoisted(() => ({ value: false }));
vi.mock("../../src/seo/prerendering", () => ({
  get IS_PRERENDERING() {
    return prerendering.value;
  },
}));

function renderList(
  restaurants: RestaurantWithMenu[] = allFixtureRestaurants,
  { initialScrollTop, extra }: { initialScrollTop?: number; extra?: ReactNode } = {},
) {
  return render(
    <MemoryRouter>
      <FilterStateProvider>
        <SelectionProvider>
          {extra}
          <RestaurantList restaurants={restaurants} initialScrollTop={initialScrollTop} />
        </SelectionProvider>
      </FilterStateProvider>
    </MemoryRouter>,
  );
}

function manyRestaurants(count: number): RestaurantWithMenu[] {
  return Array.from({ length: count }, (_, i) => ({
    ...restaurantWithFullInfo,
    id: `rest-${i}`,
    slug: `restaurant-${i}`,
    name: `Restaurant ${i}`,
  }));
}

function SelectButton({ id }: { id: string }) {
  const { setSelectedId } = useSelectionActions();
  return <button onClick={() => setSelectedId(id)}>Sélectionner</button>;
}

function fullInfoCard(): HTMLElement {
  const card = screen.getByRole("link", { name: restaurantWithFullInfo.name }).closest("article");
  if (!card) throw new Error("the link is not in a card");
  return card;
}

beforeEach(() => {
  // jsdom has no scrollIntoView; RestaurantList calls it for the selection.
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  prerendering.value = false;
});

describe("RestaurantList", () => {
  it("highlights the hovered card, and re-renders no other", () => {
    expect(allFixtureRestaurants.length).toBeGreaterThan(1);
    renderList();
    vi.mocked(fullAddress).mockClear();

    fireEvent.mouseEnter(fullInfoCard());
    expect(fullInfoCard()).toHaveClass("border-brand-500");
    expect(fullAddress).toHaveBeenCalledTimes(1);

    fireEvent.mouseLeave(fullInfoCard());
    expect(fullInfoCard()).not.toHaveClass("border-brand-500");
    expect(fullAddress).toHaveBeenCalledTimes(2);
  });

  it("keeps the selected card highlighted once the pointer has left", () => {
    renderList(undefined, { extra: <SelectButton id={restaurantWithFullInfo.id} /> });

    fireEvent.click(screen.getByRole("button", { name: "Sélectionner" }));
    fireEvent.mouseEnter(fullInfoCard());
    fireEvent.mouseLeave(fullInfoCard());

    expect(fullInfoCard()).toHaveClass("border-brand-500");
  });

  it("leaves nothing selected once a card is opened", () => {
    renderList(undefined, { extra: <SelectButton id={restaurantWithFullInfo.id} /> });

    fireEvent.click(screen.getByRole("button", { name: "Sélectionner" }));
    fireEvent.click(screen.getByRole("link", { name: restaurantWithFullInfo.name }));

    expect(fullInfoCard()).not.toHaveClass("border-brand-500");
  });

  it("builds the first cards at once, and the others soon after", async () => {
    renderList(manyRestaurants(150));

    expect(screen.getAllByRole("listitem").length).toBeLessThan(150);
    expect(screen.getByRole("link", { name: "Restaurant 0" })).toBeInTheDocument();
    // Several batches, each after a timer: longer than waitFor's one second when the whole suite
    // runs in parallel.
    await waitFor(() => expect(screen.getAllByRole("listitem")).toHaveLength(150), {
      timeout: 5000,
    });
  });

  it("builds down to the selected card at once, and scrolls it into view", () => {
    renderList(manyRestaurants(150), { extra: <SelectButton id="rest-120" /> });
    expect(screen.queryByRole("link", { name: "Restaurant 120" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Sélectionner" }));

    const card = screen.getByRole("link", { name: "Restaurant 120" }).closest("li");
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
    expect(vi.mocked(Element.prototype.scrollIntoView).mock.contexts[0]).toBe(card);
  });

  it("builds down to the scroll position it is to be put back at", () => {
    renderList(manyRestaurants(150), { initialScrollTop: 6000 });

    // Each card takes more than 100px with its gap.
    expect(screen.getAllByRole("listitem").length).toBeGreaterThanOrEqual(60);
    expect(screen.getAllByRole("listitem").length).toBeLessThan(150);
  });

  it("builds the whole list at once for the prerendered page", () => {
    prerendering.value = true;
    renderList(manyRestaurants(150));

    expect(screen.getAllByRole("listitem")).toHaveLength(150);
  });
});
