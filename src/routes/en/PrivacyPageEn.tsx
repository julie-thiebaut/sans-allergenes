import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { LegalDocumentLayout } from "../../components/layout/LegalDocumentLayout";
import { pagePath } from "../../i18n/locale";
import { buildPrivacyMeta } from "../../seo/seoData";

/**
 * The English translation of PrivacyPage. Change the two together: the French text is the one
 * that applies, and this page says so.
 */
const PRIVACY_META = buildPrivacyMeta(
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

export function PrivacyPageEn() {
  return (
    <LegalDocumentLayout
      title="Privacy and cookies"
      introduction="This policy explains what data may be processed while you browse the site, why, and how to exercise your rights."
      meta={PRIVACY_META}
    >
      <p className="rounded-md border border-neutral-200 bg-neutral-50 p-4 text-sm">
        This is a translation provided for convenience. The{" "}
        <Link className={LINK_CLASS} to={pagePath("privacy", "fr")} hrefLang="fr">
          French version
        </Link>{" "}
        is the one that applies.
      </p>

      <div className="rounded-xl border border-brand-200 bg-brand-50 p-5">
        <p className="font-semibold text-neutral-900">In short</p>
        <p className="mt-2 leading-relaxed">
          Sans Allergènes offers no account, no advertising and no newsletter. Google Analytics is
          used only with your consent, to measure visits. The site does not keep your filters in a
          database and does not send their content to Analytics. GitHub processes the technical data
          needed for hosting, and Google also receives data when the map or the address search is
          used.
        </p>
      </div>

      <Section id="responsable" title="1. Controller and contact">
        <p>
          The controller of the processing carried out directly by the site is{" "}
          <strong>Julie Thiebaut</strong>, non-professional publisher of Sans Allergènes.
        </p>
        <p>
          For any question or request about your data:{" "}
          <a className={LINK_CLASS} href="mailto:contact@sans-allergenes.fr">
            contact@sans-allergenes.fr
          </a>
        </p>
      </Section>

      <Section id="traitements" title="2. Data processed and purposes">
        <div className="overflow-x-auto rounded-xl border border-neutral-200">
          <table className="min-w-full divide-y divide-neutral-200 text-left text-sm">
            <thead className="bg-neutral-100 text-neutral-900">
              <tr>
                <th className="px-4 py-3 font-semibold" scope="col">
                  Situation
                </th>
                <th className="px-4 py-3 font-semibold" scope="col">
                  Data that may be processed
                </th>
                <th className="px-4 py-3 font-semibold" scope="col">
                  Purpose and legal basis
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white align-top">
              <tr>
                <th className="px-4 py-4 font-medium text-neutral-900" scope="row">
                  Browsing and hosting
                </th>
                <td className="px-4 py-4">
                  IP address, date and time, page requested, browser and technical connection data,
                  processed by GitHub.
                </td>
                <td className="px-4 py-4">
                  Displaying, securing and maintaining the site — legitimate interest in providing a
                  reliable service.
                </td>
              </tr>
              <tr>
                <th className="px-4 py-4 font-medium text-neutral-900" scope="row">
                  Map and address search
                </th>
                <td className="px-4 py-4">
                  IP address, device and browser information, interactions with the map and text
                  typed in the address field, processed by Google.
                </td>
                <td className="px-4 py-4">
                  Displaying the map and suggesting addresses — legitimate interest in providing the
                  map feature explicitly requested.
                </td>
              </tr>
              <tr>
                <th className="px-4 py-4 font-medium text-neutral-900" scope="row">
                  Optional audience measurement
                </th>
                <td className="px-4 py-4">
                  Pages viewed without their filter parameters, page title, referring site,
                  technical visit events, device type, browser, approximate location and a random
                  identifier stored in Google Analytics cookies.
                </td>
                <td className="px-4 py-4">
                  Understanding visits and improving the site — your consent, which you can withdraw
                  at any time.
                </td>
              </tr>
              <tr>
                <th className="px-4 py-4 font-medium text-neutral-900" scope="row">
                  Allergen filters
                </th>
                <td className="px-4 py-4">
                  Allergens and other filters chosen, written into the page’s URL.
                </td>
                <td className="px-4 py-4">
                  Keeping the selection while browsing and allowing a view to be shared — a feature
                  requested by the user.
                </td>
              </tr>
              <tr>
                <th className="px-4 py-4 font-medium text-neutral-900" scope="row">
                  Contact by email
                </th>
                <td className="px-4 py-4">
                  Email address, name if given, content of the message and any information
                  voluntarily provided.
                </td>
                <td className="px-4 py-4">
                  Answering the request and following it up — legitimate interest in handling the
                  messages received.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          The publisher carries out no advertising profiling, no automated decision-making and no
          profiling of any kind.
        </p>
      </Section>

      <Section id="filtres" title="3. Filters and allergy-related information">
        <p>
          The filters you choose may sometimes reveal a dietary preference or information about an
          allergy. They are kept only in the URL and in the application’s temporary state: Sans
          Allergènes does not record them in a database and does not link them to an account.
        </p>
        <p>
          The URL may remain in the browser’s history or be seen by anyone it is shared with. When a
          filtered link is opened or reloaded, the URL requested may also appear in the host’s
          technical logs. The reset filters button removes these parameters from the URL.
        </p>
        <p>
          Page views sent to Google Analytics are deliberately stripped of all their URL parameters.
          The content of the filters, including the allergens-to-avoid parameter, is therefore not
          sent to the audience measurement tool.
        </p>
        <p>
          The “Contact the restaurant” and “Write to the restaurant” buttons open your email app
          with a message addressed to the restaurant or its chain. The message is sent directly by
          you: it does not pass through Sans Allergènes, which has no knowledge of it. What you
          write in it, including about an allergy, is then covered by the restaurant’s privacy
          policy.
        </p>
      </Section>

      <Section id="cookies" title="4. Cookies and third-party services">
        <p>
          On your first visit, you can accept or decline Google Analytics just as easily. Until you
          have accepted, the Analytics tag is not loaded and no Analytics cookie is set. Your choice
          is remembered for six months in the browser’s local storage; this record is strictly
          necessary to respect your decision.
        </p>
        <p>
          Once accepted, Google Analytics may set the <code>_ga</code> and{" "}
          <code>_ga_&lt;identifier&gt;</code> cookies to tell visits apart. The site limits their
          lifetime to thirteen months at most. Advertising features, ad personalisation and Google
          Signals are turned off. The site sends no account identifier, no address search and no
          allergen selection to Analytics.
        </p>
        <p>
          You can change your choice at any time with the <strong>“Manage cookies”</strong> button
          in the footer. If you withdraw consent, measurement is turned off and the Analytics
          cookies the site can access are deleted.
        </p>
        <p>
          The Map page also uses <strong>Google Maps Platform</strong>: the Maps JavaScript API
          displays the map, while the Places library and <strong>Places API (New)</strong> produce
          the address suggestions and retrieve the position of the address selected. Loading these
          services lets Google receive technical data and may allow it to set or read cookies and
          identifiers under its own rules. The text typed in the address field is sent to Google to
          provide the suggestions; Sans Allergènes does not record it in a database.
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
              href="https://policies.google.com/privacy?hl=en"
              target="_blank"
              rel="noreferrer"
            >
              Google Privacy Policy
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
        </ul>
        <p>
          Hosting is provided by GitHub Pages. GitHub processes technical requests under its{" "}
          <a
            className={LINK_CLASS}
            href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
            target="_blank"
            rel="noreferrer"
          >
            General Privacy Statement
          </a>
          .
        </p>
      </Section>

      <Section id="destinataires" title="5. Recipients and transfers outside the European Union">
        <p>
          Depending on the feature used, data may be processed by the publisher, her email provider,
          GitHub for hosting and Google for Analytics, the map and the address search. For Google
          Analytics, Google Ireland Limited acts as the audience measurement provider. Sans
          Allergènes neither sells nor rents data.
        </p>
        <p>
          GitHub and Google are international groups that may process some data outside the European
          Economic Area. Information about their transfers and the safeguards used is given in their
          respective privacy policies, linked in the previous section.
        </p>
      </Section>

      <Section id="conservation" title="6. Retention periods">
        <ul className="list-disc space-y-3 pl-5">
          <li>
            <strong>Filters:</strong> not kept in any database of the site; they remain in the URL
            and possibly in the browser’s history until deleted.
          </li>
          <li>
            <strong>Emails:</strong> kept for as long as needed to handle the request, then at most
            twelve months after the last exchange, unless required by law or to defend a right.
          </li>
          <li>
            <strong>Analytics choice:</strong> six months, after which the site asks for your choice
            again.
          </li>
          <li>
            <strong>Analytics cookies:</strong> thirteen months at most after they were last
            updated.
          </li>
          <li>
            <strong>User-level and event-level Analytics data:</strong> two months in the Google
            Analytics property. Aggregated statistical reports may remain available for longer.
          </li>
          <li>
            <strong>Other GitHub and Google technical data:</strong> kept for the periods set by
            these providers in their own policies.
          </li>
        </ul>
      </Section>

      <Section id="droits" title="7. Your rights">
        <p>
          Depending on the processing concerned and its legal basis, you may request access to,
          rectification, erasure or restriction of your data, and object to certain processing.
          Where processing is based on your consent, you can withdraw it at any time.
        </p>
        <p>
          To exercise a right with Sans Allergènes, write to{" "}
          <a className={LINK_CLASS} href="mailto:contact@sans-allergenes.fr">
            contact@sans-allergenes.fr
          </a>
          . Proof of identity will only be requested if there is reasonable doubt about the
          requester’s identity.
        </p>
        <p>
          You can also lodge a complaint with the{" "}
          <a
            className={LINK_CLASS}
            href="https://www.cnil.fr/en/home"
            target="_blank"
            rel="noreferrer"
          >
            Commission nationale de l’informatique et des libertés (CNIL)
          </a>
          , the French data protection authority.
        </p>
      </Section>

      <Section id="evolution" title="8. Changes to this policy">
        <p>
          This policy will be updated if the features, the providers or the applicable rules change.
          The update date at the top of the page identifies the version in force.
        </p>
        <p>
          For the publisher’s identity, the host and the general rules of the service, see the{" "}
          <Link className={LINK_CLASS} to={pagePath("legal", "en")}>
            legal notice and terms of use
          </Link>
          .
        </p>
      </Section>
    </LegalDocumentLayout>
  );
}
