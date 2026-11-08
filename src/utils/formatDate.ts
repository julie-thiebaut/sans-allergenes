// Built once: creating an Intl.DateTimeFormat takes about a millisecond on a slow phone, and the
// list writes a date on each of its hundreds of cards.
const VERIFIED_DATE = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatVerifiedDate(isoDate: string): string {
  try {
    return VERIFIED_DATE.format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}

// « septembre 2026 ». En UTC, le fuseau des dates enregistrées : ailleurs, le 1er du mois à minuit
// s'afficherait sur un fuseau en retard comme le mois précédent.
const MONTH_YEAR = new Intl.DateTimeFormat("fr-FR", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatMonthYear(isoDate: string): string {
  try {
    return MONTH_YEAR.format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}
