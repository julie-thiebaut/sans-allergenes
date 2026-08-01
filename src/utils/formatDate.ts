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
