import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "."),
      "next/navigation": path.resolve(
        import.meta.dirname,
        "node_modules/vinext/dist/shims/navigation-errors.js",
      ),
      "next/font/google": path.resolve(import.meta.dirname, "tests/mocks/next-font.ts"),
      "next/font/local": path.resolve(import.meta.dirname, "tests/mocks/next-font.ts"),
    },
  },
  test: { environment: "jsdom", setupFiles: ["./tests/setup.ts"] },
});
