import type { Restaurant } from "../data/types";

/** L'adresse de l'éditrice, celle des mentions légales : les signalements y arrivent. */
export const REPORT_EMAIL = "contact@sans-allergenes.fr";

// En dur plutôt que `window.location.origin` : le pré-rendu tourne sur un serveur local, et le
// lien du signalement doit désigner la page publique, pas `localhost`.
const SITE_URL = "https://sans-allergenes.fr";

function mailto(to: string, subject: string, body: string): string {
  // encodeURIComponent et non URLSearchParams : ce dernier écrit les espaces « + », que les
  // messageries reprennent tels quels dans l'objet du message.
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const fullAddress = (restaurant: Restaurant) =>
  `${restaurant.address}, ${restaurant.postalCode} ${restaurant.city}`;

/**
 * Le message préparé pour le restaurant : lui demander de préciser sa carte des allergènes. Il
 * nomme l'adresse exacte, car quand il part au service client d'une enseigne, c'est ce qui lui
 * permet de savoir de quel établissement on parle. Les champs à compléter restent vides.
 */
export function restaurantQuestionMailto(restaurant: Restaurant, email: string): string {
  return mailto(
    email,
    `Précisions sur vos allergènes : ${restaurant.name}`,
    [
      "Bonjour,",
      "",
      `J'ai consulté les informations allergènes que vous publiez pour le restaurant ${restaurant.name} (${fullAddress(restaurant)}).`,
      "",
      "Pourriez-vous préciser les allergènes des plats suivants ?",
      "",
      "Plat(s) concerné(s) : ",
      "Ma question : ",
      "",
      "Merci d'avance pour votre réponse.",
    ].join("\r\n"),
  );
}

/** Le signalement reprend ce que les mentions légales demandent : la fiche, sa page, une source. */
export function reportProblemMailto(restaurant: Restaurant): string {
  return mailto(
    REPORT_EMAIL,
    `Signalement : ${restaurant.name} (${restaurant.postalCode})`,
    [
      "Bonjour,",
      "",
      `Je signale un problème sur la fiche ${restaurant.name} (${fullAddress(restaurant)}) :`,
      `${SITE_URL}/restaurant/${restaurant.slug}/`,
      "",
      "Le problème : ",
      "",
      "Une source à jour, si vous en avez une : ",
    ].join("\r\n"),
  );
}
