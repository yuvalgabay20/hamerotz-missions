import { describe, expect, it } from "vitest";
import { patchVinextPrerenderSource } from "../scripts/patch-vinext-static-export.mjs";

describe("patchVinextPrerenderSource", () => {
  it("uses the configured base path and trailing slash for prerender requests", () => {
    const source = [
      'const htmlRequest = new Request(`http://localhost${urlPath}`, { headers: htmlHeaders });',
      'const rscRequest = new Request(`http://localhost${urlPath}`, { headers: rscHeaders });',
      "const outputPath = getAppRouteOutputPath(urlPath);",
    ].join("\n");

    const patched = patchVinextPrerenderSource(source);

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
});
