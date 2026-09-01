import { afterEach, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { findOversizedVideos } from "../scripts/check-video-size.mjs";

let directory;

afterEach(() => {
  if (directory) {
    rmSync(directory, { recursive: true, force: true });
    directory = undefined;
  }
});

describe("findOversizedVideos", () => {
  it("returns files whose byte size reaches the hard limit", () => {
    directory = mkdtempSync(join(tmpdir(), "mission-videos-"));
    writeFileSync(join(directory, "small.mp4"), Buffer.alloc(9));
    writeFileSync(join(directory, "large.mp4"), Buffer.alloc(10));

    expect(findOversizedVideos(directory, 10)).toEqual(["large.mp4"]);
  });
});
