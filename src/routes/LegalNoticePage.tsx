import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { LegalDocumentLayout } from "../components/layout/LegalDocumentLayout";
import { buildLegalMeta } from "../seo/seoData";

const LEGAL_META = buildLegalMeta(typeof window !== "undefined" ? window.location.origin : "");
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

export function LegalNoticePage() {
  return (
    <LegalDocumentLayout
      title="Mentions légales et conditions d’utilisation"
      introduction="Cette page identifie l’éditrice et l’hébergeur du site, puis fixe les règles d’utilisation du service Sans Allergènes."
      meta={LEGAL_META}
    >
      <Section id="edition" title="1. Édition et direction de la publication">
        <p>
          Le site <strong>Sans Allergènes</strong>, accessible à l’adresse{" "}
          <a className={LINK_CLASS} href="https://sans-allergenes.fr/">
            sans-allergenes.fr
          </a>
          , est édité à titre non professionnel par <strong>Julie Thiebaut</strong>, qui en assure
          également la direction de la publication.
        </p>
        <p>
          Contact :{" "}
          <a className={LINK_CLASS} href="mailto:contact@sans-allergenes.fr">
            contact@sans-allergenes.fr
          </a>
        </p>
      </Section>

      <Section id="hebergement" title="2. Hébergement">
        <p>Le site est hébergé par le service GitHub Pages de :</p>
        <address className="not-italic">
          <strong>GitHub, Inc.</strong>
          <br />
          88 Colin P. Kelly Jr. Street
          <br />
          San Francisco, CA 94107
          <br />
          États-Unis
        </address>
        <p>
          Site de l’hébergeur :{" "}
          <a
            className={LINK_CLASS}
            href="https://pages.github.com/"
            target="_blank"
            rel="noreferrer"
          >
            pages.github.com
          </a>
        </p>
      </Section>

      <Section id="service" title="3. Objet et accès au service">
        <p>
          Sans Allergènes est un service d’information gratuit, sans compte utilisateur. Il aide à
          consulter les déclarations d’allergènes publiées ou communiquées par des restaurants et à
          repérer les plats pour lesquels certains allergènes sont déclarés.
        </p>
        <p>
          Le site ne vend aucun produit, ne prend aucune réservation et n’agit ni pour le compte des
          restaurants référencés, ni comme intermédiaire entre les visiteurs et ces établissements.
          Sauf mention contraire, il n’existe aucun partenariat commercial avec eux.
        </p>
        <p>
          L’accès au site est fourni gratuitement. Il peut être interrompu ou modifié pour des
          raisons de maintenance, de sécurité, de coût ou d’évolution du projet.
        </p>
      </Section>

      <Section id="allergenes" title="4. Informations sur les allergènes">
        <div className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-5 text-amber-950">
          <p className="font-semibold">Le site ne constitue pas une garantie de sécurité.</p>
          <p className="mt-2">
            Les informations affichées reproduisent ou synthétisent des déclarations de tiers. Les
            recettes, ingrédients, fournisseurs et pratiques de cuisine peuvent évoluer, et une
            contamination croisée reste possible.
          </p>
        </div>
        <p>
          Les filtres excluent les plats pour lesquels l’allergène sélectionné est déclaré présent.
          Les mentions de traces possibles, les informations incomplètes et les plats sans
          déclaration exploitable restent signalés comme tels. La présence d’un résultat dans la
          liste ne signifie donc jamais qu’un plat ou un restaurant est adapté à une allergie.
        </p>
        <p>
          En cas d’allergie, le visiteur doit contacter directement l’établissement, signaler son
          allergie au personnel avant de commander et vérifier les informations au moment de la
          consommation. Le site ne fournit aucun avis médical et ne remplace ni un professionnel de
          santé, ni le personnel du restaurant.
        </p>
      </Section>

      <Section id="sources" title="5. Sources, mises à jour et corrections">
        <p>
          Chaque fiche indique, lorsque l’information est disponible, la source utilisée et la date
          de dernière vérification. Les contenus sources restent sous la responsabilité de leurs
          auteurs et éditeurs respectifs.
        </p>
        <p>
          Une erreur, une information obsolète ou une demande de correction peut être signalée à{" "}
          <a className={LINK_CLASS} href="mailto:contact@sans-allergenes.fr">
            contact@sans-allergenes.fr
          </a>
          , ou par le bouton « Signaler un problème » de chaque fiche, qui prépare le message. Merci
          d’indiquer le restaurant, la page concernée et, si possible, une source à jour.
        </p>
      </Section>

      <Section id="propriete-intellectuelle" title="6. Propriété intellectuelle">
        <p>
          La structure, le design, les textes originaux et les éléments graphiques propres au site
          sont protégés par le droit de la propriété intellectuelle. Toute réutilisation dépassant
          les exceptions prévues par la loi nécessite l’accord préalable de leur titulaire.
        </p>
        <p>
          Les noms commerciaux, marques, logos, menus et contenus appartenant aux restaurants ou à
          d’autres tiers restent la propriété de leurs titulaires. Leur mention sert uniquement à
          identifier les établissements et les sources d’information ; elle n’implique aucune
          affiliation ni approbation.
        </p>
      </Section>

      <Section id="services-tiers" title="7. Liens et services tiers">
        <p>
          Le site contient des liens vers les sites des restaurants et utilise Google Maps Platform
          pour la carte et la recherche d’adresse. Avec l’accord du visiteur, il utilise également
          Google Analytics pour produire des statistiques de fréquentation. Ces services sont régis
          par leurs propres conditions et politiques.
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
              href="https://www.google.com/help/terms_maps/"
              target="_blank"
              rel="noreferrer"
            >
              Conditions d’utilisation de Google Maps
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
        </ul>
        <p>
          Les modalités liées aux données personnelles et aux traceurs sont détaillées dans la{" "}
          <Link className={LINK_CLASS} to="/confidentialite/">
            politique de confidentialité et cookies
          </Link>
          .
        </p>
      </Section>

      <Section id="responsabilite" title="8. Disponibilité et responsabilité">
        <p>
          L’éditrice s’efforce de fournir un service accessible et des informations sourcées, sans
          pouvoir garantir leur exhaustivité, leur actualité permanente ni l’absence d’erreur. Le
          visiteur reste responsable de ses décisions et de la vérification des informations auprès
          du restaurant concerné.
        </p>
        <p>
          Les présentes conditions peuvent évoluer avec le site, ses prestataires ou la
          réglementation. La version publiée sur cette page est celle applicable au moment de la
          consultation. Le droit français s’applique, sous réserve des règles impératives
          éventuellement applicables.
        </p>
      </Section>
    </LegalDocumentLayout>
  );
}
