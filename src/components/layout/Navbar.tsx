import { TextSearchInput } from "../filters/TextSearchInput";

export function Navbar() {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-neutral-200 bg-white px-4 py-3">
      <span className="shrink-0 text-lg font-bold text-neutral-900">
        <span className="text-brand-500">sans</span>Allergènes
      </span>
      <div className="w-full max-w-xs">
        <TextSearchInput />
      </div>
    </header>
  );
}
