import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Bottom sheet holding whatever filters a screen offers — the restaurant list uses it for the
 * full filter bar, a restaurant page for its menu's allergen filter.
 */
export function MobileFilterSheet({
  children,
  title = "Filtres",
}: {
  children: ReactNode;
  title?: string;
}) {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      {/* Primary action on mobile, so it gets the brand fill rather than the white/grey
          treatment it had — which left it invisible against the white bar it sits in. The
          focus ring is dark, not brand: a mustard ring on mustard reads as nothing. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-brand-500 px-3 py-2 text-sm font-semibold text-neutral-900 hover:bg-brand-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
        aria-haspopup="dialog"
      >
        {title}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="relative max-h-[80vh] w-full overflow-y-auto rounded-t-xl bg-white p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{title}</h2>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"
                aria-label="Fermer les filtres"
              >
                ✕
              </button>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
}
