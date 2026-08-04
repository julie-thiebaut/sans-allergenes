import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ALLERGEN_ICONS, ALLERGEN_LABELS_FR, ALLERGENS_SORTED_FR } from "../data/allergenLabels";
import { CafeIllustration } from "../components/common/CafeIllustration";
import { Navbar } from "../components/layout/Navbar";
import { Seo } from "../seo/Seo";
import { buildHomeMeta } from "../seo/seoData";

const HOME_META = buildHomeMeta(typeof window !== "undefined" ? window.location.origin : "");

/**
 * Wording rule for this whole page: it may describe what a restaurant DECLARED, never what a
 * dish contains. Nothing here may read as "safe", "sans risque" or a guarantee — the underlying
 * data has no such state, and a landing page is where an over-promise does the most damage.
 */
const STEPS = [
  {
    title: "Cherchez une adresse",
    body: "Les restaurants apparaissent autour, sur la carte ou en liste.",
  },
  {
    title: "Cochez vos allergènes",
    body: "Les plats qui les déclarent sont masqués, et les restaurants où il ne reste rien avec eux.",
  },
  {
    title: "Ouvrez une fiche",
    body: "Vous voyez, plat par plat, ce que l’établissement a déclaré.",
  },
];

function CtaButton({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <Link
      to="/carte"
      className={`inline-block rounded-lg bg-brand-500 px-6 py-3 text-base font-semibold text-neutral-900 shadow-sm transition-colors hover:bg-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 ${className}`}
    >
      {children}
    </Link>
  );
}

/** A miniature of a real dish row — showing the product beats describing it. */
function DishPreview() {
  return (
    <div className="rotate-1 rounded-xl border border-neutral-200 bg-white p-5 shadow-xl">
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-semibold text-neutral-900">Bruschetta tomate-basilic</span>
        <span className="whitespace-nowrap text-neutral-600">7,50 €</span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-neutral-900">Présent :</span>
        <span className="inline-flex items-center gap-1 rounded-md border border-neutral-300 bg-white px-2 py-1 text-xs text-neutral-800">
          <span aria-hidden="true">🌾</span> Gluten
        </span>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-neutral-900">Traces possibles :</span>
        <span className="inline-flex items-center gap-1 rounded-md border border-neutral-300 bg-white px-2 py-1 text-xs text-neutral-800">
          <span aria-hidden="true">🍷</span> Sulfites
        </span>
      </div>
    </div>
  );
}

export function LandingPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Seo title={HOME_META.title} description={HOME_META.description} />
      <Navbar showSearch={false} />

      <div className="overflow-y-auto">
        {/* Hero — tinted band so the page opens on something other than a wall of white */}
        <section className="border-b border-brand-200 bg-gradient-to-b from-brand-50 to-white">
          <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
            <div>
              {/* Mirrors the site name. It is the one deliberately promotional line on the
                  page; everything downstream of it stays strictly factual, and the block
                  further down states that this reflects declarations, not the current state
                  of a kitchen. Do not let this phrasing spread into dish or restaurant copy,
                  where it would read as a safety claim about a specific plate. */}
              <h1 className="text-4xl font-bold leading-[1.1] text-neutral-900 sm:text-5xl">
                Trouvez où manger{" "}
                <span className="bg-brand-500 box-decoration-clone px-2 leading-snug">
                  sans allergènes
                </span>
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-neutral-700">
                La loi impose aux restaurants de déclarer 14 allergènes. Ces informations
                existent, mais rarement avant d’être assis à table. Ce site les rassemble.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <CtaButton>Voir la carte</CtaButton>
                <span className="text-sm text-neutral-600">Gratuit, sans compte</span>
              </div>
            </div>
            {/* The card sits above the illustration and is kept narrower than it, so the two
                read as one stacked unit rather than two competing pictures. */}
            <div className="flex flex-col items-center gap-8 md:pl-4">
              <div className="w-full max-w-sm">
                <DishPreview />
              </div>
              <CafeIllustration />
            </div>
          </div>
        </section>

        {/* How it works — numbered cards instead of a bullet list */}
        <section className="mx-auto max-w-5xl px-4 py-14 md:py-20">
          <h2 className="text-center text-2xl font-bold text-neutral-900 sm:text-3xl">
            Comment ça marche
          </h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 font-bold text-neutral-900">
                  {index + 1}
                </span>
                <h3 className="mt-4 font-semibold text-neutral-900">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Allergen list on a tinted band, giving the page a second breathing point */}
        <section className="border-y border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-5xl px-4 py-14 md:py-20">
            <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
              Les 14 allergènes suivis
            </h2>
            <p className="mt-2 text-neutral-600">
              Ceux que la réglementation européenne rend obligatoires.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {ALLERGENS_SORTED_FR.map((id) => (
                <li
                  key={id}
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-800 shadow-sm"
                >
                  <span aria-hidden="true" className="text-base">
                    {ALLERGEN_ICONS[id]}
                  </span>
                  {ALLERGEN_LABELS_FR[id]}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Limits — deliberately the most prominent block on the page */}
        <section className="mx-auto max-w-5xl px-4 py-14 md:py-20">
          <div className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-6 md:p-8">
            <h2 className="text-xl font-bold text-amber-900">Signalez toujours votre allergie</h2>
            <p className="mt-3 leading-relaxed text-amber-900">
              Ce site répertorie les informations déclarées par le restaurant, une recette est
              susceptible d’avoir été modifiée depuis la dernière déclaration.
            </p>
            <p className="mt-3 font-semibold leading-relaxed text-amber-900">
              Avant de commander, prévenez toujours le personnel et confirmez avec lui que le
              plat vous convient.
            </p>
          </div>
        </section>

        {/* Closing CTA on a dark band, so the page ends on something deliberate */}
        <section className="bg-neutral-900">
          <div className="mx-auto max-w-5xl px-4 py-14 text-center md:py-16">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Trouvez où manger</h2>
            <p className="mx-auto mt-3 max-w-xl text-neutral-300">
              Parcourez les restaurants sur la carte, filtrez selon les allergènes que vous
              évitez, et consultez le détail de chaque plat.
            </p>
            <CtaButton className="mt-8">Voir la carte</CtaButton>
          </div>
        </section>
      </div>
    </div>
  );
}
