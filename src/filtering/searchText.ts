// Combining diacritical marks block (U+0300–U+036F), produced by String.normalize("NFD")
// splitting accented characters into base letter + combining mark. Filtering by numeric
// code point (rather than a regex unicode-range literal) avoids any ambiguity about which
// characters are actually encoded in this source file.
const COMBINING_DIACRITICS_START = 0x0300;
const COMBINING_DIACRITICS_END = 0x036f;

function stripDiacritics(value: string): string {
  return Array.from(value)
    .filter((char) => {
      const codePoint = char.codePointAt(0) ?? 0;
      return codePoint < COMBINING_DIACRITICS_START || codePoint > COMBINING_DIACRITICS_END;
    })
    .join("");
}

export function normalizeSearchText(value: string): string {
  return stripDiacritics(value.normalize("NFD")).toLowerCase().trim();
}
