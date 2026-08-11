import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Seo } from "../../seo/Seo";
import type { PageMeta } from "../../seo/seoData";

export function LegalDocumentLayout({
  title,
  introduction,
  meta,
  children,
}: {
  title: string;
  introduction: string;
  meta: PageMeta;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Seo meta={meta} />
      <Navbar showSearch={false} />

      <div className="overflow-y-auto">
        <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
          <header className="border-b border-neutral-200 pb-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">
              Sans Allergènes
            </p>
            <h1 className="mt-2 text-3xl font-bold text-neutral-900 sm:text-4xl">{title}</h1>
            <p className="mt-4 max-w-2xl leading-relaxed text-neutral-600">{introduction}</p>
            <p className="mt-3 text-sm text-neutral-500">Dernière mise à jour : 11 août 2026</p>
          </header>

          <div className="space-y-10 py-8 text-neutral-700">{children}</div>
        </article>
      </div>
    </div>
  );
}
