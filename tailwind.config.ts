import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f4f7f5",
          100: "#e3ebe5",
          200: "#c6d7cb",
          300: "#9fbca8",
          400: "#729a7f",
          500: "#4f7d5e",
          600: "#3c634a",
          700: "#324f3d",
          800: "#2b4033",
          900: "#25352c",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
