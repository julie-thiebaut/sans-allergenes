/** Derives a French arrondissement label from a Paris postal code (750XX), or null if not Paris. */
export function arrondissementFromPostalCode(postalCode: string): string | null {
  if (!/^75\d{3}$/.test(postalCode)) return null;
  // Reading the last two digits (rather than assuming a "750XX" form) also covers 75116, the
  // second still-current code for the 16th — the only arrondissement that has two.
  const num = Number(postalCode.slice(3));
  if (num < 1 || num > 20) return null;
  return num === 1 ? "1er arrondissement" : `${num}e arrondissement`;
}
