import type { Restaurant } from "../data/types";
import { fullAddress } from "./fullAddress";

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

/**
 * Le message préparé pour un restaurant qui ne publie pas ses allergènes : lui demander de mettre
 * sa liste en ligne. Complet, prêt à partir : le visiteur n'a rien à y ajouter, seulement à
 * l'envoyer. Il nomme l'adresse, comme le message de question, pour que le restaurant sache de
 * quel établissement on parle.
 */
export function publishAllergensMailto(restaurant: Restaurant, email: string): string {
  return mailto(
    email,
    `Vos allergènes en ligne : ${restaurant.name}`,
    [
      "Bonjour,",
      "",
      `J'aimerais connaître les allergènes de vos plats avant de venir au restaurant ${restaurant.name} (${fullAddress(restaurant)}).`,
      "",
      "Pourriez-vous publier la liste des allergènes de votre carte sur votre site internet ? Les personnes allergiques pourraient ainsi choisir leurs plats avant de se déplacer, et retrouver votre carte sur sans-allergenes.fr.",
      "",
      "Merci d'avance.",
    ].join("\r\n"),
  );
}

/** Le message préparé pour suggérer une ville que le site ne couvre pas encore : reste à la nommer. */
export function requestAreaMailto(): string {
  return mailto(
    REPORT_EMAIL,
    "Sans Allergènes dans une autre ville",
    ["Bonjour,", "", "La ville que je suggère : "].join("\r\n"),
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
