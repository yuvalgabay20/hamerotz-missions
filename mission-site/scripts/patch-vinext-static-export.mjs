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

function occurrenceCount(source, anchor) {
  return source.split(anchor).length - 1;
}

export function patchVinextPrerenderSource(source) {
  const counts = {
    requestPath: occurrenceCount(source, PRERENDER_REQUEST_PATH),
    originalHtml: occurrenceCount(source, ORIGINAL_HTML_REQUEST),
    patchedHtml: occurrenceCount(source, PATCHED_HTML_REQUEST),
    originalRsc: occurrenceCount(source, ORIGINAL_RSC_REQUEST),
    patchedRsc: occurrenceCount(source, PATCHED_RSC_REQUEST),
    originalMetadata: occurrenceCount(source, ORIGINAL_METADATA_OUTPUT),
    patchedMetadata: occurrenceCount(source, PATCHED_METADATA_OUTPUT),
  };
  const fullyOriginal =
    counts.requestPath === 0 &&
    counts.originalHtml === 1 &&
    counts.patchedHtml === 0 &&
    counts.originalRsc === 1 &&
    counts.patchedRsc === 0 &&
    counts.originalMetadata === 1 &&
    counts.patchedMetadata === 0;
  const fullyPatched =
    counts.requestPath === 1 &&
    counts.originalHtml === 0 &&
    counts.patchedHtml === 1 &&
    counts.originalRsc === 0 &&
    counts.patchedRsc === 1 &&
    counts.originalMetadata === 0 &&
    counts.patchedMetadata === 1;

  if (fullyPatched) {
    return source;
  }

  if (!fullyOriginal) {
    throw new Error(
      "Vinext prerender source is partially patched or corrupt. Review the static-export compatibility patch.",
    );
  }

  return source
    .replace(
      ORIGINAL_HTML_REQUEST,
      `${PRERENDER_REQUEST_PATH}\n\t\t\t\t${PATCHED_HTML_REQUEST}`,
    )
    .replace(ORIGINAL_RSC_REQUEST, PATCHED_RSC_REQUEST)
    .replace(ORIGINAL_METADATA_OUTPUT, PATCHED_METADATA_OUTPUT);
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
