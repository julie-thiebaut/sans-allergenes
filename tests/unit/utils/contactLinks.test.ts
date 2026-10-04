import { describe, expect, it } from "vitest";
import { reportProblemMailto, restaurantQuestionMailto } from "../../../src/utils/contactLinks";
import { restaurantWithFullInfo } from "../../fixtures/restaurants.fixture";

function parts(href: string) {
  const url = new URL(href);
  return {
    to: url.pathname,
    subject: url.searchParams.get("subject"),
    body: url.searchParams.get("body"),
  };
}

describe("restaurantQuestionMailto", () => {
  it("names the exact restaurant, so a chain's customer service knows which one", () => {
    const { to, subject, body } = parts(
      restaurantQuestionMailto(restaurantWithFullInfo, "service.client@example.com"),
    );
    expect(to).toBe("service.client@example.com");
    expect(subject).toBe("Précisions sur vos allergènes : Le Restaurant Complet");
    expect(body).toContain("Le Restaurant Complet (1 rue de Test, 75001 Paris)");
  });

  it("asks the restaurant to clarify its allergens, leaving the dishes to fill in", () => {
    const { body } = parts(restaurantQuestionMailto(restaurantWithFullInfo, "a@example.com"));
    expect(body).toContain("Pourriez-vous préciser les allergènes des plats suivants ?");
    expect(body).toContain("Plat(s) concerné(s) : \r\n");
  });

  it("encodes spaces as %20, which mail clients read, not as +", () => {
    const href = restaurantQuestionMailto(restaurantWithFullInfo, "a@example.com");
    expect(href).not.toContain("+");
    expect(href).toContain("Pr%C3%A9cisions%20sur%20vos%20allerg");
  });
});

describe("reportProblemMailto", () => {
  it("goes to the publisher with the public page of the restaurant", () => {
    const { to, subject, body } = parts(reportProblemMailto(restaurantWithFullInfo));
    expect(to).toBe("contact@sans-allergenes.fr");
    expect(subject).toBe("Signalement : Le Restaurant Complet (75001)");
    expect(body).toContain("https://sans-allergenes.fr/restaurant/le-restaurant-complet/");
  });
});
