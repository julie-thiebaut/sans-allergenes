import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { LegalDocumentLayout } from "../../components/layout/LegalDocumentLayout";
import { pagePath } from "../../i18n/locale";
import { buildLegalMeta } from "../../seo/seoData";

/**
 * The English translation of LegalNoticePage. Change the two together: the French text is the one
 * that applies, and this page says so.
 */
const LEGAL_META = buildLegalMeta(
  typeof window !== "undefined" ? window.location.origin : "",
  "en",
);
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

export function LegalNoticePageEn() {
  return (
    <LegalDocumentLayout
      title="Legal notice and terms of use"
      introduction="This page identifies the publisher and the host of the site, then sets out the rules for using the Sans Allergènes service."
      meta={LEGAL_META}
    >
      <p className="rounded-md border border-neutral-200 bg-neutral-50 p-4 text-sm">
        This is a translation provided for convenience. The{" "}
        <Link className={LINK_CLASS} to={pagePath("legal", "fr")} hrefLang="fr">
          French version
        </Link>{" "}
        is the one that applies.
      </p>

      <Section id="edition" title="1. Publisher and publication director">
        <p>
          The <strong>Sans Allergènes</strong> website, available at{" "}
          <a className={LINK_CLASS} href="https://sans-allergenes.fr/">
            sans-allergenes.fr
          </a>
          , is published on a non-professional basis by <strong>Julie Thiebaut</strong>, who is also
          its publication director.
        </p>
        <p>
          Contact:{" "}
          <a className={LINK_CLASS} href="mailto:contact@sans-allergenes.fr">
            contact@sans-allergenes.fr
          </a>
        </p>
      </Section>

      <Section id="hebergement" title="2. Hosting">
        <p>The site is hosted by the GitHub Pages service of:</p>
        <address className="not-italic">
          <strong>GitHub, Inc.</strong>
          <br />
          88 Colin P. Kelly Jr. Street
          <br />
          San Francisco, CA 94107
          <br />
          United States
        </address>
        <p>
          Host’s website:{" "}
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

      <Section id="service" title="3. Purpose of and access to the service">
        <p>
          Sans Allergènes is a free information service, with no user account. It helps people read
          the allergen declarations published or provided by restaurants, and find the dishes for
          which certain allergens are declared.
        </p>
        <p>
          The site sells no products, takes no bookings, and acts neither on behalf of the
          restaurants listed nor as an intermediary between visitors and these establishments.
          Unless stated otherwise, there is no commercial partnership with them.
        </p>
        <p>
          Access to the site is provided free of charge. It may be interrupted or changed for
          reasons of maintenance, security, cost or changes to the project.
        </p>
      </Section>

      <Section id="allergenes" title="4. Allergen information">
        <div className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-5 text-amber-950">
          <p className="font-semibold">The site is not a guarantee of safety.</p>
          <p className="mt-2">
            The information shown reproduces or summarises declarations made by third parties.
            Recipes, ingredients, suppliers and kitchen practices may change, and
            cross-contamination remains possible.
          </p>
        </div>
        <p>
          The filters exclude the dishes for which the selected allergen is declared present.
          Mentions of possible traces, incomplete information and dishes with no usable declaration
          remain marked as such. A result appearing in the list therefore never means that a dish or
          a restaurant is suitable for an allergy.
        </p>
        <p>
          Visitors with an allergy must contact the establishment directly, tell the staff about
          their allergy before ordering and check the information at the time of eating. The site
          gives no medical advice and replaces neither a health professional nor the restaurant’s
          staff.
        </p>
      </Section>

      <Section id="sources" title="5. Sources, updates and corrections">
        <p>
          Each restaurant page shows, where the information is available, the source used and the
          date it was last checked. Source content remains the responsibility of its respective
          authors and publishers.
        </p>
        <p>
          An error, out-of-date information or a request for correction can be reported to{" "}
          <a className={LINK_CLASS} href="mailto:contact@sans-allergenes.fr">
            contact@sans-allergenes.fr
          </a>
          , or with the “Report a problem” link on each restaurant page, which prepares the message.
          Please give the restaurant, the page concerned and, if possible, an up-to-date source.
        </p>
      </Section>

      <Section id="propriete-intellectuelle" title="6. Intellectual property">
        <p>
          The structure, design, original texts and graphic elements of the site are protected by
          intellectual property law. Any reuse beyond the exceptions provided for by law requires
          the prior consent of their owner.
        </p>
        <p>
          The trade names, trademarks, logos, menus and content belonging to restaurants or other
          third parties remain the property of their owners. They are mentioned only to identify the
          establishments and the sources of information; this implies no affiliation or endorsement.
        </p>
      </Section>

      <Section id="services-tiers" title="7. Links and third-party services">
        <p>
          The site contains links to restaurants’ websites and uses Google Maps Platform for the map
          and the address search. With the visitor’s consent, it also uses Google Analytics to
          produce visitor statistics. These services are governed by their own terms and policies.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <a
              className={LINK_CLASS}
              href="https://marketingplatform.google.com/about/analytics/terms/gb/"
              target="_blank"
              rel="noreferrer"
            >
              Google Analytics Terms of Service
            </a>
          </li>
          <li>
            <a
              className={LINK_CLASS}
              href="https://www.google.com/help/terms_maps/"
              target="_blank"
              rel="noreferrer"
            >
              Google Maps Terms of Service
            </a>
          </li>
          <li>
            <a
              className={LINK_CLASS}
              href="https://policies.google.com/privacy?hl=en"
              target="_blank"
              rel="noreferrer"
            >
              Google Privacy Policy
            </a>
          </li>
        </ul>
        <p>
          How personal data and trackers are handled is set out in the{" "}
          <Link className={LINK_CLASS} to={pagePath("privacy", "en")}>
            privacy and cookie policy
          </Link>
          .
        </p>
      </Section>

      <Section id="responsabilite" title="8. Availability and liability">
        <p>
          The publisher strives to provide an accessible service and sourced information, without
          being able to guarantee that it is complete, always up to date or free of errors. Visitors
          remain responsible for their decisions and for checking the information with the
          restaurant concerned.
        </p>
        <p>
          These terms may change along with the site, its service providers or the regulations. The
          version published on this page is the one that applies at the time it is read. French law
          applies, subject to any mandatory rules that may apply.
        </p>
      </Section>
    </LegalDocumentLayout>
  );
}
