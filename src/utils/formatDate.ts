export function formatVerifiedDate(isoDate: string): string {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}

// « septembre 2026 ». En UTC, le fuseau des dates enregistrées : ailleurs, le 1er du mois à minuit
// s'afficherait sur un fuseau en retard comme le mois précédent.
export function formatMonthYear(isoDate: string): string {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}
