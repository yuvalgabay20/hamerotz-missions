import { describe, expect, it } from "vitest";
import { sitePath } from "@/lib/site-path";

describe("sitePath", () => {
  it("adds the GitHub Pages base path exactly once", () => {
    expect(sitePath("/videos/mission-01.mp4", "/race")).toBe(
      "/race/videos/mission-01.mp4",
    );
    expect(sitePath("/videos/mission-01.mp4", "")).toBe(
      "/videos/mission-01.mp4",
    );
  });
});
