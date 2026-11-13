import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ALLERGEN_ICONS, ALLERGENS_SORTED } from "../data/allergenLabels";
import { pagePath } from "../i18n/locale";
import { useLocale, useMessages } from "../i18n/useLocale";
import { CafeIllustration } from "../components/common/CafeIllustration";
import { Navbar } from "../components/layout/Navbar";
import { Seo } from "../seo/Seo";
import { ALLERGENS_ONLINE_NOTE_DATE, buildHomeMeta } from "../seo/seoData";

const ORIGIN = typeof window !== "undefined" ? window.location.origin : "";
const HOME_META = { fr: buildHomeMeta(ORIGIN, "fr"), en: buildHomeMeta(ORIGIN, "en") };

/**
 * Wording rule for this whole page: it may describe what a restaurant DECLARED, never what a
 * dish contains. Nothing here may read as "safe", "sans risque" or a guarantee — the underlying
 * data has no such state, and a landing page is where an over-promise does the most damage.
 */
function CtaButton({ children, className = "" }: { children: ReactNode; className?: string }) {
  const locale = useLocale();
  return (
    <Link
      to={pagePath("map", locale)}
      className={`inline-block rounded-lg bg-brand-500 px-6 py-3 text-base font-semibold text-neutral-900 shadow-sm transition-colors hover:bg-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 ${className}`}
    >
      {children}
    </Link>
  );
}

export function LandingPage() {
  const locale = useLocale();
  const t = useMessages();
  const page = t.landing;
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Seo meta={HOME_META[locale]} />
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
                {page.titleBefore}{" "}
                <span className="bg-brand-500 box-decoration-clone px-2 leading-snug">
                  {page.titleHighlight}
                </span>
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-neutral-700">{page.intro}</p>
              <div className="mt-7">
                <CtaButton>{t.common.exploreMap}</CtaButton>
              </div>
            </div>
            <div className="flex justify-center md:pl-4">
              <CafeIllustration />
            </div>
          </div>
        </section>

        {/* How it works — numbered cards instead of a bullet list */}
        <section className="mx-auto max-w-5xl px-4 py-14 md:py-20">
          <h2 className="text-center text-2xl font-bold text-neutral-900 sm:text-3xl">
            {page.howItWorks}
          </h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {page.steps.map((step, index) => (
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
              {page.allergensTitle}
            </h2>
            <p className="mt-2 text-neutral-600">{page.allergensBody}</p>
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {ALLERGENS_SORTED[locale].map((id) => (
                <li
                  key={id}
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-800 shadow-sm"
                >
                  <span aria-hidden="true" className="text-base">
                    {ALLERGEN_ICONS[id]}
                  </span>
                  {t.allergens[id]}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Who runs the site, ahead of the note because the note says "j’ai examiné". The
            no-partnership claim repeats the legal notice; change them together. The note on the law
            and on what restaurants publish: a plain white card, so it never outweighs the limits
            block, and a hairline after it so the two boxes don't run together */}
        <section className="mx-auto max-w-5xl px-4 pt-14 md:pt-20">
          <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">{page.whoTitle}</h2>
          <p className="mt-3 leading-relaxed text-neutral-600">{page.whoBody}</p>
          <div className="mt-8 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
              {page.noteKicker} ·{" "}
              <time dateTime={ALLERGENS_ONLINE_NOTE_DATE}>{t.seo.noteDateLabel}</time>
            </p>
            <h2 className="mt-2 text-xl font-bold text-neutral-900 sm:text-2xl">
              {t.seo.noteTitle}
            </h2>
            <p className="mt-3 leading-relaxed text-neutral-600">{page.noteBody1}</p>
            <p className="mt-3 leading-relaxed text-neutral-600">{page.noteBody2}</p>
            <Link
              to={pagePath("allergensOnlineNote", locale)}
              className="mt-4 inline-block font-semibold text-neutral-900 underline decoration-brand-500 decoration-2 underline-offset-4 hover:decoration-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
            >
              {page.readNote}
            </Link>
          </div>
          <hr className="mt-14 border-neutral-200 md:mt-20" />
        </section>

        {/* Limits — deliberately the most prominent block on the page */}
        <section className="mx-auto max-w-5xl px-4 py-14 md:py-20">
          <div className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-6 md:p-8">
            <h2 className="text-xl font-bold text-amber-900">{page.limitsTitle}</h2>
            <p className="mt-3 leading-relaxed text-amber-900">{page.limitsBody}</p>
            <p className="mt-3 font-semibold leading-relaxed text-amber-900">{page.limitsStrong}</p>
          </div>
        </section>

        {/* Closing CTA on a dark band, so the page ends on something deliberate */}
        <section className="bg-neutral-900">
          <div className="mx-auto max-w-5xl px-4 py-14 text-center md:py-16">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">{page.closingTitle}</h2>
            <p className="mx-auto mt-3 max-w-xl text-neutral-300">{page.closingBody}</p>
            <CtaButton className="mt-8">{t.common.exploreMap}</CtaButton>
          </div>
        </section>
      </div>
    </div>
  );
}
