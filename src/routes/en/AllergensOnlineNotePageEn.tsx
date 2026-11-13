import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../../components/layout/Navbar";
import { en } from "../../i18n/messages/en";
import { pagePath } from "../../i18n/locale";
import { Seo } from "../../seo/Seo";
import { ALLERGENS_ONLINE_NOTE_DATE, buildAllergensOnlineNoteMeta } from "../../seo/seoData";

/**
 * The English translation of AllergensOnlineNotePage, Julie's note, kept in the first person and
 * as close to the French as English allows. The figures are those of the French note's date; change
 * the two pages together.
 */
const NOTE_META = buildAllergensOnlineNoteMeta(
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

function ExternalLink({
  href,
  children,
  hrefLang,
}: {
  href: string;
  children: ReactNode;
  hrefLang?: string;
}) {
  return (
    <a className={LINK_CLASS} href={href} hrefLang={hrefLang} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

export function AllergensOnlineNotePageEn() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Seo meta={NOTE_META} />
      <Navbar showSearch={false} />

      <div className="overflow-y-auto">
        <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
          <header className="border-b border-neutral-200 pb-8">
            <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">{en.seo.noteTitle}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-neutral-700">
              Since 2015, restaurants in France have had to give their customers written information
              on the allergens in their dishes. But when you want to choose a restaurant ahead of
              time, this information is still hard to find. I went through several thousand Paris
              restaurant websites to measure how hard, and to look for ways we can improve things
              together.
            </p>
            <p className="mt-3 text-sm text-neutral-500">
              <time dateTime={ALLERGENS_ONLINE_NOTE_DATE}>{en.seo.noteDateLabel}</time> · Translated
              from the{" "}
              <Link className={LINK_CLASS} to={pagePath("allergensOnlineNote", "fr")} hrefLang="fr">
                French original
              </Link>
            </p>
          </header>

          <div className="space-y-10 py-8 text-neutral-700">
            <Section id="parcours" title="Eating out with an allergy: a complicated journey">
              <p>
                Choosing a restaurant should be a pleasure. You look at the photos, read the menu,
                hesitate between several places. But when you live with a food allergy, things are
                often a little more complicated.
              </p>
              <p>
                Before even booking, you have to try to work out whether the restaurant serves
                dishes you will be able to eat. The menu is sometimes online, but the ingredients
                are not always listed. And even when they are, it is hard to know whether a sauce
                contains soya, whether a dish was prepared with celery or whether a dessert contains
                nuts.
              </p>
              <p>
                Without information, there is often only one option left: contact the restaurant
                directly, explain your allergy and wait for an answer. Or go there without knowing
                whether you will find anything suitable.
              </p>
              <p>
                Yet allergen information has been mandatory for more than ten years. So why is it
                still so hard to look up before going to a restaurant?
              </p>
            </Section>

            <Section id="loi" title="What the law says about allergens in restaurants">
              <p>
                The{" "}
                <ExternalLink href="https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX:32011R1169">
                  European Regulation (EU) No&nbsp;1169/2011
                </ExternalLink>
                , known as the “FIC” regulation (“INCO” in French), requires consumers to be told
                about the presence in food of certain substances that cause allergies or
                intolerances.
              </p>
              <p>
                Largely applicable since 13 December 2014, this regulation sets out a list of 14
                categories of allergens that must be declared, including cereals containing gluten,
                eggs, milk, peanuts, soya, celery and nuts.
              </p>
              <p>
                In France,{" "}
                <ExternalLink
                  href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000030491684"
                  hrefLang="fr"
                >
                  decree no.&nbsp;2015-447 of 17 April 2015
                </ExternalLink>
                , in force since 1 July 2015, set out how this information must be given for
                non-prepacked food, in restaurants in particular.
              </p>
              <p>
                Today,{" "}
                <ExternalLink
                  href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032807854"
                  hrefLang="fr"
                >
                  article R.&nbsp;412-14 of the French Consumer Code
                </ExternalLink>{" "}
                requires restaurants to inform their customers, in writing, of the allergens in the
                dishes they serve. This information must be legible and visible, or the way to
                consult it must be indicated. In the latter case, customers must be able to access
                the written information directly and freely.
              </p>
              <p>
                In practice, it can appear on the menu, on a board displayed in the restaurant or in
                an allergen book made available to customers. These are some of the formats observed
                by the DGCCRF, the French consumer protection authority, during its inspections.
              </p>
              <p>
                On the other hand, the regulations do not always require restaurants to publish
                their allergen list online. Distance selling is treated differently, however: when a
                restaurant lets customers order dishes online, the mandatory allergen information
                must be available before the purchase is completed, under article 14 of the
                regulation.
              </p>
            </Section>

            <Section id="controles" title="DGCCRF inspections: problems already identified">
              <p>
                The Directorate-General for Competition, Consumer Affairs and Fraud Control (DGCCRF)
                checks, among other things, that consumer information obligations are met.
              </p>
              <p>
                In 2015, an{" "}
                <ExternalLink
                  href="https://www.economie.gouv.fr/dgccrf/laction-de-la-dgccrf/les-enquetes/etiquetage-des-denrees-alimentaires-controle-de"
                  hrefLang="fr"
                >
                  investigation into how the regulation was being applied
                </ExternalLink>{" "}
                covered 3,671 establishments across all food sectors. It resulted in 1,844 warnings
                and 60 official reports of offences.
              </p>
              <p>
                In the restaurant sector, inspectors found an uneven picture: chains generally knew
                their obligations better than independent restaurants. Many professionals still
                misunderstood the rules, in particular the difference between allergens present in
                the ingredients and the risk of cross-contamination. The DGCCRF had then favoured
                awareness-raising and warnings.
              </p>
              <p>
                More recently, an{" "}
                <ExternalLink
                  href="https://www.economie.gouv.fr/dgccrf/laction-de-la-dgccrf/les-enquetes-et-les-controles/gare-aux-tromperies-sur-les-plats-livres"
                  hrefLang="fr"
                >
                  investigation carried out in 2023 into meal delivery, published in August 2025
                </ExternalLink>
                , showed that these problems persisted.
              </p>
              <p>
                Of 646 establishments inspected, 136 were committing offences, or 21%, all types of
                breach combined. The inspections led in particular to 114 orders to comply. Missing
                allergen information was among the problems frequently found.
              </p>
              <p>
                The DGCCRF also reports that a delivery platform had to change its website and app
                so that restaurants could indicate the allergens in their dishes.
              </p>
              <p>
                These inspections show that access to reliable information is still a live issue,
                even though the regulations are long-standing.
              </p>
            </Section>

            <Section id="recherche" title="I looked for allergens on Paris restaurants’ websites">
              <p>
                In August 2026, I wanted to measure how far it was possible to know a restaurant’s
                allergens before going there.
              </p>
              <p>
                So I carried out a large-scale search of the websites of restaurants, cafés and
                fast-food outlets in Paris, based on data from Google Maps and OpenStreetMap.
              </p>
              <p>
                On Google Maps, 13,703 establishments were found, 3,932 of them with no website
                listed.
              </p>
              <p>
                After combining the different sources and removing duplicates, I ended up with 8,023
                separate websites. The search covered their pages, their menus, their PDF documents
                and their images. Potentially relevant results were then checked by hand.
              </p>
              <p>Here is what I found:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  7,203 websites could be examined, of which 6,874 had no information found that
                  linked the dishes served to their allergens.
                </li>
                <li>
                  820 websites could not be examined, because they were unavailable or blocked
                  automated reading.
                </li>
              </ul>
              <p>
                In October 2026, I ran the search again on these 820 websites: 208 could be
                examined, and 307 no longer exist. In total, 7,411 websites were therefore examined,
                7,063 of them with no information found linking the dishes served to their
                allergens.
              </p>
              <p>
                More than 95% of the websites examined had no information found linking the dishes
                served to their allergens.
              </p>
              <p>
                This result should be read with caution. This search is not an exhaustive census of
                every restaurant in Paris. Some content may also have escaped the automated search,
                and the information may have changed since August 2026.
              </p>
              <p>Above all, this study only covers information available online.</p>
              <p>
                No information found online therefore does not mean that the restaurant fails to
                meet its legal obligations on its premises. It does show, however, how hard it still
                is for someone with an allergy to choose a restaurant with full knowledge before
                going there.
              </p>
            </Section>

            <Section
              id="sans-allergenes"
              title="Sans Allergènes: making this information easier to find"
            >
              <p>
                I created{" "}
                <Link className={LINK_CLASS} to={pagePath("home", "en")}>
                  Sans Allergènes
                </Link>{" "}
                to address this problem.
              </p>
              <p>
                The aim is simple: to let people affected by food allergies search for a restaurant
                and read the information available on the allergens in its dishes.
              </p>
              <p>
                As of 8 October 2026, Sans Allergènes lists 369 restaurants, covering 7,246 dishes
                and drinks from 127 menus. One menu can cover several restaurants, in particular
                when they belong to a chain.
              </p>
              <p>
                In the coming months, the aim is to gradually extend this coverage to more
                restaurants and websites, to make more and more information available to people with
                allergies.
              </p>
              <p>
                But listing the information that exists is not enough. Restaurants also need to be
                encouraged to make it available and keep it up to date.
              </p>
            </Section>

            <Section id="demander" title="What if we asked restaurants to publish their allergens?">
              <p>
                Restaurants often already have this information for their customers on the premises.
                Publishing it online would let people with allergies plan their meals out more
                easily, without having to call or write to every restaurant.
              </p>
              <p>
                To make this easier, I added to Sans Allergènes a way to contact restaurants with
                ready-made messages.
              </p>
              <p>
                The site’s map also lists restaurants for which no allergen menu could be included.
                Among the restaurants identified:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  855 restaurants with no allergen list found online have an email address and can
                  be contacted to ask them to publish this information.
                </li>
                <li>
                  274 restaurants that already have an allergen list online and an email address can
                  be contacted to ask for a clarification or an update.
                </li>
              </ul>
              <p>
                These figures concern the contact options offered on the map, not only the 369
                restaurants whose menus are listed with their allergens.
              </p>

              <h3 id="participer" className="scroll-mt-4 pt-2 text-lg font-bold text-neutral-900">
                How can you take part?
              </h3>
              <p>
                Go to the{" "}
                <Link className={LINK_CLASS} to={pagePath("map", "en")}>
                  Sans Allergènes map
                </Link>
                .
              </p>
              <p>
                To also show the restaurants with no allergen information found online, untick the “
                {en.filters.allergenInfoOnly}” filter.
              </p>
              <p>
                When an email address is available, you can use the ready-made message to contact
                the restaurant. The message opens in your own email app and you send it directly to
                the restaurant, without going through Sans Allergènes. The message is in French, for
                the restaurant to read.
              </p>
              <p>
                The aim is to encourage individual, courteous and constructive requests, rather than
                mass mailings. A few minutes are enough to explain to a restaurant owner why an
                allergen list available online would be useful to their customers.
              </p>
              <p>
                If, on the other hand, you find that a restaurant does not provide the mandatory
                written information on its premises, you can report the problem on{" "}
                <ExternalLink href="https://signal.conso.gouv.fr/fr/cafe-restaurant" hrefLang="fr">
                  SignalConso
                </ExternalLink>
                , the DGCCRF’s public reporting platform.
              </p>
            </Section>

            <Section
              id="dialogue"
              title="Useful information, which does not replace talking to the restaurant"
            >
              <p>
                An allergen list available online helps you make a first choice, but on its own it
                does not guarantee that a dish is suitable for every allergy.
              </p>
              <p>
                Recipes may change, information may not be up to date and cross-contamination can
                happen during preparation.
              </p>
              <p>
                Even when a list is available, it is therefore essential to always tell the staff
                about your allergy before ordering, to check the ingredients and how the dish is
                prepared.
              </p>
              <p>
                So, if a restaurant you like does not yet publish its allergens, why not send it a
                short message? A list made available could help everyone who, like you, wants to
                know what they will be able to eat before going out.
              </p>
            </Section>

            <Section id="sources" title="Official sources">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <ExternalLink href="https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX:32011R1169">
                    Regulation (EU) No&nbsp;1169/2011, articles 9, 14 and 44 and Annex II
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink
                    href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000030491684"
                    hrefLang="fr"
                  >
                    Decree no.&nbsp;2015-447 of 17 April 2015, Légifrance (in French)
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink
                    href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032807854"
                    hrefLang="fr"
                  >
                    French Consumer Code, article R.&nbsp;412-14, Légifrance (in French)
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink
                    href="https://www.economie.gouv.fr/dgccrf/laction-de-la-dgccrf/les-enquetes/etiquetage-des-denrees-alimentaires-controle-de"
                    hrefLang="fr"
                  >
                    DGCCRF, inspection of how the INCO regulation is applied, 2015 investigation (in
                    French)
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink
                    href="https://www.economie.gouv.fr/dgccrf/laction-de-la-dgccrf/les-enquetes-et-les-controles/gare-aux-tromperies-sur-les-plats-livres"
                    hrefLang="fr"
                  >
                    DGCCRF, “Gare aux tromperies sur les plats livrés à domicile”, 8 August 2025 (in
                    French)
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink
                    href="https://signal.conso.gouv.fr/fr/cafe-restaurant"
                    hrefLang="fr"
                  >
                    SignalConso, cafés and restaurants (in French)
                  </ExternalLink>
                </li>
              </ul>
            </Section>
          </div>
        </article>
      </div>
    </div>
  );
}
