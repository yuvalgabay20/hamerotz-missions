import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";
import NotFound from "@/app/not-found";
import MissionRoute, {
  dynamicParams,
  generateMetadata,
  generateStaticParams,
} from "@/app/missions/[id]/page";

describe("mission route", () => {
  it("generates only catalogue routes and disables unknown dynamic params", () => {
    expect(dynamicParams).toBe(false);
    expect(generateStaticParams()).toEqual([{ id: "01" }]);
  });

  it("sets mission-specific noindex metadata", async () => {
    await expect(
      generateMetadata({ params: Promise.resolve({ id: "01" }) }),
    ).resolves.toMatchObject({
      title: "סימן דרך — שאלה 1",
      robots: { index: false, follow: false },
    });
  });

  it("renders the catalogue mission at its direct route", async () => {
    render(await MissionRoute({ params: Promise.resolve({ id: "01" }) }));
    expect(
      screen.getByRole("heading", { name: "באיזו עיר נמצא מגדל אייפל?" }),
    ).toBeVisible();
  });
});

describe("non-mission surfaces", () => {
  it.each([
    ["root", Home],
    ["not found", NotFound],
  ])("keeps the %s surface concise and free of navigation", (_name, Surface) => {
    render(<Surface />);
    expect(screen.getByRole("heading", { name: "המשימה לא נמצאה" })).toBeVisible();
    expect(screen.queryAllByRole("link")).toHaveLength(0);
    expect(screen.queryAllByRole("navigation")).toHaveLength(0);
  });
});
