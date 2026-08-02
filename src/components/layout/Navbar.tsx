import { Link } from "react-router-dom";
import { TextSearchInput } from "../filters/TextSearchInput";

export function Navbar() {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-neutral-200 bg-white px-4 py-3">
      <Link
        to="/"
        className="shrink-0 text-lg font-bold text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
      >
        <span className="text-brand-500">sans</span>Allergènes
      </Link>
      <div className="w-full max-w-xs">
        <TextSearchInput />
      </div>
    </header>
  );
}
