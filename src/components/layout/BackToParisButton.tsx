export function BackToParisButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-800 shadow hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-600"
    >
      ↺ Revenir à la vue de Paris
    </button>
  );
}
