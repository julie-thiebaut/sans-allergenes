import type { SourceKind } from "../../data/types";

/**
 * Met en avant les établissements dont les allergènes sont publiés en ligne : ce sont les seuls
 * que le visiteur peut aller vérifier lui-même à la source. Les informations communiquées sur
 * demande restent affichées, mais sans la même mise en valeur — elles ne sont vérifiables par
 * personne d'autre que celui qui a posé la question.
 *
 * Cette distinction ne dit RIEN de la fiabilité des allergènes eux-mêmes : c'est
 * `AllergenAvailabilityBadge` qui parle de leur disponibilité, et le clause de non-garantie qui
 * rappelle qu'aucune des deux ne vaut promesse.
 */
export function SourceProvenanceBadge({ kind }: { kind: SourceKind }) {
  if (kind === "published") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-800">
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-3.5 w-3.5 shrink-0"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
            clipRule="evenodd"
          />
        </svg>
        Allergènes publiés en ligne
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700">
      Communiqués sur demande
    </span>
  );
}
