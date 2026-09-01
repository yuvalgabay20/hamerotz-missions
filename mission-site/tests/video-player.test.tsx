import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VideoPlayer } from "@/components/video-player";

describe("VideoPlayer", () => {
  it("renders a local inline MP4 with native controls and no autoplay", () => {
    const { container } = render(
      <VideoPlayer src="/videos/mission-01.mp4" title="סרטון משימה 1" />,
    );
    const video = container.querySelector("video");
    expect(video).toHaveAttribute("controls");
    expect(video).toHaveAttribute("playsinline");
    expect(video).not.toHaveAttribute("autoplay");
    expect(video).toHaveAttribute("src", "/videos/mission-01.mp4");
  });

  it("keeps the mission visible and reports a video load error", () => {
    const { container } = render(
      <VideoPlayer src="/videos/missing.mp4" title="סרטון משימה" />,
    );
    fireEvent.error(container.querySelector("video")!);
    expect(screen.getByText("הסרטון עדיין לא זמין")).toBeVisible();
  });
});
