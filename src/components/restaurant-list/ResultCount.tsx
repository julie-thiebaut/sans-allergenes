export function ResultCount({ count }: { count: number }) {
  return (
    <p aria-live="polite" className="text-sm text-neutral-600">
      {count} restaurant{count > 1 ? "s" : ""} {count > 1 ? "trouvés" : "trouvé"}
    </p>
  );
}
