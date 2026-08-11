/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// BASE_PATH is computed in CI from the actual GitHub repository name
// (see .github/workflows/ci-deploy.yml) so nothing needs to be hardcoded here.
// Locally it defaults to "/" so `npm run dev` / `npm run preview` work at the root.
const basePath = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base: basePath,
  plugins: [react()],
  // Vite doesn't read PORT on its own; honouring it lets a second dev server start alongside
  // one already holding 5173 instead of failing.
  server: { port: Number(process.env.PORT) || 5173 },
  build: {
    outDir: "dist",
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/unit/**/*.test.{ts,tsx}", "tests/component/**/*.test.{ts,tsx}"],
    css: false,
  },
});
