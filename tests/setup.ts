import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement matchMedia — provide a default (no matches) implementation so
// components using useMediaQuery don't crash. This is intentionally a PLAIN function, not a
// vi.fn(): tests that need to simulate a specific viewport use vi.spyOn(window, "matchMedia"),
// which saves this plain function as the "original" — a bare vi.fn() here would instead get
// reset to returning undefined by another test file's vi.restoreAllMocks()/clearAllMocks().
function defaultMatchMedia(query: string): MediaQueryList {
  return {
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  } as unknown as MediaQueryList;
}

if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: defaultMatchMedia,
  });
}
