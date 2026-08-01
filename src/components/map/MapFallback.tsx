export function MapFallback() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 rounded-lg bg-neutral-100 p-6 text-center text-neutral-600">
      <svg
        aria-hidden="true"
        className="h-10 w-10 opacity-50"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4m0 0L9 7"
        />
      </svg>
      <p className="font-medium">Carte temporairement indisponible</p>
      <p className="text-sm">
        La liste des restaurants reste utilisable sans la carte. Réessayez plus tard.
      </p>
    </div>
  );
}
