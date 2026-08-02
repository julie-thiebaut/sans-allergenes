export type MobileViewMode = "list" | "map";

interface MobileViewToggleProps {
  value: MobileViewMode;
  onChange: (value: MobileViewMode) => void;
}

export function MobileViewToggle({ value, onChange }: MobileViewToggleProps) {
  return (
    <div
      role="group"
      aria-label="Affichage"
      className="inline-flex rounded-md border border-neutral-300 p-0.5"
    >
      <button
        type="button"
        aria-pressed={value === "list"}
        onClick={() => onChange("list")}
        className={`rounded px-3 py-1.5 text-sm font-medium ${
          value === "list" ? "bg-brand-500 text-neutral-900" : "text-neutral-700"
        }`}
      >
        Liste
      </button>
      <button
        type="button"
        aria-pressed={value === "map"}
        onClick={() => onChange("map")}
        className={`rounded px-3 py-1.5 text-sm font-medium ${
          value === "map" ? "bg-brand-500 text-neutral-900" : "text-neutral-700"
        }`}
      >
        Carte
      </button>
    </div>
  );
}
