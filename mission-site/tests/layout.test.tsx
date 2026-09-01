import { describe, expect, it } from "vitest";
import RootLayout, { createMetadata } from "@/app/layout";

describe("RootLayout", () => {
  it("marks the complete document as Hebrew RTL", () => {
    const document = RootLayout({ children: <main>תוכן</main> });
    expect(document.type).toBe("html");
    expect(document.props.lang).toBe("he");
    expect(document.props.dir).toBe("rtl");
  });

  it("uses absolute social image URLs only for a real configured site URL", () => {
    const publicMetadata = createMetadata(
      "https://yuvalgabay20.github.io/mission-site",
    );

    expect(publicMetadata.openGraph).toEqual({
      images: ["https://yuvalgabay20.github.io/mission-site/og.png"],
    });
    expect(publicMetadata.twitter).toEqual({
      images: ["https://yuvalgabay20.github.io/mission-site/og.png"],
    });

    for (const siteUrl of [undefined, "", "http://localhost:3000"] as const) {
      const localMetadata = createMetadata(siteUrl);
      expect(localMetadata.openGraph).toBeUndefined();
      expect(localMetadata.twitter).toBeUndefined();
      expect(JSON.stringify(localMetadata)).not.toContain("localhost");
    }
  });
});
