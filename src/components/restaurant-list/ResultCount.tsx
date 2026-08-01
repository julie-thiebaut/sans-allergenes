export function ResultCount({ count }: { count: number }) {
  return (
    <p aria-live="polite" className="px-3 py-2 text-sm text-neutral-600">
      {count} restaurant{count > 1 ? "s" : ""} {count > 1 ? "trouvés" : "trouvé"}
    </p>
  );
}
