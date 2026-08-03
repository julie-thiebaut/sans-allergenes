export type MobileViewMode = "list" | "map";

interface MobileViewToggleProps {
  value: MobileViewMode;
  onChange: (value: MobileViewMode) => void;
}

/**
 * Standard segmented-control treatment (iOS, shadcn/Radix, Material 3 all converge here): the
 * track is the grey surface and the SELECTED segment lifts out of it as a white pill, rather
 * than the selection being a heavy filled block. Two knock-on benefits: mustard stays reserved
 * for actions (the filter button sits right beside this), and the control reads as one object
 * instead of two competing buttons.
 */
const SEGMENT_BASE = "rounded px-3 py-1.5 text-sm font-medium transition-colors";
const SEGMENT_SELECTED = "bg-white text-neutral-900 shadow-sm";
// neutral-600 rather than a lighter grey: on the neutral-100 track anything lighter drops
// under the 4.5:1 contrast floor for 14px text.
const SEGMENT_IDLE = "text-neutral-600 hover:text-neutral-900";

export function MobileViewToggle({ value, onChange }: MobileViewToggleProps) {
  return (
    <div
      role="group"
      aria-label="Affichage"
      className="inline-flex rounded-md bg-neutral-100 p-0.5"
    >
      <button
        type="button"
        aria-pressed={value === "list"}
        onClick={() => onChange("list")}
        className={`${SEGMENT_BASE} ${value === "list" ? SEGMENT_SELECTED : SEGMENT_IDLE}`}
      >
        Liste
      </button>
      <button
        type="button"
        aria-pressed={value === "map"}
        onClick={() => onChange("map")}
        className={`${SEGMENT_BASE} ${value === "map" ? SEGMENT_SELECTED : SEGMENT_IDLE}`}
      >
        Carte
      </button>
    </div>
  );
}
