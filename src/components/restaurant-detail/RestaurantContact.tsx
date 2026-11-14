import { trackEvent } from "../../analytics/googleAnalytics";
import type { RestaurantWithMenu } from "../../data/types";
import { useLocale, useMessages } from "../../i18n/useLocale";
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
  const t = useMessages();
  const { contact } = restaurant;
  if (!contact) return null;
  const words = t.restaurant.contact;
  const reader = contact.scope === "enseigne" ? words.readerChain : words.readerRestaurant;

  if (!restaurant.allergenInformationAvailable) {
    return (
      <section
        aria-labelledby="contact-restaurant-title"
        className="rounded-md border border-brand-300 bg-brand-50 p-4"
      >
        <h2 id="contact-restaurant-title" className="font-semibold text-neutral-900">
          {words.publishTitle}
        </h2>
        <p className="mt-1 text-sm text-neutral-700">{words.publishBody}</p>
        <a
          href={publishAllergensMailto(restaurant, contact.email)}
          className={BUTTON_CLASS}
          onClick={() => trackEvent("ask_to_publish")}
        >
          {words.publishButton}
        </a>
        <p className="mt-2 text-xs text-neutral-600">{words.publishHint(reader, contact.email)}</p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="contact-restaurant-title"
      className="rounded-md border border-neutral-200 bg-neutral-50 p-4"
    >
      <h2 id="contact-restaurant-title" className="font-semibold text-neutral-900">
        {words.questionTitle}
      </h2>
      <p className="mt-1 text-sm text-neutral-700">{words.questionBody}</p>
      <a
        href={restaurantQuestionMailto(restaurant, contact.email)}
        className={BUTTON_CLASS}
        onClick={() => trackEvent("ask_question")}
      >
        {words.questionButton}
      </a>
      <p className="mt-2 text-xs text-neutral-600">{words.questionHint(reader, contact.email)}</p>
    </section>
  );
}

/** Le signalement part à l'éditrice, jamais au restaurant. */
export function ReportProblemLink({ restaurant }: { restaurant: RestaurantWithMenu }) {
  const locale = useLocale();
  const words = useMessages().restaurant.contact;
  return (
    <p>
      {words.reportQuestion}{" "}
      <a
        href={reportProblemMailto(restaurant, locale)}
        className="underline"
        onClick={() => trackEvent("report_problem")}
      >
        {words.reportLink}
        <span className="sr-only">{words.reportEmail(REPORT_EMAIL)}</span>
      </a>
    </p>
  );
}
