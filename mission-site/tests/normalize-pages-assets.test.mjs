import { afterEach, describe, expect, it } from "vitest";
import { existsSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { normalizePagesAssets } from "../scripts/normalize-pages-assets.mjs";

let directory;

afterEach(() => {
  if (directory) {
    rmSync(directory, { recursive: true, force: true });
    directory = undefined;
  }
});

describe("normalizePagesAssets", () => {
  it("moves base-path-prefixed framework assets to the Pages artifact root", () => {
    directory = mkdtempSync(join(tmpdir(), "mission-pages-"));
    const nestedAssets = join(
      directory,
      "mission-site",
      "_next",
      "static",
    );
    mkdirSync(nestedAssets, { recursive: true });
    writeFileSync(join(nestedAssets, "app.js"), "framework asset");

    normalizePagesAssets(directory, "/mission-site");

    expect(existsSync(join(directory, "_next", "static", "app.js"))).toBe(
      true,
    );
    expect(existsSync(join(directory, "mission-site", "_next"))).toBe(false);
  });
});
