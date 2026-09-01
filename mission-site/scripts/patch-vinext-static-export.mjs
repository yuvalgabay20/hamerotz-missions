import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const VINEXT_VERSION = "1.0.0-beta.8";
const PRERENDER_REQUEST_PATH =
  'const prerenderRequestPath = `${config.basePath ?? ""}${urlPath}${config.trailingSlash && urlPath !== "/" && !urlPath.endsWith("/") ? "/" : ""}`;';
const ORIGINAL_HTML_REQUEST =
  'const htmlRequest = new Request(`http://localhost${urlPath}`, { headers: htmlHeaders });';
const PATCHED_HTML_REQUEST =
  'const htmlRequest = new Request(`http://localhost${prerenderRequestPath}`, { headers: htmlHeaders });';
const ORIGINAL_RSC_REQUEST =
  'const rscRequest = new Request(`http://localhost${urlPath}`, { headers: rscHeaders });';
const PATCHED_RSC_REQUEST =
  'const rscRequest = new Request(`http://localhost${prerenderRequestPath}`, { headers: rscHeaders });';
const ORIGINAL_METADATA_OUTPUT =
  "const outputPath = getAppRouteOutputPath(urlPath);";
const PATCHED_METADATA_OUTPUT =
  'const outputPath = mode === "export" ? metadataOutputPath(urlPath) : getAppRouteOutputPath(urlPath);';

export function patchVinextPrerenderSource(source) {
  let patched = source;

  if (!patched.includes(PRERENDER_REQUEST_PATH)) {
    if (
      !patched.includes(ORIGINAL_HTML_REQUEST) ||
      !patched.includes(ORIGINAL_RSC_REQUEST)
    ) {
      throw new Error(
        "Vinext prerender request internals changed; review the static-export compatibility patch.",
      );
    }

    patched = patched
      .replace(
        ORIGINAL_HTML_REQUEST,
        `${PRERENDER_REQUEST_PATH}\n\t\t\t\t${PATCHED_HTML_REQUEST}`,
      )
      .replace(ORIGINAL_RSC_REQUEST, PATCHED_RSC_REQUEST);
  }

  if (patched.includes(ORIGINAL_METADATA_OUTPUT)) {
    patched = patched.replace(
      ORIGINAL_METADATA_OUTPUT,
      PATCHED_METADATA_OUTPUT,
    );
  } else if (!patched.includes(PATCHED_METADATA_OUTPUT)) {
    throw new Error(
      "Vinext metadata export internals changed; review the static-export compatibility patch.",
    );
  }

  return patched;
}

const scriptPath = fileURLToPath(import.meta.url);

if (process.argv[1] && resolve(process.argv[1]) === scriptPath) {
  const projectRoot = join(dirname(scriptPath), "..");
  const vinextRoot = join(projectRoot, "node_modules", "vinext");
  const packagePath = join(vinextRoot, "package.json");
  const packageJson = JSON.parse(readFileSync(packagePath, "utf8"));

  if (packageJson.version !== VINEXT_VERSION) {
    throw new Error(
      `Expected vinext ${VINEXT_VERSION}, found ${packageJson.version}. Review the static-export compatibility patch.`,
    );
  }

  const prerenderPath = join(vinextRoot, "dist", "build", "prerender.js");
  const source = readFileSync(prerenderPath, "utf8");
  const patched = patchVinextPrerenderSource(source);

  if (patched !== source) {
    writeFileSync(prerenderPath, patched, "utf8");
    console.log("Applied Vinext beta.8 static-export compatibility patch.");
  }
}
