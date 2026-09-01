import {
  copyFileSync,
  existsSync,
  readdirSync,
  renameSync,
  rmdirSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export function normalizePagesAssets(clientDirectory, basePath) {
  const rootSurface = join(clientDirectory, "index.html");
  if (!existsSync(rootSurface)) {
    throw new Error("Vinext root surface was not exported.");
  }
  copyFileSync(rootSurface, join(clientDirectory, "404.html"));

  const segments = basePath.split("/").filter(Boolean);

  if (segments.length === 0) {
    return;
  }

  if (segments.some((segment) => segment === "." || segment === "..")) {
    throw new Error(`Invalid GitHub Pages base path: ${basePath}`);
  }

  const nestedBase = join(clientDirectory, ...segments);
  const nestedAssets = join(nestedBase, "_next");
  const rootAssets = join(clientDirectory, "_next");

  if (!existsSync(nestedAssets)) {
    if (existsSync(rootAssets)) {
      return;
    }
    throw new Error(`Vinext framework assets were not found for ${basePath}.`);
  }

  if (existsSync(rootAssets)) {
    throw new Error("Cannot normalize Vinext assets: dist/client/_next exists.");
  }

  renameSync(nestedAssets, rootAssets);

  if (readdirSync(nestedBase).length === 0) {
    rmdirSync(nestedBase);
  }
}

const scriptPath = fileURLToPath(import.meta.url);

if (process.argv[1] && resolve(process.argv[1]) === scriptPath) {
  const projectRoot = join(dirname(scriptPath), "..");
  normalizePagesAssets(
    join(projectRoot, "dist", "client"),
    process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  );
}
