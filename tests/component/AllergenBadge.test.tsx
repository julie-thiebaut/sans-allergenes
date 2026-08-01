import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AllergenBadge } from "../../src/components/restaurant-detail/AllergenBadge";
import type { AllergenStatus } from "../../src/data/types";

const STATUS_LABELS: Record<AllergenStatus, string> = {
  present: "Présent",
  may_contain: "Traces possibles",
  not_declared: "Non renseigné",
  unknown: "Inconnu",
};

describe("AllergenBadge", () => {
  (Object.keys(STATUS_LABELS) as AllergenStatus[]).forEach((status) => {
    it(`renders a distinct label for status "${status}"`, () => {
      render(<AllergenBadge allergenId="gluten" status={status} />);
      expect(screen.getByText(new RegExp(STATUS_LABELS[status]))).toBeInTheDocument();
    });
  });

  it("never renders wording implying a confirmed safety guarantee", () => {
    (Object.keys(STATUS_LABELS) as AllergenStatus[]).forEach((status) => {
      const { unmount } = render(<AllergenBadge allergenId="gluten" status={status} />);
      expect(screen.queryByText(/\bsafe\b|sûr|sans risque/i)).not.toBeInTheDocument();
      unmount();
    });
  });

  it("renders present and may_contain with visually distinct icon glyphs", () => {
    const { unmount: unmountPresent } = render(
      <AllergenBadge allergenId="gluten" status="present" />,
    );
    expect(screen.getByText("●")).toBeInTheDocument();
    unmountPresent();

    render(<AllergenBadge allergenId="gluten" status="may_contain" />);
    expect(screen.getByText("▲")).toBeInTheDocument();
  });
});
