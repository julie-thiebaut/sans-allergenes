import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 500 is rgb(241,177,4), the exact brand color requested — it is also the yellow the
        // hero illustration is drawn in, so the two match rather than sitting a shade apart.
        // Used everywhere,
        // including as text/links/focus-rings on white. That measures ~1.9:1 contrast
        // against white, well under the WCAG AA text minimum (4.5:1) — an intentional,
        // explicitly requested trade-off favoring color fidelity over contrast compliance.
        // 600/700+ (same hue, darkened) are unused for now but kept available for any
        // future spot that needs a WCAG-safe variant of the brand color.
        brand: {
          50: "#fef8e7",
          100: "#fdedc0",
          200: "#fbdd86",
          300: "#f7cb4c",
          400: "#f4be20",
          500: "#f1b104",
          600: "#be8c03",
          700: "#6b4f02",
          800: "#4a3702",
          900: "#302401",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
