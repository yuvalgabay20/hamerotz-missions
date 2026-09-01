import { describe, expect, it } from "vitest";
import { patchVinextPrerenderSource } from "../scripts/patch-vinext-static-export.mjs";

describe("patchVinextPrerenderSource", () => {
  const originalSource = [
      'const htmlRequest = new Request(`http://localhost${urlPath}`, { headers: htmlHeaders });',
      'const rscRequest = new Request(`http://localhost${urlPath}`, { headers: rscHeaders });',
      "const outputPath = getAppRouteOutputPath(urlPath);",
  ].join("\n");

  it("patches a fully original Vinext source", () => {
    const patched = patchVinextPrerenderSource(originalSource);

    expect(patched).toContain(
      'const prerenderRequestPath = `${config.basePath ?? ""}${urlPath}${config.trailingSlash && urlPath !== "/" && !urlPath.endsWith("/") ? "/" : ""}`;',
    );
    expect(patched).toContain(
      "const htmlRequest = new Request(`http://localhost${prerenderRequestPath}`",
    );
    expect(patched).toContain(
      "const rscRequest = new Request(`http://localhost${prerenderRequestPath}`",
    );
    expect(patched).toContain(
      'const outputPath = mode === "export" ? metadataOutputPath(urlPath) : getAppRouteOutputPath(urlPath);',
    );
  });

  it("accepts a fully patched source idempotently", () => {
    const patched = patchVinextPrerenderSource(originalSource);

    expect(patchVinextPrerenderSource(patched)).toBe(patched);
  });

  it("rejects a mixed request patch state", () => {
    const patched = patchVinextPrerenderSource(originalSource);
    const mixed = patched.replace(
      'const htmlRequest = new Request(`http://localhost${prerenderRequestPath}`, { headers: htmlHeaders });',
      'const htmlRequest = new Request(`http://localhost${urlPath}`, { headers: htmlHeaders });',
    );

    expect(() => patchVinextPrerenderSource(mixed)).toThrow(
      "Vinext prerender source is partially patched or corrupt.",
    );
  });

  it("rejects a corrupt source with a missing request anchor", () => {
    const corrupt = originalSource.replace(
      'const rscRequest = new Request(`http://localhost${urlPath}`, { headers: rscHeaders });',
      "",
    );

    expect(() => patchVinextPrerenderSource(corrupt)).toThrow(
      "Vinext prerender source is partially patched or corrupt.",
    );
  });
});
