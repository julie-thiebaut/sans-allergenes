import { Link } from "react-router-dom";
import { TextSearchInput } from "../filters/TextSearchInput";

/**
 * `showSearch` is off on pages without a map: the address box drives the map view and depends
 * on MapActionsProvider, which only the map page mounts.
 */
export function Navbar({ showSearch = true }: { showSearch?: boolean }) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-neutral-200 bg-white px-4 py-3">
      <Link
        to="/"
        className="shrink-0 text-lg font-bold text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
      >
        <span className="text-brand-500">sans</span>Allergènes
      </Link>
      {showSearch ? (
        <div className="w-full max-w-xs">
          <TextSearchInput />
        </div>
      ) : (
        <Link
          to="/carte"
          className="shrink-0 rounded-md bg-brand-500 px-3 py-2 text-sm font-semibold text-neutral-900 hover:bg-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
        >
          Voir la carte
        </Link>
      )}
    </header>
  );
}
