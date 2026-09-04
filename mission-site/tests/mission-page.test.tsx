import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MissionPage } from "@/components/mission-page";
import { getMission } from "@/lib/missions";

describe("MissionPage", () => {
  it("renders the approved static question structure without answer controls", () => {
    const mission = getMission("01");
    if (!mission) throw new Error("mission 01 missing");
    render(<MissionPage mission={mission} />);

    expect(screen.getByRole("heading", { name: "תחנה ראשונה" })).toBeVisible();
    expect(screen.getByText(/התחנה הזו במירוץ/)).toBeVisible();
    for (const answer of [
      "עולם שבו גולדי הוא כלב ממושמע ומאולף.",
      "עולם שבו רמזים, קסמים ושרביטים יכולים לפתוח דלתות.",
      "עולם שבו אוריה זוכרת הכול.",
      "עולם שבו יובל חושב רק חמש מחשבות ביום.",
    ]) {
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
      "H2",
      "OL",
      "VIDEO",
      "LABEL",
    ]);

    const logo = screen.getByRole("img", { name: "המירוץ למיליון" });
    expect(logo).toHaveAttribute("src", "/brand/amazing-race-logo.png");

    const answers = screen.getAllByRole("listitem");
    expect(answers).toHaveLength(4);
    for (const answer of answers) {
      expect(answer.querySelector("button, a, input, select, textarea")).toBeNull();
    }

    const video = container.querySelector("video");
    expect(video).toHaveAttribute("aria-label", "סרטון תחנה ראשונה");
    expect(video).toHaveAttribute("controls");
    expect(video).toHaveAttribute("playsinline");
    expect(video).toHaveAttribute("preload", "none");
    expect(video).not.toHaveAttribute("autoplay");
    expect(video).toHaveAttribute("src", "/videos/video-02.mp4");
  });

  it("renders the comic station without answer choices and with its follow-up note", () => {
    const mission = getMission("04");
    if (!mission) throw new Error("mission 04 missing");
    render(<MissionPage mission={mission} />);

    expect(screen.getByRole("heading", { name: "תחנה רביעית" })).toBeVisible();
    expect(screen.getByText(/מה אוריה הכי אוהבת לאכול/)).toBeVisible();
    expect(screen.queryAllByRole("listitem")).toHaveLength(4);
    expect(screen.getByText(/קראי את הקומיקס/)).toBeVisible();
    expect(screen.getByText(/מסעדת סושי/)).toBeVisible();
  });
});
