import { afterEach, describe, expect, it } from "vitest";
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
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
    writeFileSync(
      join(directory, "index.html"),
      '<html lang="he" dir="rtl"><h1>המשימה לא נמצאה</h1></html>',
    );

    normalizePagesAssets(directory, "/mission-site");

    expect(existsSync(join(directory, "_next", "static", "app.js"))).toBe(
      true,
    );
    expect(existsSync(join(directory, "mission-site", "_next"))).toBe(false);
  });

  it("uses the exported Hebrew root surface as the custom Pages 404", () => {
    directory = mkdtempSync(join(tmpdir(), "mission-pages-"));
    const rootSurface = '<!doctype html><html lang="he" dir="rtl"><h1>המשימה לא נמצאה</h1></html>';
    writeFileSync(join(directory, "index.html"), rootSurface);
    writeFileSync(join(directory, "404.html"), "This page could not be found");

    normalizePagesAssets(directory, "");

    expect(readFileSync(join(directory, "404.html"), "utf8")).toBe(rootSurface);
  });
});
