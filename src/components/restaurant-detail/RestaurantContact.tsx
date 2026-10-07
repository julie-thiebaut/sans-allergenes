import type { RestaurantWithMenu } from "../../data/types";
import {
  REPORT_EMAIL,
  publishAllergensMailto,
  reportProblemMailto,
  restaurantQuestionMailto,
} from "../../utils/contactLinks";

const BUTTON_CLASS =
  "mt-3 inline-flex items-center rounded-md bg-brand-500 px-3 py-2 text-sm font-semibold text-neutral-900 hover:bg-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900";

/**
 * Placé après la carte, et après le bandeau de ce qu'elle ne couvre pas : c'est là que naît
 * l'envie de demander au restaurant de préciser ses allergènes. Seulement quand il publie une
 * adresse — le message part alors prérempli, depuis la messagerie du visiteur ; rien ne transite
 * par ce site.
 *
 * Un restaurant qui ne publie aucun allergène reçoit une autre demande, celle de publier sa liste :
 * c'est la seule raison pour laquelle sa fiche existe, d'où un message prêt à partir.
 */
export function ContactRestaurantCallout({ restaurant }: { restaurant: RestaurantWithMenu }) {
  const { contact } = restaurant;
  if (!contact) return null;
  const reader = contact.scope === "enseigne" ? "au service client de l’enseigne" : "au restaurant";

  if (!restaurant.allergenInformationAvailable) {
    return (
      <section
        aria-labelledby="contact-restaurant-title"
        className="rounded-md border border-brand-300 bg-brand-50 p-4"
      >
        <h2 id="contact-restaurant-title" className="font-semibold text-neutral-900">
          Demandez-lui de publier ses allergènes
        </h2>
        <p className="mt-1 text-sm text-neutral-700">
          Chaque message compte : une fois sa liste en ligne, sa carte pourra figurer ici, plat par
          plat.
        </p>
        <a href={publishAllergensMailto(restaurant, contact.email)} className={BUTTON_CLASS}>
          Écrire au restaurant
        </a>
        <p className="mt-2 text-xs text-neutral-600">
          Votre messagerie s’ouvre sur un message prêt à envoyer, adressé {reader} ({contact.email}
          ).
        </p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="contact-restaurant-title"
      className="rounded-md border border-neutral-200 bg-neutral-50 p-4"
    >
      <h2 id="contact-restaurant-title" className="font-semibold text-neutral-900">
        Une question sur un plat ou un allergène ?
      </h2>
      <p className="mt-1 text-sm text-neutral-700">
        Un plat absent, un allergène qui vous semble oublié : demandez au restaurant de préciser sa
        carte des allergènes.
      </p>
      <a href={restaurantQuestionMailto(restaurant, contact.email)} className={BUTTON_CLASS}>
        Contacter le restaurant
      </a>
      <p className="mt-2 text-xs text-neutral-600">
        Votre messagerie s’ouvre sur un message à compléter, adressé {reader} ({contact.email}).
      </p>
    </section>
  );
}

/** Le signalement part à l'éditrice, jamais au restaurant. */
export function ReportProblemLink({ restaurant }: { restaurant: RestaurantWithMenu }) {
  return (
    <p>
      Une erreur sur cette fiche ?{" "}
      <a href={reportProblemMailto(restaurant)} className="underline">
        Signaler un problème
        <span className="sr-only"> (courriel à {REPORT_EMAIL})</span>
      </a>
    </p>
  );
}
