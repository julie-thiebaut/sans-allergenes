/**
 * Drawn rather than the "→"/"←" characters, which render at whatever size and baseline the
 * font decides and end up floating next to the label. This scales with the text colour and
 * sits on the line properly. Decorative only — the link's own words carry the meaning.
 */
export function ChevronIcon({ direction = "right" }: { direction?: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5 shrink-0"
    >
      <path d={direction === "right" ? "m9 6 6 6-6 6" : "m15 6-6 6 6 6"} />
    </svg>
  );
}
