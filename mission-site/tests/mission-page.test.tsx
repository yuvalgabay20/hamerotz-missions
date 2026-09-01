import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MissionPage } from "@/components/mission-page";
import { getMission } from "@/lib/missions";

describe("MissionPage", () => {
  it("renders the approved static question structure without answer controls", () => {
    const mission = getMission("01");
    if (!mission) throw new Error("mission 01 missing");
    render(<MissionPage mission={mission} />);

    expect(screen.getByRole("heading", { name: "סימן דרך" })).toBeVisible();
    expect(screen.getByText("שאלה 1")).toBeVisible();
    expect(screen.getByText("באיזו עיר נמצא מגדל אייפל?")).toBeVisible();
    for (const answer of ["פריז", "רומא", "לונדון", "מדריד"]) {
      expect(screen.getByText(answer)).toBeVisible();
    }
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  it("keeps the approved content order and exposes the local video with native controls", () => {
    const mission = getMission("01");
    if (!mission) throw new Error("mission 01 missing");
    const { container } = render(<MissionPage mission={mission} />);

    const card = container.querySelector("article");
    expect(card).not.toBeNull();
    expect(Array.from(card!.children, (element) => element.tagName)).toEqual([
      "IMG",
      "H1",
      "P",
      "H2",
      "OL",
      "VIDEO",
    ]);

    const logo = screen.getByRole("img", { name: "המירוץ למיליון" });
    expect(logo).toHaveAttribute("src", "/brand/amazing-race-logo.png");

    const answers = screen.getAllByRole("listitem");
    expect(answers).toHaveLength(4);
    for (const answer of answers) {
      expect(answer.querySelector("button, a, input, select, textarea")).toBeNull();
    }

    const video = container.querySelector("video");
    expect(video).toHaveAttribute("controls");
    expect(video).toHaveAttribute("playsinline");
    expect(video).toHaveAttribute("preload", "metadata");
    expect(video).not.toHaveAttribute("autoplay");
    expect(video).toHaveAttribute("src", "/videos/mission-01.mp4");
  });
});
