import { describe, expect, it } from "vitest";
import RootLayout from "@/app/layout";

describe("RootLayout", () => {
  it("marks the complete document as Hebrew RTL", () => {
    const document = RootLayout({ children: <main>תוכן</main> });
    expect(document.type).toBe("html");
    expect(document.props.lang).toBe("he");
    expect(document.props.dir).toBe("rtl");
  });
});
