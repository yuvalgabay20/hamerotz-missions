import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  probeMissingPage,
  verifyPagesArtifact,
} from "../scripts/verify-pages-artifact.mjs";
import { normalizePagesAssets } from "../scripts/normalize-pages-assets.mjs";

let directory;

afterEach(() => {
  if (directory) {
    rmSync(directory, { recursive: true, force: true });
    directory = undefined;
  }
});

function writeArtifact({ metadata = "" } = {}) {
  directory = mkdtempSync(join(tmpdir(), "mission-artifact-"));
  mkdirSync(join(directory, "missions", "01"), { recursive: true });
  const head = `<head>${metadata}</head>`;
  writeFileSync(
    join(directory, "index.html"),
    `<!doctype html><html lang="he" dir="rtl">${head}<body><h1>המשימה לא נמצאה</h1></body></html>`,
  );
  writeFileSync(
    join(directory, "404.html"),
    "This page could not be found",
  );
  writeFileSync(
    join(directory, "missions", "01", "index.html"),
    `<!doctype html><html lang="he" dir="rtl">${head}<body>משימה</body></html>`,
  );
  normalizePagesAssets(directory, "");
}

describe("GitHub Pages artifact", () => {
  it("returns the approved Hebrew RTL surface with HTTP 404 at the mounted base path", async () => {
    writeArtifact();

    const response = await probeMissingPage(directory, "/mission-site");

    expect(response.status).toBe(404);
    expect(response.body).toContain("המשימה לא נמצאה");
    expect(response.body).toMatch(/<html[^>]+dir=["']rtl["']/i);
  });

  it("accepts absolute social images with the configured Pages base path", async () => {
    const imageUrl = "https://yuvalgabay20.github.io/mission-site/og.png";
    writeArtifact({
      metadata: `<meta property="og:image" content="${imageUrl}"><meta name="twitter:image" content="${imageUrl}">`,
    });

    await expect(
      verifyPagesArtifact(
        directory,
        "/mission-site",
        "https://yuvalgabay20.github.io/mission-site",
      ),
    ).resolves.toBeUndefined();
  });

  it("accepts omitted social images without a site URL and rejects localhost leakage", async () => {
    writeArtifact();
    await expect(
      verifyPagesArtifact(directory, "/mission-site", undefined),
    ).resolves.toBeUndefined();

    writeFileSync(
      join(directory, "missions", "01", "index.html"),
      '<html lang="he" dir="rtl"><head><meta property="og:image" content="http://localhost:3000/og.png"></head><body>משימה</body></html>',
    );

    await expect(
      verifyPagesArtifact(directory, "/mission-site", undefined),
    ).rejects.toThrow(/localhost/i);
  });

  it("rejects social image metadata anywhere in an artifact built without a site URL", async () => {
    writeArtifact();
    writeFileSync(
      join(directory, "index.html"),
      '<html lang="he" dir="rtl"><head><meta property="og:image" content="https://example.com/og.png"></head><body><h1>המשימה לא נמצאה</h1></body></html>',
    );

    await expect(
      verifyPagesArtifact(directory, "/mission-site", undefined),
    ).rejects.toThrow(/omitted/i);
  });
});
