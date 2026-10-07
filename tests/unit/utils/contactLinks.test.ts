import { describe, expect, it } from "vitest";
import {
  publishAllergensMailto,
  reportProblemMailto,
  restaurantQuestionMailto,
} from "../../../src/utils/contactLinks";
import {
  restaurantWithFullInfo,
  restaurantWithoutAllergenInfo,
} from "../../fixtures/restaurants.fixture";

describe("publishAllergensMailto", () => {
  it("asks the restaurant to publish its allergen list online, naming the exact address", () => {
    const { to, subject, body } = parts(
      publishAllergensMailto(restaurantWithoutAllergenInfo, "bonjour@example.com"),
    );
    expect(to).toBe("bonjour@example.com");
    expect(subject).toBe("Vos allergènes en ligne : Le Bistrot Sans Info");
    expect(body).toContain("Le Bistrot Sans Info (2 rue de Test, 75002 Paris)");
    expect(body).toContain("publier la liste des allergènes de votre carte");
  });

  it("is ready to send: no field left for the visitor to fill in", () => {
    const { body } = parts(publishAllergensMailto(restaurantWithoutAllergenInfo, "a@example.com"));
    expect(body).not.toMatch(/: \r\n|: $/);
  });
});

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
