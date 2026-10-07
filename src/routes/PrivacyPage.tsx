import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { LegalDocumentLayout } from "../components/layout/LegalDocumentLayout";
import { buildPrivacyMeta } from "../seo/seoData";

const PRIVACY_META = buildPrivacyMeta(typeof window !== "undefined" ? window.location.origin : "");
const LINK_CLASS =
  "font-medium text-brand-700 underline decoration-brand-300 underline-offset-2 hover:text-brand-800";

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-4">
      <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">{title}</h2>
      <div className="mt-4 space-y-4 leading-relaxed">{children}</div>
    </section>
  );
}

export function PrivacyPage() {
  return (
    <LegalDocumentLayout
      title="Confidentialité et cookies"
      introduction="Cette politique explique quelles données peuvent être traitées lors de votre navigation, pourquoi elles le sont et comment exercer vos droits."
      meta={PRIVACY_META}
    >
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-5">
        <p className="font-semibold text-neutral-900">En bref</p>
        <p className="mt-2 leading-relaxed">
          Sans Allergènes ne propose ni compte, ni publicité, ni newsletter. Google Analytics est
          utilisé uniquement avec votre accord pour mesurer la fréquentation. Le site ne conserve
          pas vos filtres dans une base de données et ne transmet pas leur contenu à Analytics.
          GitHub traite les données techniques nécessaires à l’hébergement, et Google reçoit aussi
          des données lorsque la carte ou la recherche d’adresse est utilisée.
        </p>
      </div>

      <Section id="responsable" title="1. Responsable et contact">
        <p>
          La responsable des traitements mis en œuvre directement par le site est{" "}
          <strong>Julie Thiebaut</strong>, éditrice non professionnelle de Sans Allergènes.
        </p>
        <p>
          Pour toute question ou demande relative à vos données :{" "}
          <a className={LINK_CLASS} href="mailto:contact@sans-allergenes.fr">
            contact@sans-allergenes.fr
          </a>
        </p>
      </Section>

      <Section id="traitements" title="2. Données traitées et finalités">
        <div className="overflow-x-auto rounded-xl border border-neutral-200">
          <table className="min-w-full divide-y divide-neutral-200 text-left text-sm">
            <thead className="bg-neutral-100 text-neutral-900">
              <tr>
                <th className="px-4 py-3 font-semibold" scope="col">
                  Situation
                </th>
                <th className="px-4 py-3 font-semibold" scope="col">
                  Données susceptibles d’être traitées
                </th>
                <th className="px-4 py-3 font-semibold" scope="col">
                  Finalité et base
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white align-top">
              <tr>
                <th className="px-4 py-4 font-medium text-neutral-900" scope="row">
                  Navigation et hébergement
                </th>
                <td className="px-4 py-4">
                  Adresse IP, date et heure, page demandée, navigateur et données techniques de
                  connexion, traitées par GitHub.
                </td>
                <td className="px-4 py-4">
                  Afficher, sécuriser et maintenir le site — intérêt légitime à fournir un service
                  fiable.
                </td>
              </tr>
              <tr>
                <th className="px-4 py-4 font-medium text-neutral-900" scope="row">
                  Carte et recherche d’adresse
                </th>
                <td className="px-4 py-4">
                  Adresse IP, informations sur l’appareil et le navigateur, interactions avec la
                  carte et texte saisi dans le champ d’adresse, traités par Google.
                </td>
                <td className="px-4 py-4">
                  Afficher la carte et proposer des adresses — intérêt légitime à fournir la
                  fonctionnalité cartographique explicitement demandée.
                </td>
              </tr>
              <tr>
                <th className="px-4 py-4 font-medium text-neutral-900" scope="row">
                  Mesure d’audience facultative
                </th>
                <td className="px-4 py-4">
                  Pages consultées sans leurs paramètres de filtre, titre de page, site référent,
                  événements techniques de visite, type d’appareil, navigateur, zone géographique
                  approximative et identifiant aléatoire déposé dans des cookies Google Analytics.
                </td>
                <td className="px-4 py-4">
                  Comprendre la fréquentation et améliorer le site — votre consentement, que vous
                  pouvez retirer à tout moment.
                </td>
              </tr>
              <tr>
                <th className="px-4 py-4 font-medium text-neutral-900" scope="row">
                  Filtres d’allergènes
                </th>
                <td className="px-4 py-4">
                  Allergènes et autres filtres choisis, inscrits dans l’URL de la page.
                </td>
                <td className="px-4 py-4">
                  Conserver la sélection pendant la navigation et permettre le partage d’une vue —
                  fonctionnement demandé par l’utilisateur.
                </td>
              </tr>
              <tr>
                <th className="px-4 py-4 font-medium text-neutral-900" scope="row">
                  Contact par courriel
                </th>
                <td className="px-4 py-4">
                  Adresse électronique, nom éventuel, contenu du message et informations
                  volontairement transmises.
                </td>
                <td className="px-4 py-4">
                  Répondre à la demande et assurer son suivi — intérêt légitime à traiter les
                  messages reçus.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Aucun profil publicitaire, aucune décision automatisée et aucun profilage ne sont réalisés
          par l’éditrice.
        </p>
      </Section>

      <Section id="filtres" title="3. Filtres et informations liées aux allergies">
        <p>
          Les filtres choisis peuvent parfois révéler une préférence alimentaire ou une information
          relative à une allergie. Ils sont conservés uniquement dans l’URL et dans l’état
          temporaire de l’application : Sans Allergènes ne les enregistre pas dans une base de
          données et ne les associe pas à un compte.
        </p>
        <p>
          L’URL peut rester dans l’historique du navigateur ou être visible par une personne avec
          laquelle elle est partagée. Lorsqu’un lien filtré est ouvert ou rechargé, l’URL demandée
          peut également apparaître dans les journaux techniques de l’hébergeur. Le bouton de
          réinitialisation des filtres permet de retirer ces paramètres de l’URL.
        </p>
        <p>
          Les vues de page envoyées à Google Analytics sont volontairement débarrassées de tous
          leurs paramètres d’URL. Le contenu des filtres, notamment le paramètre relatif aux
          allergènes à éviter, n’est donc pas transmis à l’outil de mesure d’audience.
        </p>
        <p>
          Les boutons « Contacter le restaurant » et « Écrire au restaurant » ouvrent votre
          messagerie sur un message adressé au restaurant ou à son enseigne. Le message part
          directement de vous : il ne transite pas par Sans Allergènes, qui n’en a pas connaissance.
          Ce que vous y écrivez, notamment sur une allergie, relève alors de la politique de
          confidentialité du restaurant.
        </p>
      </Section>

      <Section id="cookies" title="4. Cookies et services tiers">
        <p>
          Lors de votre première visite, vous pouvez accepter ou refuser Google Analytics avec la
          même simplicité. Tant que vous n’avez pas accepté, la balise Analytics n’est pas chargée
          et aucun cookie Analytics n’est déposé. Votre choix est mémorisé pendant six mois dans le
          stockage local du navigateur ; cet enregistrement est strictement nécessaire pour
          respecter votre décision.
        </p>
        <p>
          Après acceptation, Google Analytics peut déposer les cookies <code>_ga</code> et{" "}
          <code>_ga_&lt;identifiant&gt;</code> afin de distinguer les visites. Leur durée est
          limitée par le site à treize mois au maximum. Les fonctions publicitaires, la
          personnalisation des annonces et Google Signals sont désactivés. Le site n’envoie ni
          identifiant de compte, ni recherche d’adresse, ni sélection d’allergènes à Analytics.
        </p>
        <p>
          Vous pouvez revenir sur votre choix à tout moment grâce au bouton{" "}
          <strong>« Gérer les cookies »</strong> situé dans le pied de page. En cas de retrait, la
          mesure est désactivée et les cookies Analytics accessibles au site sont supprimés.
        </p>
        <p>
          La page Carte utilise par ailleurs <strong>Google Maps Platform</strong> : Maps JavaScript
          API affiche la carte, tandis que la bibliothèque Places et{" "}
          <strong>Places API (New)</strong> produisent les suggestions d’adresse et récupèrent la
          position de l’adresse sélectionnée. Le chargement de ces services permet à Google de
          recevoir des données techniques et peut l’autoriser à déposer ou lire des cookies et
          identifiants selon ses propres règles. Le texte saisi dans le champ d’adresse est envoyé à
          Google pour fournir les suggestions ; il n’est pas enregistré dans une base de données par
          Sans Allergènes.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <a
              className={LINK_CLASS}
              href="https://marketingplatform.google.com/about/analytics/terms/fr/"
              target="_blank"
              rel="noreferrer"
            >
              Conditions d’utilisation de Google Analytics
            </a>
          </li>
          <li>
            <a
              className={LINK_CLASS}
              href="https://policies.google.com/privacy?hl=fr"
              target="_blank"
              rel="noreferrer"
            >
              Règles de confidentialité de Google
            </a>
          </li>
          <li>
            <a
              className={LINK_CLASS}
              href="https://www.google.com/help/terms_maps/"
              target="_blank"
              rel="noreferrer"
            >
              Conditions d’utilisation de Google Maps
            </a>
          </li>
        </ul>
        <p>
          L’hébergement est assuré par GitHub Pages. GitHub traite les requêtes techniques selon sa{" "}
          <a
            className={LINK_CLASS}
            href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
            target="_blank"
            rel="noreferrer"
          >
            déclaration générale de confidentialité
          </a>
          .
        </p>
      </Section>

      <Section id="destinataires" title="5. Destinataires et transferts hors de l’Union européenne">
        <p>
          Selon la fonctionnalité utilisée, les données peuvent être traitées par l’éditrice, son
          prestataire de messagerie, GitHub pour l’hébergement et Google pour Analytics, la carte et
          la recherche d’adresse. Pour Google Analytics, Google Ireland Limited intervient comme
          prestataire de mesure d’audience. Les données ne sont ni vendues ni louées par Sans
          Allergènes.
        </p>
        <p>
          GitHub et Google sont des groupes internationaux susceptibles de traiter certaines données
          en dehors de l’Espace économique européen. Les informations relatives à leurs transferts
          et aux garanties utilisées figurent dans leurs politiques de confidentialité respectives,
          accessibles dans la section précédente.
        </p>
      </Section>

      <Section id="conservation" title="6. Durées de conservation">
        <ul className="list-disc space-y-3 pl-5">
          <li>
            <strong>Filtres :</strong> aucune conservation dans une base du site ; ils restent dans
            l’URL et éventuellement dans l’historique du navigateur jusqu’à leur suppression.
          </li>
          <li>
            <strong>Courriels :</strong> conservation pendant le temps nécessaire au traitement de
            la demande, puis au maximum douze mois après le dernier échange, sauf nécessité légale
            ou défense d’un droit.
          </li>
          <li>
            <strong>Choix Analytics :</strong> six mois, puis le site demande à nouveau votre choix.
          </li>
          <li>
            <strong>Cookies Analytics :</strong> treize mois au maximum après leur dernière mise à
            jour.
          </li>
          <li>
            <strong>Données Analytics au niveau utilisateur et événement :</strong> deux mois dans
            la propriété Google Analytics. Les rapports statistiques agrégés peuvent rester
            disponibles plus longtemps.
          </li>
          <li>
            <strong>Autres données techniques GitHub et Google :</strong> conservation selon les
            durées définies par ces prestataires dans leurs propres politiques.
          </li>
        </ul>
      </Section>

      <Section id="droits" title="7. Vos droits">
        <p>
          Selon le traitement concerné et sa base légale, vous pouvez demander l’accès, la
          rectification, l’effacement ou la limitation de vos données, et vous opposer à certains
          traitements. Lorsqu’un traitement repose sur votre consentement, vous pouvez le retirer à
          tout moment.
        </p>
        <p>
          Pour exercer un droit auprès de Sans Allergènes, écrivez à{" "}
          <a className={LINK_CLASS} href="mailto:contact@sans-allergenes.fr">
            contact@sans-allergenes.fr
          </a>
          . Une preuve d’identité ne sera demandée qu’en cas de doute raisonnable sur l’identité du
          demandeur.
        </p>
        <p>
          Vous pouvez également introduire une réclamation auprès de la{" "}
          <a
            className={LINK_CLASS}
            href="https://www.cnil.fr/fr/plaintes"
            target="_blank"
            rel="noreferrer"
          >
            Commission nationale de l’informatique et des libertés (CNIL)
          </a>
          .
        </p>
      </Section>

      <Section id="evolution" title="8. Évolution de cette politique">
        <p>
          Cette politique sera mise à jour si les fonctionnalités, les prestataires ou les règles
          applicables évoluent. La date de mise à jour figurant en haut de page permet d’identifier
          la version en vigueur.
        </p>
        <p>
          Pour l’identité de l’éditrice, l’hébergeur et les règles générales du service, consultez
          les{" "}
          <Link className={LINK_CLASS} to="/mentions-legales">
            mentions légales et conditions d’utilisation
          </Link>
          .
        </p>
      </Section>
    </LegalDocumentLayout>
  );
}
